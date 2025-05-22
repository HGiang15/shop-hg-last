import React, {useEffect, useState} from 'react';
import styles from './MainPageHistoryOrder.module.scss';
import Button from '@/components/common/Button/Button';
import Image from 'next/image';
import {getUserOrders, updateOrderStatus, deleteOrder} from '@/services/orderService'; // Thêm hàm deleteOrder

const TABS = [
	{label: 'Chờ xác nhận', value: 'pending'},
	{label: 'Đang giao hàng', value: 'shipping'},
	{label: 'Giao thành công', value: 'completed'},
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

	// Lọc đơn hàng theo tab mỗi khi activeTab hoặc allOrders thay đổi
	useEffect(() => {
		const filtered = allOrders.filter((o) => o.status === activeTab);
		setOrders(filtered);
	}, [activeTab, allOrders]);

	const getTotalQuantity = (items) => items.reduce((sum, item) => sum + item.quantity, 0);

	const handleAction = async (orderId) => {
		if (activeTab === 'pending') {
			// Hủy đơn hàng
			if (window.confirm('Bạn có chắc muốn huỷ đơn hàng này?')) {
				try {
					await updateOrderStatus(orderId, 'cancelled');
					// Cập nhật local state
					setAllOrders((prev) => prev.map((order) => (order._id === orderId ? {...order, status: 'cancelled'} : order)));
				} catch (error) {
					alert(error.message || 'Huỷ đơn hàng thất bại');
				}
			}
		} else if (activeTab === 'shipping') {
			// Xác nhận đã nhận hàng
			if (window.confirm('Xác nhận đã nhận được hàng?')) {
				try {
					await updateOrderStatus(orderId, 'completed');
					setAllOrders((prev) => prev.map((order) => (order._id === orderId ? {...order, status: 'completed'} : order)));
				} catch (error) {
					alert(error.message || 'Cập nhật trạng thái thất bại');
				}
			}
		} else if (activeTab === 'cancelled') {
			// Xóa đơn hàng
			if (window.confirm('Bạn có chắc muốn xoá đơn hàng này?')) {
				try {
					await deleteOrder(orderId);
					setAllOrders((prev) => prev.filter((order) => order._id !== orderId));
				} catch (error) {
					alert(error.message || 'Xoá đơn hàng thất bại');
				}
			}
		} else if (activeTab === 'completed') {
			// Xóa đơn hàng tương tự cancelled
			if (window.confirm('Bạn có chắc muốn xoá đơn hàng này?')) {
				try {
					await deleteOrder(orderId);
					setAllOrders((prev) => prev.filter((order) => order._id !== orderId));
				} catch (error) {
					alert(error.message || 'Xoá đơn hàng thất bại');
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
				return 'Xoá đơn hàng';
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

			{orders.length === 0 && <div className={styles.empty}>Không có đơn hàng nào.</div>}

			{orders.map((order) => (
				<div key={order._id} className={styles.orderBox}>
					{order.items.map((item, index) => (
						<div key={index} className={styles.itemBox}>
							<Image
								src={`http://localhost:3003/uploads/${item.image}`}
								alt={item.name}
								className={styles.itemImage}
								width={80}
								height={80}
							/>

							<div className={styles.itemDetails}>
								<div className={styles.itemName}>{item.name}</div>
								<div>Đơn giá: {formatCurrency(item.price)}</div>
								<div>Số lượng: {String(item.quantity).padStart(2, '0')}</div>
								<div>Kích cỡ: {item.size}</div>
								<div>Màu sắc: {item.color}</div>
							</div>
							<div className={styles.itemTotal}>Thành tiền: {formatCurrency(item.price * item.quantity)}</div>
						</div>
					))}

					<div className={styles.orderFooter}>
						<div>Tổng số lượng: {getTotalQuantity(order.items)} sản phẩm</div>
						<div className={styles.total}>Tổng tiền: {formatCurrency(order.totalAmount)}</div>
						<div>
							{activeTab !== 'cancelled' && (
								<Button
									className={
										activeTab === 'pending'
											? styles.canceledBtn
											: activeTab === 'shipping'
											? styles.successBtn
											: styles.deleteBtn
									}
									onClick={() => handleAction(order._id)}
								>
									{getButtonLabel()}
								</Button>
							)}
						</div>
					</div>
				</div>
			))}
		</div>
	);
};

export default MainPageHistoryOrder;
