import React, {useEffect, useState} from 'react';
import styles from './MainPageOrder.module.scss';
import Breadcrumb from '@/components/common/Breadcrumb/Breadcrumb';
import Button from '@/components/common/Button/Button';
import Image from 'next/image';
import FormUpdateAddress from '../FormUpdateAddress/FormUpdateAddress';

const MainPageOrder = ({breadcrumbItems = {titles: [], listHref: []}}) => {
	const [policyChecked, setPolicyChecked] = useState(false);
	const [showUpdateAddress, setShowUpdateAddress] = useState(false);

	useEffect(() => {
		if (!Array.isArray(breadcrumbItems.titles) || !Array.isArray(breadcrumbItems.listHref)) {
			console.error('Invalid breadcrumb data');
		}
	}, [breadcrumbItems]);

	const orderList = [
		{id: 1, name: 'MU Home 2024-2025 - (Đỏ) - (XL)', quantity: 1},
		{id: 2, name: 'MU Khách 2024-2025 - (Đen) - (XXL)', quantity: 2},
		{id: 3, name: 'Chelsea đặc biệt 2024-2025 - (Đen) - (XL)', quantity: 1},
	];

	const totalAmount = '1.200.000 VND';

	const handlePolicyChange = (e) => {
		setPolicyChecked(e.target.checked);
	};

	const handleShowUpdateAddress = () => {
		setShowUpdateAddress(true);
	};

	const handleCloseUpdateAddress = () => {
		setShowUpdateAddress(false);
	};

	return (
		<div className={styles.container}>
			<Breadcrumb titles={breadcrumbItems.titles} listHref={breadcrumbItems.listHref} />
			<div className={styles.main}>
				<div className={styles.orderSummary}>
					<div className={styles.orderWrap}>
						<h2 className={styles.orderTitle}>Đơn hàng của bạn</h2>
						<h2 className={styles.orderTitle}>Số lượng</h2>
					</div>
					<div className={styles.orderList}>
						{orderList.map((item) => (
							<div key={item.id} className={styles.orderItem}>
								<span className={styles.itemName}>{item.name}</span>
								<span className={styles.itemQuantity}>{item.quantity}</span>
							</div>
						))}
					</div>
					<div className={styles.total}>
						Tổng thanh toán: <span className={styles.totalAmount}>{totalAmount}</span>
					</div>
					<div className={styles.policyCheckbox}>
						<input type='checkbox' id='policy' checked={policyChecked} onChange={handlePolicyChange} />
						<label htmlFor='policy'>Bạn đã hiểu điều chính sách của HG Shop</label>
					</div>
					<Button className={styles.placeOrderButton} disabled={!policyChecked}>
						Đặt hàng
					</Button>
				</div>

				<div className={styles.deliveryInfo}>
					<div className={styles.deliveryHeader}>
						<h2 className={styles.deliveryTitle}>Thông tin nhận hàng</h2>
						<span className={styles.changeAddress} onClick={() => setShowUpdateAddress(true)}>
							Đổi địa chỉ
						</span>
					</div>
					<div className={styles.deliveryDetails}>
						<div className={styles.wrapper}>
							<p>Nguyễn Đăng Hoàng Giang</p>
							<span>0398162589</span>
						</div>
						<p>202 B4 Đức Giang, phường Thượng Thanh, quận Long Biên, thành phố Hà Nội</p>
					</div>
					<div className={styles.note}>
						<label>Ghi chú đơn hàng</label>
						<input type='text' placeholder='Nhập ghi chú đơn hàng (nếu có)' className={styles.noteInput} />
					</div>
				</div>
			</div>
			{showUpdateAddress && <FormUpdateAddress onClose={() => setShowUpdateAddress(false)} />}
		</div>
	);
};

export default MainPageOrder;
