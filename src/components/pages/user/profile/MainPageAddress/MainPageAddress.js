import React, {useState} from 'react';
import styles from './MainPageAddress.module.scss';
import Image from 'next/image';
import icons from '@/constants/static/icons';
import Button from '@/components/common/Button/Button';
import FormCreateAddress from '../FormCreateAddress/FormCreateAddress';
import FormUpdateAddress from '../FormUpdateAddress/FormUpdateAddress';
import FormDeleteAddress from '../FormDeleteAddress/FormDeleteAddress';

const mockAddresses = [
	{
		id: 1,
		name: 'Nguyễn Đăng Hoàng Giang',
		phone: '0398162589',
		address: 'Tổ 30, phường Thượng Thanh, quận Long Biên, thành phố Hà Nội',
	},
	{
		id: 2,
		name: 'Nguyễn Đăng Hoàng Giang',
		phone: '0398162589',
		address: 'Tổ 30, phường Thượng Thanh, quận Long Biên, thành phố Hà Nội',
	},
];

const MainPageAddress = () => {
	const [showCreateForm, setShowCreateForm] = useState(false);
	const [showUpdateForm, setShowUpdateForm] = useState(false);
	const [selectedAddress, setSelectedAddress] = useState(null);
	const [showDeleteModal, setShowDeleteModal] = useState(false);
	const [addressToDelete, setAddressToDelete] = useState(null);
	const [defaultAddressId, setDefaultAddressId] = useState(mockAddresses[0].id);

	const handleSetDefault = (id) => {
		setDefaultAddressId(id);
	};

	const handleUpdate = (address) => {
		setSelectedAddress(address);
		setShowUpdateForm(true);
	};

	const handleDeleteClick = (address) => {
		setAddressToDelete(address);
		setShowDeleteModal(true);
	};

	const handleConfirmDelete = () => {
		console.log('Xoá địa chỉ:', addressToDelete);
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

			{mockAddresses.map((item) => (
				<div key={item.id} className={styles.addressCard}>
					<div className={styles.addressInfo}>
						<div className={styles.name}>{item.name}</div>
						<div className={styles.phone}>Số điện thoại: {item.phone}</div>
						<div className={styles.address}>Địa chỉ: {item.address}</div>
					</div>

					<div className={styles.addressActions}>
						{defaultAddressId === item.id ? (
							<span className={styles.defaultTag}></span>
						) : (
							<Button className={styles.defaultButton} onClick={() => handleSetDefault(item.id)}>
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

			{showCreateForm && <FormCreateAddress onClose={() => setShowCreateForm(false)} />}
			{showUpdateForm && <FormUpdateAddress onClose={() => setShowUpdateForm(false)} defaultData={selectedAddress} />}
			{showDeleteModal && <FormDeleteAddress onClose={() => setShowDeleteModal(false)} onConfirm={handleConfirmDelete} />}
		</div>
	);
};

export default MainPageAddress;
