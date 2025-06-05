import React, {useEffect, useState} from 'react';
import styles from './FormUpdateVoucher.module.scss';
import {getVoucherById, updateVoucher} from '@/services/voucherService';
import {toast} from 'react-toastify';

const FormUpdateVoucher = ({voucherId, onCancel, onSuccess}) => {
	const [formData, setFormData] = useState({
		code: '',
		discountValue: '',
		discountType: 'percent',
		minOrderValue: '',
		maxDiscount: '',
		quantity: '',
		startDate: '',
		endDate: '',
		isActive: true,
	});
	const [loading, setLoading] = useState(true);

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

	useEffect(() => {
		const fetchVoucher = async () => {
			try {
				const data = await getVoucherById(voucherId);
				setFormData({
					code: data.code || '',
					discountValue: data.discountValue || '',
					discountType: data.discountType || 'percent',
					minOrderValue: data.minOrderValue || '',
					maxDiscount: data.maxDiscount || '',
					quantity: data.quantity || '',
					startDate: data.startDate?.slice(0, 10) || '',
					endDate: data.endDate?.slice(0, 10) || '',
					isActive: data.isActive,
				});
			} catch (err) {
				toast.error('Không thể tải dữ liệu voucher');
			} finally {
				setLoading(false);
			}
		};

		if (voucherId) fetchVoucher();
	}, [voucherId]);

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			await updateVoucher(voucherId, formData);
			toast.success('Cập nhật voucher thành công');
			onSuccess?.();
		} catch (err) {
			toast.error(err.message || 'Cập nhật thất bại');
		}
	};

	if (loading) return <p>Đang tải dữ liệu...</p>;

	return (
		<form className={styles.form} onSubmit={handleSubmit}>
			<h2 className={styles.title}>Cập nhật voucher</h2>

			<label className={styles.label}>
				Mã voucher
				<input className={styles.input} name='code' value={formData.code} onChange={handleChange} required />
			</label>

			<label className={styles.label}>
				Giá trị giảm
				<input
					className={styles.input}
					type='text'
					name='discountValue'
					value={formatPriceDisplay(formData.discountValue)}
					onChange={handleChange}
					required
				/>
			</label>

			<label className={styles.label}>
				Loại giảm
				<select className={styles.select} name='discountType' value={formData.discountType} onChange={handleChange}>
					<option value='percent'>Giảm theo %</option>
					<option value='fixed'>Giảm số tiền</option>
				</select>
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
					<input className={styles.input} type='number' name='maxDiscount' value={formData.maxDiscount} onChange={handleChange} />
				</label>
			)}

			<label className={styles.label}>
				Số lượng
				<input className={styles.input} type='number' name='quantity' value={formData.quantity} onChange={handleChange} />
			</label>

			<label className={styles.label}>
				Ngày bắt đầu
				<input className={styles.input} type='date' name='startDate' value={formData.startDate} onChange={handleChange} />
			</label>

			<label className={styles.label}>
				Ngày kết thúc
				<input className={styles.input} type='date' name='endDate' value={formData.endDate} onChange={handleChange} />
			</label>

			<label className={styles.checkboxLabel}>
				<input type='checkbox' name='isActive' checked={formData.isActive} onChange={handleChange} />
				Đang hoạt động
			</label>

			<div className={styles.buttons}>
				<button type='submit' className={`${styles.submitBtn}`}>
					Lưu
				</button>
				<button type='button' className={`${styles.cancelBtn}`} onClick={onCancel}>
					Hủy
				</button>
			</div>
		</form>
	);
};

export default FormUpdateVoucher;
