import {useEffect, useState, useMemo} from 'react';
import styles from './AddToCartModal.module.scss';
import {toast} from 'react-toastify';
import useCart from '@/hooks/useCart';

const AddToCartModal = ({product, show, onClose}) => {
	const {addItemToCart} = useCart();

	const [sizeId, setSizeId] = useState('');
	const [quantity, setQuantity] = useState(1);

	useEffect(() => {
		if (show && product?.quantityBySize) {
			const firstAvailableSize = product.quantityBySize.find((s) => s.quantity > 0);
			if (firstAvailableSize) {
				setSizeId(firstAvailableSize.sizeId);
			} else {
				setSizeId('');
			}
			setQuantity(1);
		}
	}, [show, product]);

	// quantity tồn kho của size đang chọn
	const availableStock = useMemo(() => {
		if (!product || !sizeId) return 0;
		const sizeInfo = product.quantityBySize.find((s) => s.sizeId === sizeId);
		return sizeInfo ? sizeInfo.quantity : 0;
	}, [product, sizeId]);

	if (!show) return null;

	const handleConfirm = async () => {
		if (!sizeId || quantity < 1) {
			toast.warn('Vui lòng chọn đầy đủ thông tin!');
			return;
		}

		if (quantity > availableStock) {
			return toast.error('Số lượng bạn chọn vượt quá số lượng tồn kho.');
		}

		const payload = {
			productId: product._id,
			sizeId,
			quantity,
		};

		try {
			await addItemToCart(payload);
			toast.success('Đã thêm sản phẩm vào giỏ hàng!');
			setTimeout(() => {
				onClose();
			}, 400);
		} catch (err) {
			console.error(err);
			const errorMessage = err.response?.data?.message || 'Lỗi thêm sản phẩm';
			toast.error(errorMessage);
		}
	};

	// Giới hạn số lượng nhập vào không vượt quá tồn kho
	const handleSetQuantity = (value) => {
		const num = Number(value);
		if (num >= 1 && num <= availableStock) {
			setQuantity(num);
		} else if (num > availableStock) {
			setQuantity(availableStock);
		}
	};

	return (
		<div className={styles.overlay}>
			<div className={styles.modal}>
				<h2 className={styles.title}>Chọn phân loại</h2>

				<div className={styles.formGroup}>
					<label>Kích thước</label>
					<select
						value={sizeId}
						onChange={(e) => {
							setSizeId(e.target.value);
							setQuantity(1);
						}}
					>
						<option value=''>-- Chọn size --</option>
						{product?.quantityBySize?.map((size) => (
							<option key={size.sizeId} value={size.sizeId} disabled={size.quantity <= 0}>
								{size.name} {size.quantity > 0 ? `(Còn: ${size.quantity})` : '(Hết hàng)'}
							</option>
						))}
					</select>
				</div>

				<div className={styles.formGroup}>
					<label>Số lượng (Còn lại: {availableStock})</label>
					<input
						type='number'
						min='1'
						max={availableStock}
						value={quantity}
						onChange={(e) => handleSetQuantity(e.target.value)}
						disabled={!sizeId || availableStock <= 0}
					/>
				</div>

				<div className={styles.actions}>
					<button onClick={onClose}>Huỷ</button>
					<button onClick={handleConfirm} disabled={!sizeId || availableStock <= 0 || quantity > availableStock}>
						Xác nhận
					</button>
				</div>
			</div>
		</div>
	);
};

export default AddToCartModal;
