import React, {useState} from 'react';
import {toast} from 'react-toastify';
import styles from './FormCreateVoucher.module.scss';
import {createVoucher} from '@/services/voucherService';

const FormCreateVoucher = ({onCancel, onSuccess}) => {
	const [formData, setFormData] = useState({
		code: '',
		discountType: 'fixed',
		discountValue: '',
		minOrderValue: '',
		maxDiscount: '',
		quantity: '',
		startDate: '',
		endDate: '',
		showAt: '',
		isActive: true,
	});

	const [loading, setLoading] = useState(false);

	const formatPriceDisplay = (value) => {
		if (!value) return '';
		return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
	};
	const parsePriceInput = (value) => value.replace(/\./g, '');

	const handleChange = (e) => {
		const {name, value, type, checked} = e.target;

		if (['discountValue', 'minOrderValue', 'maxDiscount'].includes(name)) {
			const raw = parsePriceInput(value);
			if (!/^\d*$/.test(raw)) return;
			setFormData((prev) => ({
				...prev,
				[name]: raw,
			}));
		} else if (type === 'checkbox') {
			setFormData((prev) => ({
				...prev,
				[name]: checked,
			}));
		} else {
			setFormData((prev) => ({
				...prev,
				[name]: value,
			}));
		}
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		const payload = {
			...formData,
			discountValue: Number(formData.discountValue),
			minOrderValue: Number(formData.minOrderValue),
			maxDiscount: formData.discountType === 'percent' ? Number(formData.maxDiscount) : null,
			quantity: Number(formData.quantity),
		};

		try {
			setLoading(true);
			await createVoucher(payload);
			toast.success('Thêm voucher thành công');
			onSuccess && onSuccess();
		} catch (error) {
			toast.error(error.message || 'Thêm voucher thất bại');
		} finally {
			setLoading(false);
		}
	};

	return (
		<form className={styles.form} onSubmit={handleSubmit}>
			<h3 className={styles.title}>Thêm mới voucher</h3>

			<label className={styles.label}>
				Mã voucher
				<input className={styles.input} type='text' name='code' value={formData.code} onChange={handleChange} />
			</label>

			<label className={styles.label}>
				Loại giảm giá
				<select className={styles.select} name='discountType' value={formData.discountType} onChange={handleChange}>
					<option value='fixed'>Giảm theo số tiền</option>
					<option value='percent'>Giảm theo phần trăm</option>
				</select>
			</label>

			<label className={styles.label}>
				Giá trị giảm giá
				<input
					className={styles.input}
					type='text'
					name='discountValue'
					value={formatPriceDisplay(formData.discountValue)}
					onChange={handleChange}
				/>
			</label>

			<label className={styles.label}>
				Đơn tối thiểu
				<input
					className={styles.input}
					type='text'
					name='minOrderValue'
					value={formatPriceDisplay(formData.minOrderValue)}
					onChange={handleChange}
				/>
			</label>

			{formData.discountType === 'percent' && (
				<label className={styles.label}>
					Giảm tối đa
					<input
						className={styles.input}
						type='number'
						name='maxDiscount'
						// value={formData.maxDiscount}
						value={formatPriceDisplay(formData.maxDiscount)}
						onChange={handleChange}
						min='0'
						required={formData.discountType === 'percent'}
					/>
				</label>
			)}

			<label className={styles.label}>
				Số lượng
				<input className={styles.input} type='number' name='quantity' value={formData.quantity} onChange={handleChange} min='0' />
			</label>

			<label className={styles.label}>
				Hiển thị từ ngày
				<input className={styles.input} type='datetime-local' name='showAt' value={formData.showAt} onChange={handleChange} />
			</label>

			<label className={styles.label}>
				Ngày bắt đầu
				<input className={styles.input} type='datetime-local' name='startDate' value={formData.startDate} onChange={handleChange} />
			</label>

			<label className={styles.label}>
				Ngày kết thúc
				<input className={styles.input} type='datetime-local' name='endDate' value={formData.endDate} onChange={handleChange} />
			</label>

			<label className={styles.checkboxLabel}>
				<input type='checkbox' name='isActive' checked={formData.isActive} onChange={handleChange} />
				Đang hoạt động
			</label>

			<div className={styles.buttons}>
				<button type='submit' disabled={loading} className={styles.submitBtn}>
					{loading ? 'Đang thêm...' : 'Thêm voucher'}
				</button>
				<button type='button' onClick={onCancel} className={styles.cancelBtn}>
					Hủy
				</button>
			</div>
		</form>
	);
};

export default FormCreateVoucher;
