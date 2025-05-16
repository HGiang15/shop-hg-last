import {useEffect, useState} from 'react';
import styles from './AddToCartModal.module.scss';
import {addToCart} from '@/services/cartService';
import {getAllSizes} from '@/services/sizeService';
import {toast} from 'react-toastify';
import useCart from '@/hooks/useCart';
import images from '@/constants/static/images';

const AddToCartModal = ({product, show, onClose}) => {
	const {dispatch} = useCart();

	const [sizeId, setSizeId] = useState('');
	const [quantity, setQuantity] = useState(1);
	const [sizes, setSizes] = useState([]);

	useEffect(() => {
		if (!show) return;

		const loadSizes = async () => {
			try {
				if (product?.sizes?.length && product.sizes[0]?.name) {
					setSizes(product.sizes);
				} else {
					const res = await getAllSizes(1, 100);
					setSizes(res.sizes || []);
				}
			} catch (err) {
				alert('Không thể tải dữ liệu kích cỡ');
			}
		};

		loadSizes();
	}, [show, product]);

	if (!show) return null;

	const adminBaseUrl = 'http://localhost:3003'; // nên đưa lên đầu file nếu chưa có
	// const selectedImage = product.images?.[0]
	// 	? product.images[0].startsWith('http')
	// 		? product.images[0]
	// 		: `${adminBaseUrl}/uploads/${product.images[0]}`
	// 	: images.defaultBg;
	const selectedImage = product.images?.[0] || '';

	const handleConfirm = async () => {
		if (!sizeId || quantity < 1) {
			toast.warn('Vui lòng chọn đầy đủ thông tin!');
			return;
		}
		try {
			const res = await addToCart({
				productId: product._id,
				colorId: product.colors?.[0],
				sizeId,
				quantity,
				image: selectedImage,
			});

			// Tìm đối tượng size object để lưu vào store
			const sizeObj = sizes.find((s) => s._id === sizeId);

			const newItem = {
				productId: product,
				sizeId: sizeObj,
				colorId: product.colors?.[0],
				quantity,
				image: selectedImage,
			};

			dispatch({
				type: 'ADD_ITEM',
				payload: newItem,
			});

			// Cập nhật localStorage
			const prevCart = JSON.parse(localStorage.getItem('cart')) || [];
			const updatedCart = [...prevCart, newItem];
			localStorage.setItem('cart', JSON.stringify(updatedCart));

			if (res.cartToken) {
				localStorage.setItem('cartToken', res.cartToken);
			}

			toast.success('Đã thêm sản phẩm vào giỏ hàng!');

			setTimeout(() => {
				onClose();
			}, 400);
		} catch (err) {
			toast.error(err.message || 'Lỗi thêm sản phẩm');
		}
	};

	return (
		<div className={styles.overlay}>
			<div className={styles.modal}>
				<h2 className={styles.title}>Chọn phân loại</h2>

				<div className={styles.formGroup}>
					<label>Kích thước</label>
					<select value={sizeId} onChange={(e) => setSizeId(e.target.value)}>
						<option value=''>-- Chọn size --</option>
						{sizes.map((size) => (
							<option key={size._id} value={size._id}>
								{size.name}
							</option>
						))}
					</select>
				</div>

				<div className={styles.formGroup}>
					<label>Số lượng</label>
					<input type='number' min='1' value={quantity} onChange={(e) => setQuantity(Number(e.target.value))} />
				</div>

				<div className={styles.actions}>
					<button onClick={onClose}>Huỷ</button>
					<button onClick={handleConfirm}>Xác nhận</button>
				</div>
			</div>
		</div>
	);
};

export default AddToCartModal;
