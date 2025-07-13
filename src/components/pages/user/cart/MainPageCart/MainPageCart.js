import React, {useState, useEffect} from 'react';
import {useRouter} from 'next/router';
import styles from './MainPageCart.module.scss';
import Breadcrumb from '@/components/common/Breadcrumb/Breadcrumb';
import Image from 'next/image';
import icons from '@/constants/static/icons';
import Button from '@/components/common/Button/Button';
import {ROUTES} from '@/constants/config';
import images from '@/constants/static/images';
import {toast} from 'react-toastify';
import useCart from '@/hooks/useCart';

const MainPageCart = ({breadcrumbItems = {titles: [], listHref: []}}) => {
	const router = useRouter();

	const {cart, isLoading, updateCartItem, removeCartItem} = useCart();
	const cartItems = cart?.items || [];

	const [selectAllChecked, setSelectAllChecked] = useState(false);
	const [selectedItems, setSelectedItems] = useState([]);
	const [totalAmount, setTotalAmount] = useState(0);

	useEffect(() => {
		const newTotalAmount = cartItems.reduce((sum, item) => {
			if (selectedItems.includes(item._id)) {
				const price = item.productId?.price ?? 0;
				return sum + price * item.quantity;
			}
			return sum;
		}, 0);
		setTotalAmount(newTotalAmount);
	}, [selectedItems, cartItems]);

	const handleCheckboxChange = (itemId) => {
		const isSelected = selectedItems.includes(itemId);
		if (isSelected) {
			setSelectedItems(selectedItems.filter((id) => id !== itemId));
		} else {
			setSelectedItems([...selectedItems, itemId]);
		}
	};

	const handleSelectAllChange = () => {
		if (!selectAllChecked) {
			setSelectedItems(cartItems.map((item) => item._id));
		} else {
			setSelectedItems([]);
		}
		setSelectAllChecked(!selectAllChecked);
	};

	// Update quantity cart
	const handleQuantityChange = async (itemId, newQuantity) => {
		const quantity = parseInt(newQuantity, 10);
		if (quantity < 1 || isNaN(quantity)) return;
		try {
			await updateCartItem(itemId, quantity);
		} catch (error) {
			console.error('Cập nhật số lượng thất bại:', error);
			toast.error('Cập nhật số lượng thất bại.');
		}
	};

	const handleIncreaseQuantity = (itemId) => {
		const currentItem = cartItems.find((item) => item._id === itemId);
		if (currentItem) {
			handleQuantityChange(itemId, currentItem.quantity + 1);
		}
	};

	const handleDecreaseQuantity = (itemId) => {
		const currentItem = cartItems.find((item) => item._id === itemId);
		if (currentItem) {
			handleQuantityChange(itemId, currentItem.quantity - 1);
		}
	};

	// Xóa sp cart
	const handleDeleteSelected = async () => {
		if (selectedItems.length === 0) return;
		try {
			await Promise.all(selectedItems.map((itemId) => removeCartItem(itemId)));
			toast.success(`Đã xóa ${selectedItems.length} sản phẩm.`);
			setSelectedItems([]);
			setSelectAllChecked(false);
		} catch (error) {
			console.error('Xóa sản phẩm thất bại:', error);
			toast.error('Xóa sản phẩm thất bại.');
		}
	};

	const handleBuyNow = () => {
		const selectedForCheckout = cartItems
			.filter((item) => selectedItems.includes(item._id))
			.map((item) => ({
				_id: item._id,
				productId: item.productId?._id,
				sizeId: item.sizeId?._id,
				colorId: item.productId?.colors?.[0]?.colorId,
				quantity: item.quantity,
				name: item.productId?.name,
				colorName: item.productId?.colors?.[0]?.name,
				image: item.productId?.images?.[0],
				sizeName: item.sizeId?.name,
				price: item.productId?.price,
				isInvalid: !item.productId || !item.productId._id || !item.productId.name,
			}));

		const token = localStorage.getItem('token');
		if (!token) {
			toast.warning('Vui lòng đăng nhập để thanh toán!');
			router.push(ROUTES.Login);
			return;
		}

		if (selectedForCheckout.length === 0) {
			toast.warn('Vui lòng chọn sản phẩm để thanh toán');
			return;
		}

		const invalidItems = selectedForCheckout.filter((item) => item.isInvalid);
		if (invalidItems.length > 0) {
			toast.error('Sản phẩm đã bị xóa khỏi hệ thống. Vui lòng bỏ chọn sản phẩm không hợp lệ.');
			return;
		}

		try {
			sessionStorage.setItem('checkoutItems', JSON.stringify(selectedForCheckout));
			router.push(ROUTES.Order);
		} catch (error) {
			console.error('Lỗi khi lưu vào sessionStorage:', error);
			toast.error('Đã có lỗi xảy ra, vui lòng thử lại.');
		}
	};

	if (isLoading) {
		return <p style={{textAlign: 'center', padding: '50px'}}>Đang tải giỏ hàng của bạn...</p>;
	}

	return (
		<div className={styles.container}>
			<Breadcrumb titles={breadcrumbItems.titles} listHref={breadcrumbItems.listHref} />

			<div className={styles.main}>
				{cartItems.length === 0 ? (
					<div className={styles.noProducts}>
						<Image src={images.boxEmpty} alt='Không tìm thấy sản phẩm' width={180} height={180} priority />
						<h4>GIỎ HÀNG CỦA BẠN ĐANG TRỐNG</h4>
						<p>Hãy quay lại và chọn cho mình những sản phẩm ưng ý nhé!</p>
					</div>
				) : (
					<div className={styles.cartTable}>
						<div className={styles.cartHeader}>
							<div className={styles.headerItem}>
								<input type='checkbox' checked={selectAllChecked} onChange={handleSelectAllChange} /> Sản phẩm
							</div>
							<div className={styles.headerItem}>Đơn giá</div>
							<div className={styles.headerItem}>Màu sắc</div>
							<div className={styles.headerItem}>Kích cỡ</div>
							<div className={styles.headerItem}>Số lượng</div>
							<div className={styles.headerItem}>Thành tiền</div>
						</div>

						{cartItems.map((item) => (
							<div className={styles.cartItem} key={item._id}>
								<div className={styles.product}>
									<input
										type='checkbox'
										checked={selectedItems.includes(item._id)}
										onChange={() => handleCheckboxChange(item._id)}
									/>
									<div className={styles.productImage}>
										<Image
											src={item.productId?.images?.[0] || images.placeholder}
											alt={item.productId?.name}
											width={84}
											height={84}
										/>
									</div>
									<div className={styles.productInfo}>
										{item.productId?.name || (
											<span style={{color: 'red', fontStyle: 'italic'}}>Sản phẩm không tồn tại</span>
										)}
									</div>
								</div>
								<div className={styles.price}>{(item.productId?.price ?? 0).toLocaleString('vi-VN')} VNĐ</div>
								<div className={styles.color}>
									<span
										className={styles.colorDot}
										style={{backgroundColor: item.productId?.colors?.[0]?.name || 'gray'}}
									></span>
									{item.productId?.colors?.[0]?.name || 'N/A'}
								</div>
								<div className={styles.size}>{item.sizeId?.name}</div>
								<div className={styles.quantity}>
									<Button onClick={() => handleDecreaseQuantity(item._id)} className={styles.iconQuantity}>
										<span>-</span>
									</Button>
									<input
										type='text'
										value={item.quantity}
										min='1'
										onChange={(e) => handleQuantityChange(item._id, e.target.value)}
									/>
									<Button onClick={() => handleIncreaseQuantity(item._id)} className={styles.iconQuantity}>
										<span>+</span>
									</Button>
								</div>

								<div className={styles.total}>
									{((item.productId?.price ?? 0) * item.quantity).toLocaleString('vi-VN')} VNĐ
								</div>
							</div>
						))}
					</div>
				)}

				{cartItems.length > 0 && (
					<div className={styles.cartSummary}>
						<div className={styles.selectAll}>
							<input type='checkbox' id='selectAllCheckbox' checked={selectAllChecked} onChange={handleSelectAllChange} />
							<label htmlFor='selectAllCheckbox'>Tất cả sản phẩm ({cartItems.length})</label>
							<button className={styles.deleteButton} onClick={handleDeleteSelected} disabled={selectedItems.length === 0}>
								<span role='img' aria-label='delete'>
									<Image src={icons.trash} alt='Trash' width={24} height={24} />
								</span>
							</button>
						</div>
						<div className={styles.totalAmount}>
							Tổng thanh toán ({selectedItems.length} sản phẩm):{' '}
							<span>{totalAmount ? totalAmount.toLocaleString('vi-VN') : '0'} VNĐ</span>
						</div>
						<Button className={styles.checkoutButton} onClick={handleBuyNow} disabled={selectedItems.length === 0}>
							Thanh toán
						</Button>
					</div>
				)}
			</div>
		</div>
	);
};

export default MainPageCart;
