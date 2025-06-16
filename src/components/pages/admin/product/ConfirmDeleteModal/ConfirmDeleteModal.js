import React from 'react';
import styles from './ConfirmDeleteModal.module.scss';
import Image from 'next/image';
import icons from '@/constants/static/icons';
import Button from '@/components/common/Button/Button';

const ConfirmDeleteModal = ({isOpen, onClose, onConfirm, productName}) => {
	if (!isOpen) return null;

	return (
		<div className={styles.overlay}>
			<div className={styles.modal}>
				<Button
					className={styles.closeButton}
					onClick={onClose}
					centerIcon={<Image src={icons.timesCircle} alt='iconClose' width={24} height={24} />}
				></Button>
				<div className={styles.wrapper}>
					<Image src={icons.question} alt='Xóa sản phẩm' width={60} height={60} />
					<h2>Xóa sản phẩm</h2>
					{/* <p>Bạn có chắc chắn muốn xóa sản phẩm &quot;{productName}&quot;?</p> */}
					<p>Bạn có chắc chắn muốn xóa sản phẩm này?</p>
				</div>
				<div className={styles.actions}>
					<Button onClick={onClose} className={styles.cancel}>
						Hủy bỏ
					</Button>
					<Button onClick={onConfirm} className={styles.confirm}>
						Xác nhận
					</Button>
				</div>
			</div>
		</div>
	);
};

export default ConfirmDeleteModal;
