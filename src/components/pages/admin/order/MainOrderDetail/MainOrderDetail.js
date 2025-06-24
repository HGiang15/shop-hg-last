import React, {useEffect, useState} from 'react';
import styles from './MainOrderDetail.module.scss';
import {useRouter} from 'next/router';
import {getOrderById, updateOrderStatus, deleteOrder} from '@/services/orderService';
import {toast} from 'react-toastify';
import {ROUTES} from '@/constants/config';
import Button from '@/components/common/Button/Button';
import ConfirmDeleteModal from '../ConfirmDeleteModal/ConfirmDeleteModal';
import {setActiveMenu} from '@/redux/actions/menuTabActions';
import {connect} from 'react-redux';

const MainOrderDetail = ({setActiveMenu}) => {
	const router = useRouter();
	const {id} = router.query;
	const [order, setOrder] = useState(null);

	const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

	useEffect(() => {
		setActiveMenu(ROUTES.AdminOrder);
	}, []);

	useEffect(() => {
		if (router.isReady && id) {
			fetchOrder();
		}
	}, [router.isReady, id]);

	const fetchOrder = async () => {
		try {
			const data = await getOrderById(id);
			setOrder(data);
		} catch (err) {
			toast.error(err.message || 'Không thể lấy thông tin đơn hàng');
			router.push(ROUTES.Order);
		}
	};

	const handleUpdateStatus = async (status) => {
		const validStatuses = ['shipping', 'success', 'cancelled'];
		if (!validStatuses.includes(status)) {
			toast.error('Trạng thái không hợp lệ');
			return;
		}

		try {
			await updateOrderStatus(order._id, status);
			toast.success(`Trạng thái đơn hàng đã cập nhật: ${getStatusLabel(status)}`);
			fetchOrder();
		} catch (error) {
			toast.error('Lỗi khi cập nhật trạng thái đơn hàng');
		}
	};

	const confirmDeleteOrder = async () => {
		try {
			await deleteOrder(order._id);
			toast.success('Xóa đơn hàng thành công');
			router.push(ROUTES.AdminOrder);
		} catch (error) {
			toast.error('Xóa đơn hàng thất bại');
		}
	};

	// Xóa đơn hàng
	const handleDeleteOrder = async () => {
		try {
			await deleteOrder(order._id);
			toast.success('Xóa đơn hàng thành công');
			router.push(ROUTES.AdminOrder);
		} catch (error) {
			toast.error('Xóa đơn hàng thất bại');
		}
	};

	const getStatusLabel = (status) => {
		switch (status) {
			case 'pending':
				return 'Chờ xác nhận';
			case 'shipping':
				return 'Đang giao hàng';
			case 'success':
				return 'Giao hàng thành công';
			case 'cancelled':
				return 'Đã hủy';
			default:
				return status;
		}
	};

	const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

	if (!order) {
		return (
			<div className={styles.container}>
				<p>Đang tải thông tin đơn hàng...</p>
			</div>
		);
	}

	return (
		<div className={styles.container}>
			<div className={styles.orderHeader}>
				<div className={styles.backTitle}>
					<span className={styles.backIcon} onClick={() => router.back()}>
						←
					</span>
					<h2>Chi tiết đơn hàng - {order._id}</h2>
				</div>

				<div className={styles.actionButtons}>
					{order.status === 'pending' && (
						<>
							<Button className={styles.confirmBtn} onClick={() => handleUpdateStatus('shipping')}>
								Xác nhận đơn hàng
							</Button>
							<Button className={styles.cancelBtn} onClick={() => handleUpdateStatus('cancelled')}>
								Hủy đơn hàng
							</Button>
						</>
					)}

					{order.status === 'shipping' && (
						<Button className={styles.confirmBtn} onClick={() => handleUpdateStatus('success')}>
							Giao hàng thành công
						</Button>
					)}

					{(order.status === 'success' || order.status === 'cancelled') && (
						<Button className={styles.deleteBtn} onClick={() => setIsDeleteModalOpen(true)}>
							Xóa đơn hàng
						</Button>
					)}
				</div>
			</div>

			<div className={styles.orderInfo}>
				<div className={styles.infoGrid}>
					<div className={styles.infoItem}>
						<div className={styles.label}>Mã đơn hàng</div>
						<div className={styles.value}>{order._id}</div>
					</div>
					<div className={styles.infoItem}>
						<div className={styles.label}>Người dùng</div>
						<div className={styles.value}>{order.userId?.name}</div>
					</div>
					<div className={styles.infoItem}>
						<div className={styles.label}>Người nhận hàng</div>
						<div className={styles.value}>{order.shippingAddress?.name}</div>
					</div>
					<div className={styles.infoItem}>
						<div className={styles.label}>Số điện thoại</div>
						<div className={styles.value}>{order.shippingAddress?.phone}</div>
					</div>
					<div className={styles.infoItem}>
						<div className={styles.label}>Địa chỉ giao hàng</div>
						<div className={styles.value}>{order.shippingAddress?.address}</div>
					</div>
					<div className={styles.infoItem}>
						<div className={styles.label}>Số lượng sản phẩm</div>
						<div className={styles.value}>{order.items?.length}</div>
					</div>
					<div className={styles.infoItem}>
						<div className={styles.label}>Giảm giá</div>
						<div className={styles.value}>{order.discountAmount?.toLocaleString('vi-VN')} VNĐ</div>
					</div>
					<div className={styles.infoItem}>
						<div className={styles.label}>Tổng tiền đơn hàng</div>
						<div className={styles.value}>{order.totalAmount?.toLocaleString('vi-VN')} VND</div>
					</div>
					<div className={styles.infoItem}>
						<div className={styles.label}>Tổng tiền đơn hàng sau khi giảm</div>
						<div className={styles.value}>{order.finalAmount?.toLocaleString('vi-VN')} VND</div>
					</div>
					<div className={styles.infoItem}>
						<div className={styles.label}>Trạng thái đơn hàng</div>
						<div className={`${styles.value} ${styles[`status${capitalize(order.status)}`]}`}>
							{getStatusLabel(order.status)}
						</div>
					</div>
					<div className={styles.infoItem}>
						<div className={styles.label}>Ngày đặt hàng</div>
						<div className={styles.value}>{new Date(order.createdAt).toLocaleString('vi-VN')}</div>
					</div>
					<div className={styles.infoItem}>
						<div className={styles.label}>Ghi chú</div>
						<div className={styles.value}>{order.note || 'Không có'}</div>
					</div>
				</div>

				<div className={styles.infoItem}>
					<div className={styles.label}>Sản phẩm</div>
					<div className={styles.value}>
						<ul className={styles.productList}>
							{order.items?.map((item, index) => (
								<li key={item._id} className={styles.productItem}>
									<div>Tên: {item.name}</div>
									<div>Màu: {item.color}</div>
									<div>Size: {item.size}</div>
									<div>Số lượng: {item.quantity}</div>
									<div>Đơn giá: {item.price.toLocaleString('vi-VN')} VND</div>
									<div>Thành tiền: {(item.price * item.quantity).toLocaleString('vi-VN')} VND</div>
								</li>
							))}
						</ul>
					</div>
				</div>
			</div>

			<ConfirmDeleteModal
				isOpen={isDeleteModalOpen}
				onClose={() => setIsDeleteModalOpen(false)}
				onConfirm={() => {
					setIsDeleteModalOpen(false);
					confirmDeleteOrder();
				}}
				name={order._id}
			/>
		</div>
	);
};

// export default MainOrderDetail;

const mapDispatchToProps = (dispatch) => ({
	setActiveMenu: (menuPath) => dispatch(setActiveMenu(menuPath)),
});

export default connect(null, mapDispatchToProps)(MainOrderDetail);
