import React, {useState} from 'react';
import styles from './MainPageAddress.module.scss';
import Image from 'next/image';
import icons from '@/constants/static/icons';
import Button from '@/components/common/Button/Button';
import FormCreateAddress from '../FormCreateAddress/FormCreateAddress';
import FormUpdateAddress from '../FormUpdateAddress/FormUpdateAddress';

const MainPageAddress = () => {
	const [showCreateForm, setShowCreateForm] = useState(false);
	const [showUpdateForm, setShowUpdateForm] = useState(false);

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

			{showCreateForm && <FormCreateAddress onClose={() => setShowCreateForm(false)} />}

			<div className={styles.addressCard}>
				<div className={styles.addressInfo}>
					<div className={styles.name}>Nguyễn Đăng Hoàng Giang</div>
					<div className={styles.phone}>Số điện thoại: 0398162589</div>
					<div className={styles.address}>Địa chỉ: Tổ 30, phường Thượng Thanh, quận Long Biên, thành phố Hà Nội</div>
				</div>
				<div className={styles.addressActions}>
					<Button
						className={styles.updateButton}
						onClick={() => {
							console.log('Clicked update');
							setShowUpdateForm(true);
						}}
					>
						Cập nhật
					</Button>
					<Button className={styles.deleteButton}>Xóa</Button>
				</div>
			</div>

			<div className={styles.addressCard}>
				<div className={styles.addressInfo}>
					<div className={styles.name}>Nguyễn Đăng Hoàng Giang</div>
					<div className={styles.phone}>Số điện thoại: 0398162589</div>
					<div className={styles.address}>Địa chỉ: Tổ 30, phường Thượng Thanh, quận Long Biên, thành phố Hà Nội</div>
				</div>
				<div className={styles.addressActions}>
					<Button className={styles.defaultButton}>Đặt mặc định</Button>
					<Button className={styles.updateButton} onClick={() => setShowUpdateForm(true)}>
						Cập nhật
					</Button>
					<Button className={styles.deleteButton}>Xóa</Button>
				</div>
			</div>

			{showUpdateForm && <FormUpdateAddress onClose={() => setShowUpdateForm(false)} />}
		</div>
	);
};

export default MainPageAddress;
