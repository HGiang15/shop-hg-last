import React, {useState, useEffect} from 'react';
import styles from './MainPageOrder.module.scss';
import Breadcrumb from '@/components/common/Breadcrumb/Breadcrumb';
import Button from '@/components/common/Button/Button';
import FormChangeAddress from '../FormChangeAddress/FormChangeAddress';
import {createOrder, createVNPayUrl} from '@/services/orderService';
import {getUserAddresses} from '@/services/userAddressService';
import {toast} from 'react-toastify';
import OrderSuccessModal from '../OrderSuccessModal/OrderSuccessModal';
import {applyVoucher, getAvailableVouchersForUser} from '@/services/voucherService';
import useCart from '@/hooks/useCart';
import {useRouter} from 'next/router';
import {ROUTES} from '@/constants/config';

const MainPageOrder = ({breadcrumbItems = {titles: [], listHref: []}}) => {
	const router = useRouter();
	const {removeItemsFromCart} = useCart();

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
	const [paymentMethod, setPaymentMethod] = useState('cod');
	const [availableVouchers, setAvailableVouchers] = useState([]);
	const [finalAmount, setFinalAmount] = useState(0);

	// all userAddress
	const fetchAddresses = async () => {
		try {
			const res = await getUserAddresses();
			setUserAddresses(res);
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

	// Lấy data từ sessionStorage
	useEffect(() => {
		const rawItems = sessionStorage.getItem('checkoutItems');
		if (rawItems) {
			try {
				setOrderList(JSON.parse(rawItems));
			} catch (e) {
				console.error('Failed to parse checkout items', e);
				router.push(ROUTES.Home);
			}
		} else {
			router.push(ROUTES.Home);
		}
	}, [router]);

	// Tính tổng đơn hàng từ data sessionStorage
	useEffect(() => {
		const sum = orderList.reduce((acc, item) => acc + item.price * item.quantity, 0);
		setTotalAmount(sum);
	}, [orderList]);

	// Cập nhật số tiền phải thanh toán sau khi áp dụng voucher
	useEffect(() => {
		setFinalAmount(totalAmount - (appliedVoucher?.discountAmount || 0));
	}, [totalAmount, appliedVoucher]);

	// Create Order
	const handlePlaceOrder = async () => {
		if (!policyChecked || isPlacingOrder) return;
		if (!selectedAddress) {
			toast.error('Vui lòng chọn hoặc thêm địa chỉ giao hàng.');
			return;
		}

		setIsPlacingOrder(true);

		try {
			const itemsForApi = orderList.map((item) => ({
				productId: item.productId,
				sizeId: item.sizeId,
				quantity: item.quantity,
				colorId: item.colorId,
			}));

			const orderPayload = {
				shippingAddress: addressId,
				items: itemsForApi,
				note,
				voucherCode: appliedVoucher ? voucherCode.toUpperCase() : null,
				paymentMethod,
			};

			const order = await createOrder(orderPayload);

			const cartItemIdsToRemove = orderList.map((item) => item._id).filter((id) => id);

			if (cartItemIdsToRemove.length > 0) {
				await removeItemsFromCart(cartItemIdsToRemove);
			}

			sessionStorage.removeItem('checkoutItems');

			if (paymentMethod === 'vnpay') {
				const paymentRes = await createVNPayUrl({
					amount: order.finalAmount,
					orderId: order._id,
				});
				window.location.href = paymentRes;
			} else {
				setShowSuccessModal(true);
			}
		} catch (err) {
			console.error(err);
			toast.error(err.response?.data?.message || err.message || 'Tạo đơn hàng thất bại');
		} finally {
			setIsPlacingOrder(false);
		}
	};

	// Hiển thị Mã voucher khả dụng cho user
	useEffect(() => {
		const fetchAvailableVouchers = async () => {
			try {
				const vouchers = await getAvailableVouchersForUser();
				setAvailableVouchers(vouchers);
			} catch (err) {
				console.error('Lỗi khi lấy voucher:', err);
			}
		};

		fetchAvailableVouchers();
	}, []);

	// Áp dụng voucher
	const handleApplyVoucher = async () => {
		try {
			setVoucherError('');
			const now = new Date();

			const matchedVoucher = availableVouchers.find((v) => v.code === voucherCode.toUpperCase());

			if (matchedVoucher) {
				const start = new Date(matchedVoucher.startDate);
				const end = new Date(matchedVoucher.endDate);

				if (now < start) {
					setVoucherError('Mã giảm giá chưa có hiệu lực.');
					return;
				}

				if (now > end) {
					setVoucherError('Mã giảm giá đã hết hạn.');
					return;
				}
			}

			const response = await applyVoucher({
				code: voucherCode,
				orderTotal: totalAmount,
			});
			setAppliedVoucher(response);
			setFinalAmount(response.finalPrice);
			toast.success('Áp dụng mã giảm giá thành công');
		} catch (error) {
			setAppliedVoucher(null);
			setVoucherError(error.message || 'Mã giảm giá không hợp lệ');
		}
	};

	// Tính giá sau giảm
	const calculateDiscountAmount = (voucher) => {
		if (totalAmount < voucher.minOrderValue) return 0;

		if (voucher.discountType === 'percent') {
			const rawDiscount = (totalAmount * voucher.discountValue) / 100;
			return voucher.maxDiscount ? Math.min(rawDiscount, voucher.maxDiscount) : rawDiscount;
		}
		if (voucher.discountType === 'fixed') {
			return voucher.discountValue;
		}
		return 0;
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
									{item.name} - ({item.colorName}) - ({item.sizeName})
								</span>
								<span className={styles.itemQuantity}>{item.quantity}</span>
								<span className={styles.itemTotal}>{(item.price * item.quantity).toLocaleString('vi-VN')} VNĐ</span>
							</div>
						))}
					</div>

					<div className={styles.total}>
						Tổng thanh toán:
						<span className={styles.totalAmount}>
							{(appliedVoucher ? finalAmount : totalAmount).toLocaleString('vi-VN')} VNĐ
						</span>
					</div>

					<div className={styles.paymentMethods}>
						<h4>Phương thức thanh toán</h4>
						<label>
							<input
								type='radio'
								name='paymentMethod'
								value='cod'
								checked={paymentMethod === 'cod'}
								onChange={(e) => setPaymentMethod(e.target.value)}
							/>
							Tiền mặt khi nhận hàng (COD)
						</label>
						<label>
							<input
								type='radio'
								name='paymentMethod'
								value='vnpay'
								checked={paymentMethod === 'vnpay'}
								onChange={(e) => setPaymentMethod(e.target.value)}
							/>
							Chuyển khoản qua VNPay
						</label>
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
							onChange={(e) => {
								setVoucherCode(e.target.value);
								setAppliedVoucher(null);
								setVoucherError('');
								setFinalAmount(totalAmount);
							}}
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

						{/* list mã giảm giá */}
						<div className={styles.voucherList}>
							<h4 className={styles.voucherListTitle}>Mã giảm giá hiện có:</h4>
							{availableVouchers.map((v) => {
								const discountAmount = calculateDiscountAmount(v);
								const finalAmount = totalAmount - discountAmount;
								const isAvailableNow = new Date() >= new Date(v.startDate);

								return (
									<div
										key={v._id}
										className={styles.voucherItem}
										onClick={() => {
											if (isAvailableNow) {
												setVoucherCode(v.code);
												setTimeout(() => handleApplyVoucher(), 100);
											}
										}}
										style={{
											opacity: isAvailableNow ? 1 : 0.8,
											pointerEvents: isAvailableNow ? 'auto' : 'none',
										}}
									>
										<span className={styles.voucherShockLabel}>Áp dụng ngay </span>
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
										<p className={styles.voucherMore}>
											Còn lại: {v.quantity} | Hiệu lực:{' '}
											{new Date(v.startDate).toLocaleString('vi-VN', {hour12: false})} -{' '}
											{new Date(v.endDate).toLocaleString('vi-VN', {hour12: false})}
										</p>

										{isAvailableNow ? (
											<p className={styles.voucherPreviewDiscount}>
												Giá sau giảm (nếu áp dụng): {finalAmount.toLocaleString('vi-VN')}đ
											</p>
										) : (
											<p className={styles.voucherNote}>
												Có hiệu lực từ: {new Date(v.startDate).toLocaleString('vi-VN', {hour12: false})} - Hết hạn:{' '}
												{new Date(v.endDate).toLocaleString('vi-VN', {hour12: false})}
											</p>
										)}
									</div>
								);
							})}
						</div>
					</div>
				</div>

				{/* Address */}
				<div className={styles.deliveryInfo}>
					<div className={styles.deliveryHeader}>
						<h2 className={styles.deliveryTitle}>Thông tin nhận hàng</h2>
						<span className={styles.changeAddress} onClick={() => setShowUpdateAddress(true)}>
							Đổi địa chỉ
						</span>
					</div>
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
