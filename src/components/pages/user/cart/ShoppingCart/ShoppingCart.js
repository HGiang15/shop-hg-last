// import {ROUTES} from '@/constants/config';
// import styles from './ShoppingCart.module.scss';
// import Image from 'next/image';
// import {useRouter} from 'next/router';
// import Button from '@/components/common/Button/Button';
// import icons from '@/constants/static/icons';
// import {useEffect, useState} from 'react';
// import {getAllCart, removeItemFromCart} from '@/services/cartService';
// import {toast} from 'react-toastify';

// const ShoppingCart = ({onClose, onUpdateCartCount}) => {
// 	const router = useRouter();
// 	const [isActive, setIsActive] = useState(false);
// 	const [cartItems, setCartItems] = useState([]);
// 	const [loading, setLoading] = useState(true);

// 	useEffect(() => {
// 		const fetchCart = async () => {
// 			try {
// 				const data = await getAllCart();
// 				const items = data.items || [];
// 				setCartItems(items);
// 				localStorage.setItem('cart', JSON.stringify(items));
// 				if (onUpdateCartCount) onUpdateCartCount(items.length);
// 			} catch (error) {
// 				console.error(error.message);
// 			} finally {
// 				setLoading(false);
// 			}
// 		};

// 		const handleStorageChange = () => {
// 			fetchCart();
// 		};

// 		setIsActive(true);
// 		fetchCart();

// 		window.addEventListener('storage', handleStorageChange);
// 		return () => window.removeEventListener('storage', handleStorageChange);
// 	}, []);

// 	const handleClose = () => {
// 		setIsActive(false);
// 		setTimeout(onClose, 300);
// 	};

// 	const handleClick = (productId) => {
// 		router.push(`/products/${productId}`);
// 	};

// 	const handleRemoveItem = async (itemId) => {
// 		try {
// 			await removeItemFromCart(itemId);
// 			const newItems = cartItems.filter((item) => item._id !== itemId);
// 			setCartItems(newItems);
// 			localStorage.setItem('cart', JSON.stringify(newItems));
// 			if (onUpdateCartCount) onUpdateCartCount(newItems.length);
// 			toast.success('Đã xoá sản phẩm khỏi giỏ hàng');
// 		} catch (error) {
// 			toast.error('Không thể xoá sản phẩm khỏi giỏ hàng');
// 		}
// 	};

// 	const adminBaseUrl = 'http://localhost:3003';

// 	const total = cartItems.reduce((sum, item) => sum + item.quantity * (item?.productId?.price || 0), 0);

// 	return (
// 		<div className={styles.overlay} onClick={handleClose}>
// 			<div className={`${styles.cartContainer} ${isActive ? styles.active : ''}`} onClick={(e) => e.stopPropagation()}>
// 				<div className={styles.header}>
// 					<h2>Giỏ hàng của bạn ({cartItems.reduce((a, b) => a + b.quantity, 0)})</h2>
// 					<Button
// 						centerIcon={<Image src={icons.closeCircle} alt='CloseIcon' width={24} height={24} />}
// 						className={styles.closeBtn}
// 						onClick={handleClose}
// 					/>
// 				</div>

// 				<div className={styles.cartList}>
// 					{loading ? (
// 						<p>Đang tải giỏ hàng...</p>
// 					) : cartItems.length === 0 ? (
// 						<p>Không có sản phẩm nào trong giỏ hàng</p>
// 					) : (
// 						cartItems.map((item, index) => (
// 							<div key={index} className={styles.cartItem}>
// 								<Image
// 									src={
// 										item.productId?.images?.length > 0
// 											? `${adminBaseUrl}/uploads/${item.productId.images[0]}`
// 											: '/default-product.jpg'
// 									}
// 									alt={item.productId?.name || 'Sản phẩm'}
// 									width={100}
// 									height={100}
// 								/>

// 								<div className={styles.details}>
// 									<div className={styles.wrapper}>
// 										<span className={styles.id}>#{item.productId?._id}</span>
// 										<span className={styles.quantity}>x{item.quantity}</span>
// 									</div>
// 									<h4>{item.productId?.name}</h4>
// 									<p>Màu sắc: {item.colorId?.name || 'Không có màu'}</p>
// 									<p>Kích cỡ: {item.sizeId?.name || 'Không có kích cỡ'}</p>
// 									<p className={styles.price}>
// 										Thành giá: {(item.quantity * (item.productId?.price || 0)).toLocaleString('vi-VN')} VNĐ
// 									</p>
// 									<div className={styles.actions}>
// 										<Button
// 											centerIcon={
// 												<Image
// 													src={icons.trash}
// 													alt='TrashIcon'
// 													width={24}
// 													height={24}
// 													className={styles.iconTrash}
// 												/>
// 											}
// 											className={styles.removeBtn}
// 											onClick={() => handleRemoveItem(item._id)}
// 										/>
// 										<Button onClick={() => handleClick(item.productId._id)} className={styles.detailBtn}>
// 											Chi tiết sản phẩm
// 										</Button>
// 									</div>
// 								</div>
// 							</div>
// 						))
// 					)}
// 				</div>

