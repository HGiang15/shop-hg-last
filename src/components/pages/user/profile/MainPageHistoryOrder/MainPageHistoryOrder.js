import React, {useEffect, useState} from 'react';
import styles from './MainPageHistoryOrder.module.scss';
import Button from '@/components/common/Button/Button';
import images from '@/constants/static/images';
import Image from 'next/image';

const TABS = [
	{label: 'Chờ xác nhận', value: 'pending'},
	{label: 'Đang giao hàng', value: 'shipping'},
	{label: 'Giao thành công', value: 'completed'},
	{label: 'Đơn hàng huỷ', value: 'cancelled'},
];

const MOCK_ORDERS = [
	{
		id: 'order1',
		status: 'pending',
		items: [
			{
				name: 'Áo MU Home 2024-2025',
				image: images.product1,
				price: 600000,
				quantity: 2,
				size: '2XL',
				color: 'Màu đỏ',
				total: 1200000,
			},
			{
				name: 'Áo MU Away 2024-2025',
				image: images.product2,
				price: 300000,
				quantity: 1,
				size: '2XL',
				color: 'Màu xanh',
				total: 300000,
			},
		],
		total: 1500000,
	},
	{
		id: 'order2',
		status: 'shipping',
		items: [
			{
				name: 'Áo MU Third 2024-2025',
				image: images.product3,
				price: 700000,
				quantity: 1,
				size: 'L',
				color: 'Trắng',
				total: 700000,
			},
		],
		total: 700000,
	},
	{
		id: 'order3',
		status: 'completed',
		items: [
			{
				name: 'Áo MU Goalkeeper 2024-2025',
				image: images.product4,
				price: 650000,
				quantity: 1,
				size: 'M',
				color: 'Xanh lá',
				total: 650000,
			},
		],
		total: 650000,
	},
	{
		id: 'order4',
		status: 'cancelled',
		items: [
			{
				name: 'Áo MU Training 2024-2025',
				image: images.product5,
				price: 400000,
				quantity: 1,
				size: 'XL',
				color: 'Xám',
				total: 400000,
			},
		],
		total: 400000,
	},
];

const formatCurrency = (value) => value.toLocaleString('vi-VN', {style: 'currency', currency: 'VND'});

const MainPageHistoryOrder = () => {
	const [activeTab, setActiveTab] = useState('pending');
	const [orders, setOrders] = useState([]);

	useEffect(() => {
		const filtered = MOCK_ORDERS.filter((o) => o.status === activeTab);
		setOrders(filtered);
	}, [activeTab]);

	const getTotalQuantity = (items) => items.reduce((sum, item) => sum + item.quantity, 0);

	const handleAction = (orderId) => {
		let updatedOrders = [...MOCK_ORDERS];

		if (activeTab === 'pending') {
			if (window.confirm('Bạn có chắc muốn huỷ đơn hàng này?')) {
				updatedOrders = updatedOrders.map((order) => (order.id === orderId ? {...order, status: 'cancelled'} : order));
			}
		} else if (activeTab === 'shipping') {
			if (window.confirm('Xác nhận đã nhận được hàng?')) {
				updatedOrders = updatedOrders.map((order) => (order.id === orderId ? {...order, status: 'completed'} : order));
			}
		} else if (activeTab === 'completed' || activeTab === 'cancelled') {
			if (window.confirm('Bạn có chắc muốn xoá đơn hàng này?')) {
				updatedOrders = updatedOrders.filter((order) => order.id !== orderId);
			}
		}

		const filtered = updatedOrders.filter((o) => o.status === activeTab);
		setOrders(filtered);
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
				<div key={order.id} className={styles.orderBox}>
					{order.items.map((item, index) => (
						<div key={index} className={styles.itemBox}>
							<Image src={item.image} alt={item.name} className={styles.itemImage} />
							<div className={styles.itemDetails}>
								<div className={styles.itemName}>{item.name}</div>
								<div>Đơn giá: {formatCurrency(item.price)}</div>
								<div>Số lượng: {String(item.quantity).padStart(2, '0')}</div>
								<div>Kích cỡ: {item.size}</div>
								<div>Màu sắc: {item.color}</div>
							</div>
							<div className={styles.itemTotal}>Thành tiền: {formatCurrency(item.total)}</div>
						</div>
					))}

					<div className={styles.orderFooter}>
						<div>Tổng số lượng: {getTotalQuantity(order.items)} sản phẩm</div>
						<div className={styles.total}>Tổng tiền: {formatCurrency(order.total)}</div>
						<div>
							{activeTab === 'pending' && (
								<Button className={styles.canceledBtn} onClick={() => handleAction(order.id)}>
									Huỷ đơn hàng
								</Button>
							)}
							{activeTab === 'shipping' && (
								<Button className={styles.successBtn} onClick={() => handleAction(order.id)}>
									Đã nhận được hàng
								</Button>
							)}
							{(activeTab === 'completed' || activeTab === 'cancelled') && (
								<Button className={styles.deleteBtn} onClick={() => handleAction(order.id)}>
									Xoá đơn hàng
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
