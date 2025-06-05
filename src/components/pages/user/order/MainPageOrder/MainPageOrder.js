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
import {applyVoucher} from '@/services/voucherService';

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
	const [voucherCode, setVoucherCode] = useState('');
	const [appliedVoucher, setAppliedVoucher] = useState(null);
	const [voucherError, setVoucherError] = useState('');

	const mockVouchers = [
		{
			_id: '1',
			code: 'GIAM50K',
			discountType: 'fixed',
			discountValue: 50000,
			minOrderValue: 200000,
			maxDiscount: null,
			quantity: 5,
			startDate: '2025-06-01T00:00:00.000Z',
			endDate: '2025-06-30T23:59:59.999Z',
			isActive: true,
			usedBy: [],
			createdAt: '2025-06-01T10:00:00.000Z',
			updatedAt: '2025-06-01T10:00:00.000Z',
		},
		{
			_id: '2',
			code: 'SALE20',
			discountType: 'percent',
			discountValue: 20,
			minOrderValue: 300000,
			maxDiscount: 80000,
			quantity: 10,
			startDate: '2025-06-01T00:00:00.000Z',
			endDate: '2025-06-15T23:59:59.999Z',
			isActive: true,
			usedBy: [],
			createdAt: '2025-06-01T10:00:00.000Z',
			updatedAt: '2025-06-01T10:00:00.000Z',
		},
		{
			_id: '3',
			code: 'FREESHIP',
			discountType: 'fixed',
			discountValue: 20000,
			minOrderValue: 100000,
			maxDiscount: null,
			quantity: 50,
			startDate: '2025-06-01T00:00:00.000Z',
			endDate: '2025-07-01T00:00:00.000Z',
			isActive: true,
			usedBy: [],
			createdAt: '2025-06-01T10:00:00.000Z',
			updatedAt: '2025-06-01T10:00:00.000Z',
		},
	];

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
				voucherCode: appliedVoucher?.code || null,
			});

			// B2: Gọi API tạo URL thanh toán VNPay
			const paymentRes = await createVNPayUrl({
				amount: totalAmount - (appliedVoucher?.discountAmount || 0),
				orderId: order._id,
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

	const handleApplyVoucher = async () => {
		try {
			setVoucherError('');
			const response = await applyVoucher({
				code: voucherCode,
				orderTotal: totalAmount,
				// Có thể thêm userId nếu cần (nếu hệ thống yêu cầu), hiện tại có thể bỏ
			});
			setAppliedVoucher(response); // response gồm: code, discountAmount
			toast.success('Áp dụng mã giảm giá thành công');
		} catch (error) {
			setAppliedVoucher(null);
			setVoucherError(error.message || 'Mã giảm giá không hợp lệ');
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
						Tổng thanh toán:
						<span className={styles.totalAmount}>
							{(totalAmount - (appliedVoucher?.discountAmount || 0)).toLocaleString('vi-VN')} VNĐ
						</span>
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

					<div className={styles.voucherSection}>
						<input
							type='text'
							placeholder='Nhập mã giảm giá'
							value={voucherCode}
							onChange={(e) => setVoucherCode(e.target.value)}
							className={styles.voucherInput}
						/>
						<Button onClick={handleApplyVoucher}>Áp dụng</Button>

						{voucherError && <p className={styles.voucherError}>{voucherError}</p>}
						{appliedVoucher && (
							<p className={styles.voucherSuccess}>
								Áp dụng mã <strong>{appliedVoucher.code}</strong> - Giảm{' '}
								{appliedVoucher.discountAmount.toLocaleString('vi-VN')} VNĐ
							</p>
						)}

						{/* Danh sách mã giảm giá */}
						<div className={styles.voucherList}>
							<h4 className={styles.voucherListTitle}>Mã giảm giá hiện có:</h4>
							{mockVouchers.map((v) => (
								<div key={v._id} className={styles.voucherItem} onClick={() => setVoucherCode(v.code)}>
									<p className={styles.voucherCode}>{v.code}</p>
									<p className={styles.voucherDesc}>
										{v.discountType === 'percent'
											? `Giảm ${v.discountValue}%`
											: `Giảm ${v.discountValue.toLocaleString('vi-VN')}đ`}
										{v.discountType === 'percent' && v.maxDiscount
											? ` (tối đa ${v.maxDiscount.toLocaleString('vi-VN')}đ)`
											: ''}{' '}
										cho đơn từ {v.minOrderValue.toLocaleString('vi-VN')}đ
									</p>
								</div>
							))}
						</div>
					</div>
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
