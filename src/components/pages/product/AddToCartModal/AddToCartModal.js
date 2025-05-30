import {useEffect, useState} from 'react';
import styles from './AddToCartModal.module.scss';
import {addToCart, getAllCart} from '@/services/cartService';
import {getAllSizes} from '@/services/sizeService';
import {toast} from 'react-toastify';
import useCart from '@/hooks/useCart';
import images from '@/constants/static/images';

const AddToCartModal = ({product, show, onClose}) => {
	const {dispatch, setCartFromServer} = useCart();

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

	const handleConfirm = async () => {
		if (!sizeId || quantity < 1) {
			toast.warn('Vui lòng chọn đầy đủ thông tin!');
			return;
		}

		try {
			// ✅ Gửi lên server
			const res = await addToCart({
				productId: product._id,
				colorId: product.colors?.[0] || 'Không xác định',
				sizeId,
				quantity,
				image: product.images?.[0],
			});

			// ✅ Nếu có cartToken mới, lưu lại
			if (res.cartToken) {
				localStorage.setItem('cartToken', res.cartToken);
			}

			// ✅ Đồng bộ lại giỏ hàng từ BE để tránh cộng dồn
			const serverCart = await getAllCart();
			setCartFromServer(serverCart.items || []);

			toast.success('Đã thêm sản phẩm vào giỏ hàng!');
			setTimeout(() => {
				onClose();
			}, 400);
		} catch (err) {
			console.error(err);
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
