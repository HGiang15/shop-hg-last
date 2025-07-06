import React, {useState, useEffect} from 'react';
import styles from './MainPageAddress.module.scss';
import Image from 'next/image';
import icons from '@/constants/static/icons';
import Button from '@/components/common/Button/Button';
import FormCreateAddress from '../FormCreateAddress/FormCreateAddress';
import FormUpdateAddress from '../FormUpdateAddress/FormUpdateAddress';
import FormDeleteAddress from '../FormDeleteAddress/FormDeleteAddress';
import {getUserAddresses, deleteAddress, setDefaultAddress} from '@/services/userAddressService';
import {toast} from 'react-toastify';

const MainPageAddress = () => {
	const [addresses, setAddresses] = useState([]);
	const [defaultAddressId, setDefaultAddressId] = useState(null);
	const [showCreateForm, setShowCreateForm] = useState(false);
	const [showUpdateForm, setShowUpdateForm] = useState(false);
	const [selectedAddress, setSelectedAddress] = useState(null);
	const [showDeleteModal, setShowDeleteModal] = useState(false);
	const [addressToDelete, setAddressToDelete] = useState(null);

	const handleUpdateAddressInList = (updatedAddress) => {
		setAddresses((prev) => prev.map((addr) => (addr._id === updatedAddress._id ? updatedAddress : addr)));
	};

	const fetchAddresses = async () => {
		try {
			const res = await getUserAddresses();
			setAddresses(res || []);
			const defaultAddr = res.find((a) => a.isDefault);
			setDefaultAddressId(defaultAddr?._id || null);
		} catch (err) {
			console.error('Lỗi khi lấy danh sách địa chỉ:', err);
		}
	};

	useEffect(() => {
		fetchAddresses();
	}, []);

	const handleSetDefault = async (id) => {
		try {
			await setDefaultAddress(id);
			await fetchAddresses();
			toast.success('Đã đặt địa chỉ mặc định!');
		} catch (err) {
			toast.error('Không thể đặt mặc định!');
		}
	};

	const handleUpdate = (address) => {
		setSelectedAddress(address);
		setShowUpdateForm(true);
	};

	const handleDeleteClick = (address) => {
		setAddressToDelete(address);
		setShowDeleteModal(true);
	};

	// Xóa địa chỉ
	const handleConfirmDelete = async () => {
		if (!addressToDelete) return;
		try {
			await deleteAddress(addressToDelete._id);
			await fetchAddresses();
			toast.success('Xóa địa chỉ thành công!');
		} catch (err) {
			toast.error(err.message || 'Xóa địa chỉ thất bại');
		}
		setShowDeleteModal(false);
		setAddressToDelete(null);
	};

	return (
		<div className={styles.container}>
			<h2 className={styles.title}>Sổ địa chỉ</h2>

			<Button
				leftIcon={<Image src={icons.add} alt='Thêm' width={20} height={20} className={styles.iconAdd} />}
				className={styles.addAddressButton}
				onClick={() => setShowCreateForm(true)}
			>
				Thêm địa chỉ mới
			</Button>

			{addresses.map((item) => (
				<div key={item._id} className={styles.addressCard}>
					<div className={styles.addressInfo}>
						<div className={styles.name}>{item.name}</div>
						<div className={styles.phone}>SĐT: {item.phone}</div>
						<div className={styles.address}>
							Địa chỉ: {item.address}, {item.ward?.name}, {item.district?.name}, {item.province?.name}
						</div>
					</div>

					<div className={styles.addressActions}>
						{item.isDefault ? (
							<span className={styles.defaultTag}>Mặc định</span>
						) : (
							<Button className={styles.defaultButton} onClick={() => handleSetDefault(item._id)}>
								Đặt mặc định
							</Button>
						)}

						<Button className={styles.updateButton} onClick={() => handleUpdate(item)}>
							Cập nhật
						</Button>
						<Button className={styles.deleteButton} onClick={() => handleDeleteClick(item)}>
							Xóa
						</Button>
					</div>
				</div>
			))}

			{showCreateForm && (
				<FormCreateAddress
					onClose={() => {
						setShowCreateForm(false);
						fetchAddresses();
					}}
				/>
			)}
			{showUpdateForm && (
				<FormUpdateAddress
					onClose={() => setShowUpdateForm(false)}
					existingData={selectedAddress}
					addressId={selectedAddress?._id}
					onAddressUpdated={handleUpdateAddressInList}
				/>
			)}
			{showDeleteModal && <FormDeleteAddress onClose={() => setShowDeleteModal(false)} onConfirm={handleConfirmDelete} />}
		</div>
	);
};

export default MainPageAddress;