// 				<div className={styles.footer}>
// 					<p>
// 						Tổng tạm tính: <span>{total.toLocaleString('vi-VN')} VNĐ</span>
// 					</p>
// 					<div className={styles.groupBtn}>
// 						<Button
// 							className={styles.goToCartBtn}
// 							onClick={() => {
// 								onClose();
// 								router.push(ROUTES.Cart);
// 							}}
// 						>
// 							Chi tiết giỏ hàng
// 						</Button>
// 					</div>
// 				</div>
// 			</div>
// 		</div>
// 	);
// };

// export default ShoppingCart;

import {ROUTES} from '@/constants/config';
import styles from './ShoppingCart.module.scss';
import Image from 'next/image';
import {useRouter} from 'next/router';
import Button from '@/components/common/Button/Button';
import icons from '@/constants/static/icons';
import {useEffect, useState} from 'react';
import {getAllCart, removeItemFromCart} from '@/services/cartService';
import {toast} from 'react-toastify';

const ShoppingCart = ({onClose, onUpdateCartCount}) => {
	const router = useRouter();
	const [isActive, setIsActive] = useState(false);
	const [cartItems, setCartItems] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchCart = async () => {
			try {
				const data = await getAllCart();
				const items = data.items || [];
				setCartItems(items);
				localStorage.setItem('cart', JSON.stringify(items));
				if (onUpdateCartCount) onUpdateCartCount(items.length);
			} catch (error) {
				console.error(error.message);
			} finally {
				setLoading(false);
			}
		};

		const handleStorageChange = () => {
			fetchCart();
		};

		setIsActive(true);
		fetchCart();

		window.addEventListener('storage', handleStorageChange);
		return () => window.removeEventListener('storage', handleStorageChange);
	}, []);

	const handleClose = () => {
		setIsActive(false);
		setTimeout(onClose, 300);
	};

	const handleClick = (productId) => {
		router.push(`/products/${productId}`);
	};

	const handleRemoveItem = async (itemId) => {
		try {
			await removeItemFromCart(itemId);
			const newItems = cartItems.filter((item) => item._id !== itemId);
			setCartItems(newItems);
			localStorage.setItem('cart', JSON.stringify(newItems));
			if (onUpdateCartCount) onUpdateCartCount(newItems.length);
			toast.success('Đã xoá sản phẩm khỏi giỏ hàng');
		} catch (error) {
			toast.error('Không thể xoá sản phẩm khỏi giỏ hàng');
		}
	};

	const adminBaseUrl = 'http://localhost:3003';

	const total = cartItems.reduce((sum, item) => sum + item.quantity * (item?.productId?.price || 0), 0);

	return (
		<div className={styles.overlay} onClick={handleClose}>
			<div className={`${styles.cartContainer} ${isActive ? styles.active : ''}`} onClick={(e) => e.stopPropagation()}>
				<div className={styles.header}>
					<h2>Giỏ hàng của bạn ({cartItems.reduce((a, b) => a + b.quantity, 0)})</h2>
					<Button
						centerIcon={<Image src={icons.closeCircle} alt='CloseIcon' width={24} height={24} />}
						className={styles.closeBtn}
						onClick={handleClose}
					/>
				</div>

				<div className={styles.cartList}>
					{loading ? (
						<p>Đang tải giỏ hàng...</p>
					) : cartItems.length === 0 ? (
						<p>Không có sản phẩm nào trong giỏ hàng</p>
					) : (
						cartItems.map((item, index) => (
							<div key={index} className={styles.cartItem}>
								<Image
									src={
										item.productId?.images?.length > 0
											? `${adminBaseUrl}/uploads/${item.productId.images[0]}`
											: '/default-product.jpg'
									}
									alt={item.productId?.name || 'Sản phẩm'}
									width={100}
									height={100}
								/>

								<div className={styles.details}>
									<div className={styles.wrapper}>
										<span className={styles.id}>#{item.productId?._id}</span>
										<span className={styles.quantity}>x{item.quantity}</span>
									</div>
									<h4 className={styles.productName}>{item.productId?.name || 'Không có tên'}</h4>
									<p>
										Màu sắc: <strong>{item.productId?.colors}</strong>
									</p>
									<p>
										Kích cỡ: <strong>{item.sizeId?.name || 'Không xác định'}</strong>
									</p>
									<p>
										Đơn giá: <strong>{(item.productId?.price || 0).toLocaleString('vi-VN')} VNĐ</strong>
									</p>
									<p className={styles.price}>
										Thành tiền:{' '}
										<strong>{(item.quantity * (item.productId?.price || 0)).toLocaleString('vi-VN')} VNĐ</strong>
									</p>

									<div className={styles.actions}>
										<Button
											centerIcon={
												<Image
													src={icons.trash}
													alt='TrashIcon'
													width={24}
													height={24}
													className={styles.iconTrash}
												/>
											}
											className={styles.removeBtn}
											onClick={() => handleRemoveItem(item._id)}
										/>
										<Button onClick={() => handleClick(item.productId._id)} className={styles.detailBtn}>
											Xem sản phẩm
										</Button>
									</div>
								</div>
							</div>
						))
					)}
				</div>

				<div className={styles.footer}>
					<p>
						Tổng tạm tính: <span>{total.toLocaleString('vi-VN')} VNĐ</span>
					</p>
					<div className={styles.groupBtn}>
						<Button
							className={styles.goToCartBtn}
							onClick={() => {
								onClose();
								router.push(ROUTES.Cart);
							}}
						>
							Chi tiết giỏ hàng
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default ShoppingCart;
