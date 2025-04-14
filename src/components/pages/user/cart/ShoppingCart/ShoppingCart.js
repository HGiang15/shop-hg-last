import {ROUTES} from '@/constants/config';
import styles from './ShoppingCart.module.scss';
import Image from 'next/image';
import {useRouter} from 'next/router';
import images from '@/constants/static/images';
import Button from '@/components/common/Button/Button';
import icons from '@/constants/static/icons';
import {useEffect, useState} from 'react';

const ShoppingCart = ({onClose}) => {
	const router = useRouter();
	const [isActive, setIsActive] = useState(false);

	const cartItems = [
		{
			id: 'ID20242025',
			name: 'Áo MU Home 2024-2025',
			color: 'Đỏ',
			size: 'XXL',
			quantity: 2,
			price: 100000,
			image: images.product1,
		},
		{
			id: 'ID20242025',
			name: 'Áo MU Home 2024-2025',
			color: 'Đỏ',
			size: 'XXL',
			quantity: 1,
			price: 100000,
			image: images.product2,
		},
		{
			id: 'ID20242025',
			name: 'Áo MU Home 2024-2025',
			color: 'Đỏ',
			size: 'XXL',
			quantity: 1,
			price: 100000,
			image: images.product2,
		},
		{
			id: 'ID20242025',
			name: 'Áo MU Home 2024-2025',
			color: 'Đỏ',
			size: 'XXL',
			quantity: 1,
			price: 100000,
			image: images.product2,
		},
	];

	const total = cartItems.reduce((sum, item) => sum + item.quantity * item.price, 0);

	useEffect(() => {
		setIsActive(true);
	}, []);

	const handleClose = () => {
		setIsActive(false);
		setTimeout(onClose, 300);
	};

	const handleClick = (productCode) => {
		router.push(`/products/${productCode}`);
	};

	return (
		<div className={styles.overlay} onClick={handleClose}>
			<div className={`${styles.cartContainer} ${isActive ? styles.active : ''}`}>
				<div className={styles.header}>
					<h2>Giỏ hàng của bạn ({cartItems.reduce((a, b) => a + b.quantity, 0)})</h2>
					<Button
						centerIcon={<Image src={icons.closeCircle} alt='CloseIcon' width={24} height={24} />}
						className={styles.closeBtn}
						onClick={handleClose}
					/>
				</div>

				<div className={styles.cartList}>
					{cartItems.map((item, index) => (
						<div key={index} className={styles.cartItem}>
							<Image src={item.image} alt={item.name} width={100} height={100} />
							<div className={styles.details}>
								<div className={styles.wrapper}>
									<span className={styles.id}>#{item.id}</span>
									<span className={styles.quantity}>x{item.quantity}</span>
								</div>
								<h4>{item.name}</h4>
								<p>Màu sắc: {item.color}</p>
								<p>Kích cỡ: {item.size}</p>
								<p className={styles.price}>Thành giá: {(item.price * item.quantity).toLocaleString('vi-VN')} VNĐ</p>
								<div className={styles.actions}>
									<Button
										centerIcon={
											<Image src={icons.trash} alt='TrashIcon' width={24} height={24} className={styles.iconTrash} />
										}
										className={styles.removeBtn}
									></Button>
									<Button onClick={() => handleClick(item.id)} className={styles.detailBtn}>
										Chi tiết sản phẩm
									</Button>
								</div>
							</div>
						</div>
					))}
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
