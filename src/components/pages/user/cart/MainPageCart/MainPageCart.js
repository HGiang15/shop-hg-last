import React, {useState, useEffect} from 'react';
import styles from './MainPageCart.module.scss';
import Breadcrumb from '@/components/common/Breadcrumb/Breadcrumb';
import Image from 'next/image';
import icons from '@/constants/static/icons';
import Button from '@/components/common/Button/Button';
import {ROUTES} from '@/constants/config';
import {getAllCart, updateCartItem, removeItemFromCart} from '@/services/cartService'; // Giả sử bạn đã tạo các API này
import images from '@/constants/static/images';

const MainPageCart = ({breadcrumbItems = {titles: [], listHref: []}}) => {
	const [cartItems, setCartItems] = useState([]);
	const [selectAllChecked, setSelectAllChecked] = useState(false);
	const [selectedItems, setSelectedItems] = useState([]);
	const [totalAmount, setTotalAmount] = useState(0);

	useEffect(() => {
		const fetchCartItems = async () => {
			try {
				const data = await getAllCart();
				setCartItems(data.items); // Giả sử API trả về danh sách sản phẩm trong giỏ hàng dưới thuộc tính `items`
			} catch (error) {
				console.error(error);
			}
		};

		fetchCartItems();
	}, []);

	useEffect(() => {
		const newTotalAmount = cartItems.reduce((sum, item) => {
			const price = item.productId.price ?? 0;
			return sum + price * item.quantity;
		}, 0);
		setTotalAmount(newTotalAmount);
	}, [cartItems]);

	const handleCheckboxChange = (itemId) => {
		const isSelected = selectedItems.includes(itemId);
		if (isSelected) {
			setSelectedItems(selectedItems.filter((id) => id !== itemId));
		} else {
			setSelectedItems([...selectedItems, itemId]);
		}
	};

	const handleSelectAllChange = () => {
		setSelectAllChecked(!selectAllChecked);
		if (!selectAllChecked) {
			setSelectedItems(cartItems.map((item) => item._id));
		} else {
			setSelectedItems([]);
		}
	};

	const handleQuantityChange = async (itemId, newQuantity) => {
		if (newQuantity < 1 || isNaN(newQuantity)) return; // Kiểm tra nếu giá trị không hợp lệ (kể cả NaN)
		try {
			const response = await updateCartItem(itemId, newQuantity); // Giả sử API updateCartItem trả về dữ liệu đã cập nhật
			const updatedItem = response.item; // Món hàng đã cập nhật
			const updatedTotalAmount = response.cartTotal; // Tổng giỏ hàng

			// Cập nhật lại giỏ hàng
			setCartItems((prevItems) => prevItems.map((item) => (item._id === itemId ? {...item, quantity: updatedItem.quantity} : item)));

			// Cập nhật tổng số tiền của giỏ hàng
			setTotalAmount(updatedTotalAmount);
		} catch (error) {
			console.error('Cập nhật số lượng thất bại:', error);
		}
	};

	const handleIncreaseQuantity = async (itemId) => {
		const currentItem = cartItems.find((item) => item._id === itemId);
		const newQuantity = currentItem ? currentItem.quantity + 1 : 1;
		handleQuantityChange(itemId, newQuantity);
	};

	const handleDecreaseQuantity = async (itemId) => {
		const currentItem = cartItems.find((item) => item._id === itemId);
		const newQuantity = currentItem ? Math.max(1, currentItem.quantity - 1) : 1;
		handleQuantityChange(itemId, newQuantity);
	};

	const handleDeleteSelected = async () => {
		try {
			await Promise.all(selectedItems.map((itemId) => removeItemFromCart(itemId)));
			// Cập nhật lại giỏ hàng sau khi xóa sản phẩm
			const remainingItems = cartItems.filter((item) => !selectedItems.includes(item._id));
			setCartItems(remainingItems);
			setSelectedItems([]);
			setSelectAllChecked(false);
		} catch (error) {
			console.error('Xóa sản phẩm thất bại:', error);
		}
	};

	return (
		<div className={styles.container}>
			<Breadcrumb titles={breadcrumbItems.titles} listHref={breadcrumbItems.listHref} />

			<div className={styles.main}>
				{/* Kiểm tra nếu giỏ hàng không có sản phẩm */}
				{cartItems.length === 0 ? (
					<div className={styles.noProducts}>
						<Image src={images.boxEmpty} alt='Không tìm thấy sản phẩm' width={180} height={180} priority />
						<h4>DỮ LIỆU TRỐNG</h4>
						<p>Hiện tại không có sản phẩm nào phù hợp!</p>
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
											src={`http://localhost:3003/uploads/${item.productId.images[0]}`} // Đảm bảo đường dẫn tuyệt đối đến server
											alt={item.productId.name}
											width={84}
											height={84}
										/>
									</div>
									<div className={styles.productInfo}>{item.productId.name}</div>
								</div>
								<div className={styles.price}>{(item.productId.price ?? 0).toLocaleString('vi-VN')} VNĐ</div>
								<div className={styles.color}>
									<span
										className={styles.colorDot}
										style={{backgroundColor: item.productId.colors[0]?.name || 'gray'}}
									></span>
									{item.productId.colors[0]?.name || 'Màu sắc không xác định'}
								</div>
								<div className={styles.size}>{item.sizeId.name}</div>
								<div className={styles.quantity}>
									<Button onClick={() => handleDecreaseQuantity(item._id)} className={styles.iconQuantity}>
										<span>-</span>
									</Button>
									<input
										type='number'
										value={item.quantity}
										min='1'
										onChange={(e) => handleQuantityChange(item._id, parseInt(e.target.value))}
									/>
									<Button onClick={() => handleIncreaseQuantity(item._id)} className={styles.iconQuantity}>
										<span>+</span>
									</Button>
								</div>
								<div className={styles.total}>{(item.productId.price * item.quantity).toLocaleString('vi-VN')} VNĐ</div>
							</div>
						))}
					</div>
				)}

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
						Tổng thanh toán: <span>{totalAmount ? totalAmount.toLocaleString('vi-VN') : '0'} VNĐ</span>
					</div>

					<Button
						className={styles.checkoutButton}
						onClick={() => {
							const selectedForCheckout = cartItems
								.filter((item) => selectedItems.includes(item._id))
								.map((item) => ({
									productId: item.productId,
									name: item.name,
									color: item.color,
									image: item.image,
									sizeId: item.sizeId,
									sizeName: item.sizeName,
									quantity: item.quantity,
									price: item.price,
								}));

							if (selectedForCheckout.length === 0) {
								toast.warn('Vui lòng chọn sản phẩm để thanh toán');
								return;
							}

							localStorage.setItem('buyNow', JSON.stringify(selectedForCheckout));
							router.push(ROUTES.Order);
						}}
					>
						Thanh toán
					</Button>
				</div>
			</div>
		</div>
	);
};

export default MainPageCart;
