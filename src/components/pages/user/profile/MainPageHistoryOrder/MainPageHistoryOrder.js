import React, {useEffect, useState} from 'react';
import styles from './MainPageHistoryOrder.module.scss';
import Button from '@/components/common/Button/Button';
import Image from 'next/image';
import {getUserOrders, updateOrderStatus} from '@/services/orderService';
import images from '@/constants/static/images';

const TABS = [
	{label: 'Chờ xác nhận', value: 'pending'},
	{label: 'Đang giao hàng', value: 'shipping'},
	{label: 'Giao thành công', value: 'success'},
	{label: 'Đơn hàng huỷ', value: 'cancelled'},
];

const formatCurrency = (value) => value.toLocaleString('vi-VN', {style: 'currency', currency: 'VND'});

const MainPageHistoryOrder = () => {
	const [activeTab, setActiveTab] = useState('pending');
	const [allOrders, setAllOrders] = useState([]);
	const [orders, setOrders] = useState([]);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		const fetchOrders = async () => {
			setLoading(true);
			try {
				const data = await getUserOrders();
				setAllOrders(data);
			} catch (error) {
				alert(error.message || 'Lỗi khi lấy đơn hàng');
			} finally {
				setLoading(false);
			}
		};
		fetchOrders();
	}, []);

	useEffect(() => {
		const filtered = allOrders.filter((o) => o.status === activeTab);
		setOrders(filtered);
	}, [activeTab, allOrders]);

	const getTotalQuantity = (items) => items.reduce((sum, item) => sum + item.quantity, 0);

	const handleAction = async (orderId) => {
		if (activeTab === 'pending') {
			if (window.confirm('Bạn có chắc muốn huỷ đơn hàng này?')) {
				try {
					await updateOrderStatus(orderId, 'cancelled');
					setAllOrders((prev) => prev.map((order) => (order._id === orderId ? {...order, status: 'cancelled'} : order)));
				} catch (error) {
					alert(error.message || 'Huỷ đơn hàng thất bại');
				}
			}
		} else if (activeTab === 'shipping') {
			if (window.confirm('Xác nhận đã nhận được hàng?')) {
				try {
					await updateOrderStatus(orderId, 'success');
					setAllOrders((prev) => prev.map((order) => (order._id === orderId ? {...order, status: 'success'} : order)));
				} catch (error) {
					alert(error.message || 'Cập nhật trạng thái thất bại');
				}
			}
		}
	};

	const getButtonLabel = () => {
		switch (activeTab) {
			case 'pending':
				return 'Huỷ đơn hàng';
			case 'shipping':
				return 'Đã nhận được hàng';
			default:
				return '';
		}
	};

	if (loading) return <div>Đang tải đơn hàng...</div>;

	return (
		<div className={styles.container}>
			<h2 className={styles.title}>Đơn hàng của tôi</h2>

			<div className={styles.tabs}>
				{TABS.map((tab) => (
					<div
						key={tab.value}
						className={`${styles.tab} ${activeTab === tab.value ? styles.active : ''}`}
						onClick={() => setActiveTab(tab.value)}
					>
						{tab.label}
					</div>
				))}
			</div>

			<div className={styles.scrollArea}>
				{orders.length === 0 && (
					<div className={styles.empty}>
						<Image src={images.boxEmpty} alt='Không có sản phẩm' width={180} height={180} priority />
						Hiện tại bạn không có đơn hàng nào.
					</div>
				)}

				{orders.map((order) => (
					<div key={order._id} className={styles.orderBox}>
						{order.items.map((item, index) => (
							<div key={index} className={styles.itemBox}>
								<Image src={item?.image} alt={item.name} className={styles.itemImage} width={80} height={80} />

								<div className={styles.itemDetails}>
									<div className={styles.itemId}>
										Mã đơn hàng: <span>{item._id}</span>
									</div>
									<div className={styles.itemName}>{item.name}</div>
									<div>Đơn giá: {formatCurrency(item.price)}</div>
									<div>Số lượng: {String(item.quantity).padStart(2, '0')}</div>
									<div>Kích cỡ: {item.size}</div>
									<div>Màu sắc: {item.color}</div>
									<div className={styles.paymentStatus}>
										Thanh toán: <span>{order.isPaid ? 'Đã thanh toán' : 'Chưa thanh toán'}</span>
									</div>{' '}
									{order.discountAmount > 0 && (
										<div className={styles.discount}>Giảm giá: -{formatCurrency(order.discountAmount)}</div>
									)}
								</div>
								<div className={styles.itemTotal}>Thành tiền: {formatCurrency(item.price * item.quantity)}</div>
							</div>
						))}

						<div className={styles.orderFooter}>
							<div>Tổng số lượng: {getTotalQuantity(order.items)} sản phẩm</div>

							<div className={styles.total}>Tổng tiền: {formatCurrency(order.finalAmount)}</div>
							{(activeTab === 'pending' || activeTab === 'shipping') && (
								<Button
									className={activeTab === 'pending' ? styles.canceledBtn : styles.successBtn}
									onClick={() => handleAction(order._id)}
								>
									{getButtonLabel()}
								</Button>
							)}
						</div>
					</div>
				))}
			</div>
		</div>
	);
};

export default MainPageHistoryOrder;
