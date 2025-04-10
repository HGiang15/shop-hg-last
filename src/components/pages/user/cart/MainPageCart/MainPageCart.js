import React, {useState, useEffect} from 'react';
import styles from './MainPageCart.module.scss';
import Breadcrumb from '@/components/common/Breadcrumb/Breadcrumb';
import Image from 'next/image';
import icons from '@/constants/static/icons';
import images from '@/constants/static/images';
import Button from '@/components/common/Button/Button';

const MainPageCart = ({breadcrumbItems = {titles: [], listHref: []}}) => {
	const initialCartItems = [
		{id: 1, name: 'MU Home 2024-2025', price: 300000, color: 'red', size: 'XL', quantity: 2, image: images.product1},
		{id: 2, name: 'MU Home 2024-2025', price: 300000, color: 'red', size: 'XL', quantity: 1, image: images.product2},
		{id: 3, name: 'MU Home 2024-2025', price: 300000, color: 'red', size: 'XL', quantity: 1, image: images.product2},
		{id: 4, name: 'MU Home 2024-2025', price: 300000, color: 'red', size: 'XL', quantity: 1, image: images.product2},
	];
	const [cartItems, setCartItems] = useState(initialCartItems);
	const [selectAllChecked, setSelectAllChecked] = useState(false);
	const [selectedItems, setSelectedItems] = useState([]);
	const [totalAmount, setTotalAmount] = useState(0);

	useEffect(() => {
		if (!Array.isArray(breadcrumbItems.titles) || !Array.isArray(breadcrumbItems.listHref)) {
			console.error('Invalid breadcrumb data');
		}
	}, [breadcrumbItems]);

	useEffect(() => {
		// Tính tổng tiền mỗi khi giỏ hàng hoặc số lượng thay đổi
		const newTotalAmount = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
		setTotalAmount(newTotalAmount);

		// Cập nhật trạng thái "Chọn tất cả"
		setSelectAllChecked(cartItems.length > 0 && cartItems.every((item) => selectedItems.includes(item.id)));
	}, [cartItems, selectedItems]);

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
			setSelectedItems(cartItems.map((item) => item.id));
		} else {
			setSelectedItems([]);
		}
	};

	const handleQuantityChange = (itemId, newQuantity) => {
		setCartItems((prevItems) =>
			prevItems.map((item) => (item.id === itemId ? {...item, quantity: Math.max(1, parseInt(newQuantity, 10) || 1)} : item))
		);
	};

	const handleIncreaseQuantity = (itemId) => {
		setCartItems((prevItems) => prevItems.map((item) => (item.id === itemId ? {...item, quantity: item.quantity + 1} : item)));
	};

	const handleDecreaseQuantity = (itemId) => {
		setCartItems((prevItems) =>
			prevItems.map((item) => (item.id === itemId ? {...item, quantity: Math.max(1, item.quantity - 1)} : item))
		);
	};

	const handleDeleteSelected = () => {
		setCartItems((prevItems) => prevItems.filter((item) => !selectedItems.includes(item.id)));
		setSelectedItems([]);
		setSelectAllChecked(false);
	};

	return (
		<div className={styles.container}>
			<Breadcrumb titles={breadcrumbItems.titles} listHref={breadcrumbItems.listHref} />

			<div className={styles.main}>
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
						<div className={styles.cartItem} key={item.id}>
							<div className={styles.product}>
								<input
									type='checkbox'
									checked={selectedItems.includes(item.id)}
									onChange={() => handleCheckboxChange(item.id)}
								/>
								<div className={styles.productImage}>
									<Image src={item.image} alt={item.name} width={84} height={84} />
								</div>
								<div className={styles.productInfo}>{item.name}</div>
							</div>
							<div className={styles.price}>{item.price.toLocaleString('vi-VN')} VNĐ</div>
							<div className={styles.color}>
								<span className={styles.colorDot} style={{backgroundColor: item.color}}></span> {item.color}
							</div>
							<div className={styles.size}>{item.size}</div>
							<div className={styles.quantity}>
								<Button onClick={() => handleDecreaseQuantity(item.id)} className={styles.iconQuantity}>
									<span>-</span>
								</Button>
								<input
									type='number'
									value={item.quantity}
									min='1'
									onChange={(e) => handleQuantityChange(item.id, e.target.value)}
								/>
								<Button onClick={() => handleIncreaseQuantity(item.id)} className={styles.iconQuantity}>
									<span>+</span>
								</Button>
							</div>
							<div className={styles.total}>{(item.price * item.quantity).toLocaleString('vi-VN')} VND</div>
						</div>
					))}
				</div>

				<div className={styles.cartSummary}>
					<div className={styles.selectAll}>
						<input type='checkbox' checked={selectAllChecked} onChange={handleSelectAllChange} />
						Tất cả sản phẩm ({cartItems.length})
						<button className={styles.deleteButton} onClick={handleDeleteSelected} disabled={selectedItems.length === 0}>
							<span role='img' aria-label='delete'>
								<Image src={icons.trash} alt='Trash' width={24} height={24} />
							</span>
						</button>
					</div>
					<div className={styles.totalAmount}>
						Tổng thanh toán: <span>{totalAmount.toLocaleString('vi-VN')} VNĐ</span>
					</div>
					<Button className={styles.checkoutButton} disabled={cartItems.length === 0}>
						Thanh toán
					</Button>
				</div>
			</div>
		</div>
	);
};

export default MainPageCart;
