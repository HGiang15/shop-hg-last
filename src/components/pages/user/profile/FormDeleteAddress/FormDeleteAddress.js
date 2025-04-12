import React from 'react';
import styles from './FormDeleteAddress.module.scss';
import Image from 'next/image';
import icons from '@/constants/static/icons';
import Button from '@/components/common/Button/Button';

const FormDeleteAddress = ({onClose, onConfirm}) => {
	return (
		<div className={styles.overlay} onClick={onClose}>
			<div className={styles.modal}>
				<Image src={icons.question} alt='icon' width={64} height={64} className={styles.icon} />
				<h3 className={styles.title}>Xóa địa chỉ</h3>
				<p className={styles.text}>Bạn có chắc chắn muốn xóa địa chỉ này?</p>
				<div className={styles.actions}>
					<Button className={styles.cancelButton} onClick={onClose}>
						Hủy bỏ
					</Button>
					<Button className={styles.confirmButton} onClick={onConfirm}>
						Xác nhận
					</Button>
				</div>
			</div>
		</div>
	);
};

export default FormDeleteAddress;
