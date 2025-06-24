import {useEffect, useState} from 'react';
import {useRouter} from 'next/router';
import styles from './VNPayReturn.module.scss';
import {ROUTES} from '@/constants/config';
import {getOrderById} from '@/services/orderService';

const VNPayReturnPage = () => {
	const router = useRouter();
	// Lấy cả orderId từ URL
	const {vnp_ResponseCode, orderId} = router.query;

	const [status, setStatus] = useState(null);
	const [order, setOrder] = useState(null); // State để lưu thông tin đơn hàng
	const [loading, setLoading] = useState(true); // State để hiển thị loading

	useEffect(() => {
		// Đảm bảo router đã sẵn sàng và có orderId
		if (router.isReady && orderId) {
			// Cập nhật trạng thái thành công/thất bại
			if (vnp_ResponseCode === '00') {
				setStatus('success');
			} else {
				setStatus('fail');
			}

			// Gọi API để lấy chi tiết đơn hàng
			const fetchOrderDetails = async () => {
				try {
					setLoading(true);
					const orderDetails = await getOrderById(orderId);
					setOrder(orderDetails);
				} catch (error) {
					console.error('Lỗi khi lấy chi tiết đơn hàng:', error);
				} finally {
					setLoading(false);
				}
			};

			fetchOrderDetails();
		}
	}, [router.isReady, orderId, vnp_ResponseCode]); // Thêm dependencies

	const handleGoToOrders = () => {
		router.push(ROUTES.HistoryOrder);
	};

	return (
		<div className={styles.container}>
			<div className={styles.card}>
				<h1>Kết quả thanh toán</h1>

				{/* Hiển thị thông báo chung */}
				{status === 'success' && <p className={styles.success}>Thanh toán thành công. Cảm ơn bạn!</p>}
				{status === 'fail' && <p className={styles.fail}>Thanh toán thất bại. Tuy nhiên, đơn hàng của bạn đã được tạo.</p>}

				{/* Hiển thị chi tiết đơn hàng */}
				{loading ? (
					<p>Đang tải thông tin đơn hàng...</p>
				) : order ? (
					<div className={styles.orderDetails}>
						<h3>Chi tiết đơn hàng #{order._id}</h3>
						{order.items.map((item) => (
							<div key={item._id} className={styles.orderItem}>
								<span>
									{item.name} (x{item.quantity})
								</span>
								<span>{item.color}</span>
								<span>{item.size}</span>

								<span>{(item.price * item.quantity).toLocaleString('vi-VN')} VNĐ</span>
							</div>
						))}
						<hr />
						<div className={styles.total}>
							<strong>Tổng cộng:</strong>
							<strong>{order.finalAmount.toLocaleString('vi-VN')} VNĐ</strong>
						</div>
					</div>
				) : (
					<p>Không thể tải thông tin đơn hàng.</p>
				)}

				<button className={styles.button} onClick={handleGoToOrders}>
					Xem lịch sử đơn hàng
				</button>
			</div>
		</div>
	);
};

export default VNPayReturnPage;
