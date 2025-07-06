import {useEffect, useState} from 'react';
import styles from './FormChangeAddress.module.scss';
import Button from '@/components/common/Button/Button';
import FormCreateAddress from '../../profile/FormCreateAddress/FormCreateAddress';
import {getUserAddresses, deleteAddress, setDefaultAddress} from '@/services/userAddressService';
import ConfirmDeleteModal from '../ConfirmDeleteModal/ConfirmDeleteModal';
import {toast} from 'react-toastify';

const FormChangeAddress = ({onClose, onAddressSelected, currentAddressId, onReloadAddresses}) => {
	const [showCreateForm, setShowCreateForm] = useState(false);
	const [addresses, setAddresses] = useState([]);
	const [selectedAddressId, setSelectedAddressId] = useState(null);

	const [showDeleteModal, setShowDeleteModal] = useState(false);
	const [addressToDelete, setAddressToDelete] = useState({id: null, name: ''});

	useEffect(() => {
		reloadAddresses();
	}, []);

	const reloadAddresses = async () => {
		try {
			const res = await getUserAddresses();
			setAddresses(res || []);
			if (res.length > 0) {
				if (currentAddressId && res.some((addr) => addr._id === currentAddressId)) {
					setSelectedAddressId(currentAddressId);
				} else {
					setSelectedAddressId(res[0]._id);
				}
			}
		} catch (error) {
			console.error('Không thể tải lại địa chỉ:', error);
		}
	};

	const handleAddAddress = () => setShowCreateForm(true);
	const handleCloseCreateForm = () => setShowCreateForm(false);
	const handleClose = () => onClose();

	const handleSetDefault = async (id) => {
		try {
			await setDefaultAddress(id);
			await reloadAddresses();
			onReloadAddresses?.();
			toast.success('Đã đặt địa chỉ mặc định!');
		} catch (err) {
			toast.error('Không thể đặt địa chỉ mặc định');
		}
	};

	const handleRequestDelete = (id, name) => {
		setAddressToDelete({id, name});
		setShowDeleteModal(true);
	};

	// Delete address
	const handleConfirmDelete = async () => {
		try {
			await deleteAddress(addressToDelete.id);
			await reloadAddresses();
			setShowDeleteModal(false);
			toast.success('Xóa địa chỉ thành công!');
		} catch (err) {
			toast.error(err.message || 'Xóa địa chỉ thất bại');
		}
	};

	return (
		<div className={styles.overlay}>
			<div className={styles.container}>
				<div className={styles.header}>
					<h2 className={styles.title}>Thay đổi địa chỉ</h2>
					<span className={styles.addAddress} onClick={handleAddAddress}>
						Thêm địa chỉ mới
					</span>
				</div>

				{showCreateForm && <FormCreateAddress onClose={handleCloseCreateForm} onAddressCreated={reloadAddresses} />}

				<div className={styles.addresses}>
					{addresses.map((addr) => (
						<div key={addr._id} className={styles.addressItem}>
							<div className={styles.addressTop}>
								<div className={styles.info}>
									<p className={styles.name}>{addr.name}</p>
									<span className={styles.phone}>{addr.phone}</span>
									<p className={styles.address}>
										{addr.address}, {addr.ward?.name}, {addr.district?.name}, {addr.province?.name}
									</p>
									{addr.isDefault && <span className={styles.defaultTag}>Mặc định</span>}
								</div>
								<div className={styles.actionsInline}>
									{!addr.isDefault && (
										<span className={styles.setDefault} onClick={() => handleSetDefault(addr._id)}>
											Đặt mặc định
										</span>
									)}
									<span className={styles.delete} onClick={() => handleRequestDelete(addr._id, addr.name)}>
										Xóa
									</span>
								</div>
							</div>
						</div>
					))}
				</div>

				<div className={styles.actions}>
					<Button className={styles.cancelButton} onClick={handleClose}>
						Đóng
					</Button>
				</div>
			</div>

			<ConfirmDeleteModal
				isOpen={showDeleteModal}
				onClose={() => setShowDeleteModal(false)}
				onConfirm={handleConfirmDelete}
				addressName={addressToDelete.name}
			/>
		</div>
	);
};

export default FormChangeAddress;
