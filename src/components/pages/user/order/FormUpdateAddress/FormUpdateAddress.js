import React, {useState} from 'react';
import styles from './FormUpdateAddress.module.scss';
import Button from '@/components/common/Button/Button';

const FormUpdateAddress = ({onClose}) => {
	const [isActive, setIsActive] = useState(false);

	const handleClose = () => {
		setIsActive(false);
		setTimeout(onClose, 100);
	};
	return (
		<div className={styles.overlay} onClick={handleClose}>
			<div className={styles.container}>
				<div className={styles.header}>
					<h2 className={styles.title}>Thay đổi địa chỉ</h2>
					<span className={styles.addAddress}>Thêm địa chỉ mới</span>
				</div>
				<div className={styles.addresses}>
					<div className={styles.addressItem}>
						<p className={styles.name}>Nguyễn Đăng Hoàng Giang</p>
						<span className={styles.phone}>0398162589</span>
						<p className={styles.address}>202 B4 Đức Giang, phường Thượng Thanh, quận Long Biên, thành phố Hà Nội</p>
					</div>
					<div className={styles.addressItem}>
						<p className={styles.name}>Nguyễn Đăng Hoàng Giang</p>
						<span className={styles.phone}>0338625862</span>
						<p className={styles.address}>130 Nguyễn Đức Cảnh, phường Tương Mai, quận Hoàng Mai, thành phố Hà Nội</p>
					</div>
				</div>
				<div className={styles.actions}>
					<Button className={styles.cancelButton} onClick={onClose}>
						Hủy bỏ
					</Button>
					<Button className={styles.updateButton}>Thay đổi</Button>
				</div>
			</div>
		</div>
	);
};

export default FormUpdateAddress;
