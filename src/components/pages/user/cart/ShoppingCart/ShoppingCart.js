import React, {useState, useEffect} from 'react';
import styles from './ShoppingCart.module.scss';
import Image from 'next/image';
import {useRouter} from 'next/router';
import Button from '@/components/common/Button/Button';
import icons from '@/constants/static/icons';
import {ROUTES} from '@/constants/config';
import {toast} from 'react-toastify';
import useCart from '@/hooks/useCart';
import images from '@/constants/static/images';

const ShoppingCart = ({onClose}) => {
	const router = useRouter();

	const {cart, isLoading, removeCartItem} = useCart();
	const cartItems = cart?.items || [];
	const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

	const [isActive, setIsActive] = useState(false);

	useEffect(() => {
		setIsActive(true);
	}, []);

	const handleClose = () => {
		setIsActive(false);
		setTimeout(onClose, 300);
	};

	const handleClick = (productId) => {
		if (!productId) {
			toast.error('Sản phẩm đã bị xóa khỏi hệ thống. Vui lòng xóa sản phẩm khỏi giỏ hàng!');
			return;
		}
		router.push(`/products/${productId}`);
		handleClose();
	};

	// Xóa sp cart
	const handleRemoveItem = async (itemId) => {
		try {
			await removeCartItem(itemId);
			toast.success('Đã xoá sản phẩm khỏi giỏ hàng');
		} catch (error) {
			toast.error('Không thể xoá sản phẩm khỏi giỏ hàng');
		}
	};

	const total = cartItems.reduce((sum, item) => sum + item.quantity * (item?.productId?.price || 0), 0);

	return (
		<div className={styles.overlay} onClick={handleClose}>
			<div className={`${styles.cartContainer} ${isActive ? styles.active : ''}`} onClick={(e) => e.stopPropagation()}>
				<div className={styles.header}>
					<h2>Giỏ hàng của bạn ({totalItems})</h2>
					<Button
						centerIcon={<Image src={icons.closeCircle} alt='CloseIcon' width={24} height={24} />}
						className={styles.closeBtn}
						onClick={handleClose}
					/>
				</div>

				<div className={styles.cartList}>
					{isLoading ? (
						<p>Đang tải giỏ hàng...</p>
					) : cartItems.length === 0 ? (
						<p>Không có sản phẩm nào trong giỏ hàng</p>
					) : (
						cartItems.map((item) => (
							<div key={item._id} className={styles.cartItem}>
								<Image
									src={item.productId?.images?.[0] || images.placeholder}
									alt={item.productId?.name || 'Sản phẩm'}
									width={100}
									height={100}
									className={styles.productImage}
								/>

								<div className={styles.details}>
									<div className={styles.wrapper}>
										<h4 className={styles.productName}>{item.productId?.name || 'Không có tên'}</h4>
										{/* <h4 className={styles.productName}>{item.productId?.colors?.[1]?.name || 'Không có tên'}</h4> */}
										<span className={styles.quantity}>x{item.quantity}</span>
									</div>
									<p>
										Màu sắc:
										<strong>{item.productId?.colors?.map((c) => c.name).join(', ') || 'Không xác định'}</strong>
									</p>
									<p>
										Kích cỡ: <strong>{item.sizeId?.name || 'N/A'}</strong>
									</p>
									<p>
										Đơn giá: <strong>{(item.productId?.price || 0).toLocaleString('vi-VN')} VNĐ</strong>
									</p>
									<p className={styles.price}>
										Thành tiền:
										<strong>{(item.quantity * (item.productId?.price || 0)).toLocaleString('vi-VN')} VNĐ</strong>
									</p>

									<div className={styles.actions}>
										<Button
											centerIcon={
												<Image
													src={icons.trash}
													alt='TrashIcon'
													width={20}
													height={20}
													className={styles.iconTrash}
												/>
											}
											className={styles.removeBtn}
											onClick={() => handleRemoveItem(item._id)}
										/>
										<Button onClick={() => handleClick(item.productId?._id)} className={styles.detailBtn}>
											Xem sản phẩm
										</Button>
									</div>
								</div>
							</div>
						))
					)}
				</div>

				{cartItems.length > 0 && (
					<div className={styles.footer}>
						<p>
							Tổng tạm tính: <span>{total.toLocaleString('vi-VN')} VNĐ</span>
						</p>
						<div className={styles.groupBtn}>
							<Button
								className={styles.goToCartBtn}
								onClick={() => {
									handleClose();
									router.push(ROUTES.Cart);
								}}
							>
								Chi tiết giỏ hàng
							</Button>
						</div>
					</div>
				)}
			</div>
		</div>
	);
};

export default ShoppingCart;
