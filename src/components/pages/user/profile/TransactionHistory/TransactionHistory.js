import React, {useEffect, useState} from 'react';
import styles from './TransactionHistory.module.scss';
import {getTransactionHistory} from '@/services/orderService';

const TransactionHistory = () => {
	const [orders, setOrders] = useState([]);
	const [page, setPage] = useState(1);
	const [totalPages, setTotalPages] = useState(1);
	const [status, setStatus] = useState('');
	const [loading, setLoading] = useState(false);
	const [isPaid, setIsPaid] = useState('');
	const [paymentMethod, setPaymentMethod] = useState('');
	const [sort, setSort] = useState('desc');

	const fetchOrders = async () => {
		try {
			setLoading(true);
			const res = await getTransactionHistory({
				page,
				limit: 1000,
				status,
				isPaid,
				paymentMethod,
				sort,
			});
			setOrders(res.orders);
			setTotalPages(res.totalPages);
		} catch (error) {
			console.error(error);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchOrders();
	}, [page, status, isPaid, paymentMethod, sort]);

	const handleStatusChange = (e) => {
		setStatus(e.target.value);
		setPage(1);
	};

	return (
		<div className={styles.container}>
			<h2 className={styles.title}>Lịch sử giao dịch</h2>

			<div className={styles.filter}>
				{/* Trạng thái đơn */}
				<select
					value={status}
					onChange={(e) => {
						setStatus(e.target.value);
						setPage(1);
					}}
				>
					<option value=''>Tất cả trạng thái</option>
					<option value='pending'>Chờ xác nhận</option>
					<option value='shipping'>Đang giao</option>
					<option value='success'>Thành công</option>
					<option value='cancelled'>Đã huỷ</option>
				</select>

				{/* Trạng thái thanh toán */}
				<select
					value={isPaid}
					onChange={(e) => {
						setIsPaid(e.target.value);
						setPage(1);
					}}
				>
					<option value=''>Tất cả thanh toán</option>
					<option value='true'>Đã thanh toán</option>
					<option value='false'>Chưa thanh toán</option>
				</select>

				{/* Phương thức thanh toán */}
				<select
					value={paymentMethod}
					onChange={(e) => {
						setPaymentMethod(e.target.value);
						setPage(1);
					}}
				>
					<option value=''>Tất cả phương thức</option>
					<option value='cod'>Thanh toán khi nhận hàng</option>
					<option value='vnpay'>Thanh toán online</option>
				</select>

				{/* Sắp xếp theo ngày */}
				<select
					value={sort}
					onChange={(e) => {
						setSort(e.target.value);
						setPage(1);
					}}
				>
					<option value='desc'>Mới nhất</option>
					<option value='asc'>Cũ nhất</option>
				</select>
			</div>

			{loading ? (
				<p>Đang tải...</p>
			) : orders.length === 0 ? (
				<p>Không có đơn hàng nào.</p>
			) : (
				<div className={styles.list}>
					{orders.map((order) => (
						<div key={order._id} className={styles.orderCard}>
							<p>
								<strong>Mã đơn:</strong> {order._id}
							</p>
							<p>
								<strong>Ngày đặt:</strong> {new Date(order.createdAt).toLocaleString()}
							</p>
							<p>
								<strong>Trạng thái:</strong> {order.status}
							</p>
							<p>
								<strong>Thanh toán:</strong> {order.isPaid ? 'Đã thanh toán' : 'Chưa thanh toán'}
							</p>
							<p>
								<strong>Phương thức:</strong>{' '}
								{order.paymentMethod === 'cod' ? 'Thanh toán khi nhận hàng' : 'Thanh toán online'}
							</p>
							<p>
								<strong>Tổng tiền gốc:</strong> {order.totalAmount.toLocaleString()}đ
							</p>
							{order.discountAmount > 0 && (
								<p>
									<strong>Giảm giá:</strong> -{order.discountAmount.toLocaleString()}đ ({order.voucherId?.code})
								</p>
							)}
							<p>
								<strong>Thành tiền:</strong> {order.finalAmount.toLocaleString()}đ
							</p>

							<div className={styles.items}>
								<strong>Sản phẩm:</strong>
								<ul>
									{order.items.map((item) => (
										<li key={item._id}>
											{item.name} - {item.color}, {item.size} x{item.quantity} (
											{(item.price * item.quantity).toLocaleString()}đ)
										</li>
									))}
								</ul>
							</div>
						</div>
					))}
				</div>
			)}

			{totalPages > 1 && (
				<div className={styles.pagination}>
					{Array.from({length: totalPages}).map((_, i) => (
						<button key={i} className={page === i + 1 ? styles.active : ''} onClick={() => setPage(i + 1)}>
							{i + 1}
						</button>
					))}
				</div>
			)}
		</div>
	);
};

export default TransactionHistory;
