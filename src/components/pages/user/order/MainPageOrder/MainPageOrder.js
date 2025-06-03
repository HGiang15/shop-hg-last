import React, {useState, useEffect} from 'react';
import styles from './MainPageOrder.module.scss';
import Breadcrumb from '@/components/common/Breadcrumb/Breadcrumb';
import Button from '@/components/common/Button/Button';
import FormChangeAddress from '../FormChangeAddress/FormChangeAddress';
import {createOrder, createVNPayUrl} from '@/services/orderService';
import {useRouter} from 'next/router';
import {getUserAddresses} from '@/services/userAddressService';
import {toast} from 'react-toastify';
import OrderSuccessModal from '../OrderSuccessModal/OrderSuccessModal';

const MainPageOrder = ({breadcrumbItems = {titles: [], listHref: []}}) => {
	const router = useRouter();
	const [orderList, setOrderList] = useState([]);
	const [totalAmount, setTotalAmount] = useState(0);
	const [policyChecked, setPolicyChecked] = useState(false);
	const [showUpdateAddress, setShowUpdateAddress] = useState(false);
	const [addressId, setAddressId] = useState(null);
	const [isPlacingOrder, setIsPlacingOrder] = useState(false);
	const [showSuccessModal, setShowSuccessModal] = useState(false);

	const [userAddresses, setUserAddresses] = useState([]);
	const [selectedAddress, setSelectedAddress] = useState(null);
	const [note, setNote] = useState('');

	const fetchAddresses = async () => {
		try {
			const res = await getUserAddresses();
			setUserAddresses(res);

			// Chọn lại địa chỉ mặc định mới nhất
			if (res.length > 0) {
				const defaultAddress = res.find((a) => a.isDefault) || res[0];
				setSelectedAddress(defaultAddress);
				setAddressId(defaultAddress._id);
			}
		} catch (err) {
			console.error('Lỗi khi lấy địa chỉ:', err);
		}
	};

	useEffect(() => {
		fetchAddresses();
	}, []);

	// 1) Đọc buyNow từ localStorage
	useEffect(() => {
		const raw = typeof window !== 'undefined' && localStorage.getItem('buyNow');
		if (raw) {
			try {
				const items = JSON.parse(raw);
				setOrderList(items);
			} catch {}
		}
	}, []);

	// 2) Tính tổng
	useEffect(() => {
		const sum = orderList.reduce((acc, item) => acc + item.price * item.quantity, 0);
		setTotalAmount(sum);
	}, [orderList]);

	// Create order and create URL VNPay
	const handlePlaceOrder = async () => {
		if (!policyChecked || isPlacingOrder) return;

		setIsPlacingOrder(true);

		try {
			// B1: Gọi API tạo đơn hàng
			const order = await createOrder({
				shippingAddress: addressId,
				items: orderList.map((item) => ({
					productId: item.productId,
					name: item.name,
					image: item.image,
					color: item.color,
					size: item.sizeName,
					quantity: item.quantity,
					price: item.price,
				})),
				note,
			});

			// B2: Gọi API tạo URL thanh toán VNPay
			const paymentRes = await createVNPayUrl({
				amount: totalAmount,
				orderId: order._id, // giả sử backend trả về order._id
			});

			// B3: Clear localStorage và redirect tới VNPay
			localStorage.removeItem('buyNow');

			console.log(paymentRes);

			window.location.href = paymentRes;
		} catch (err) {
			console.error(err);
			toast.error(err.message || 'Tạo đơn hàng/thanh toán thất bại');
		} finally {
			setIsPlacingOrder(false);
		}
	};

	return (
		<div className={styles.container}>
			<Breadcrumb titles={breadcrumbItems.titles} listHref={breadcrumbItems.listHref} />

			<div className={styles.main}>
				<div className={styles.orderSummary}>
					<div className={styles.orderWrap}>
						<h2 className={styles.orderTitle}>Đơn hàng của bạn</h2>
						<h2 className={styles.orderTitle}>Số lượng</h2>
						<h2 className={styles.orderTitle}>Thành tiền</h2>
					</div>

					<div className={styles.orderList}>
						{orderList.map((item, idx) => (
							<div key={idx} className={styles.orderItem}>
								<span className={styles.itemName}>
									{item.name} - ({item.color}) - ({item.sizeName})
								</span>
								<span className={styles.itemQuantity}>{item.quantity}</span>
								<span className={styles.itemTotal}>{(item.price * item.quantity).toLocaleString('vi-VN')} VNĐ</span>
							</div>
						))}
					</div>

					<div className={styles.total}>
						Tổng thanh toán: <span className={styles.totalAmount}>{totalAmount.toLocaleString('vi-VN')} VNĐ</span>
					</div>

					<div className={styles.policyCheckbox}>
						<input type='checkbox' id='policy' checked={policyChecked} onChange={(e) => setPolicyChecked(e.target.checked)} />
						<label htmlFor='policy'>Tôi đã đọc và đồng ý chính sách</label>
					</div>

					<Button
						className={styles.placeOrderButton}
						disabled={!policyChecked || orderList.length === 0 || isPlacingOrder}
						onClick={handlePlaceOrder}
					>
						{isPlacingOrder ? 'Đang xử lý...' : 'Đặt hàng'}
					</Button>
				</div>

				<div className={styles.deliveryInfo}>
					<div className={styles.deliveryHeader}>
						<h2 className={styles.deliveryTitle}>Thông tin nhận hàng</h2>
						<span className={styles.changeAddress} onClick={() => setShowUpdateAddress(true)}>
							Đổi địa chỉ
						</span>
					</div>
					{/* lấy thông tin địa chỉ theo addressId */}
					<div className={styles.deliveryDetails}>
						{selectedAddress ? (
							<>
								<div className={styles.wrapper}>
									<p>{selectedAddress.name}</p>
									<span>{selectedAddress.phone}</span>
								</div>
								<p>
									{selectedAddress.address}, {selectedAddress.ward.name}, {selectedAddress.district.name},{' '}
									{selectedAddress.province.name}
								</p>
							</>
						) : (
							<p>Không có địa chỉ nào</p>
						)}
					</div>

					<div className={styles.note}>
						<label>Ghi chú đơn hàng</label>
						<input
							type='text'
							placeholder='Nhập ghi chú (nếu có)'
							className={styles.noteInput}
							value={note}
							onChange={(e) => setNote(e.target.value)}
						/>
					</div>
				</div>
			</div>

			{showUpdateAddress && (
				<FormChangeAddress
					onClose={() => setShowUpdateAddress(false)}
					currentAddressId={addressId}
					onAddressSelected={(address) => {
						setSelectedAddress(address);
						setAddressId(address._id);
					}}
					onReloadAddresses={fetchAddresses}
				/>
			)}
			{showSuccessModal && <OrderSuccessModal onClose={() => setShowSuccessModal(false)} />}
		</div>
	);
};

export default MainPageOrder;
