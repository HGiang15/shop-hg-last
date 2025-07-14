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
		showAt: '',
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

	const formatDatetimeLocal = (isoString) => {
		if (!isoString) return '';
		const date = new Date(isoString);
		const pad = (n) => (n < 10 ? '0' + n : n);
		return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
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
					startDate: formatDatetimeLocal(data.startDate),
					endDate: formatDatetimeLocal(data.endDate),
					showAt: formatDatetimeLocal(data.showAt),
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

		const payload = {
			...formData,
			code: formData.code.trim(),
			discountValue: Number(formData.discountValue),
			minOrderValue: Number(formData.minOrderValue),
			maxDiscount: formData.discountType === 'percent' ? Number(formData.maxDiscount) : null,
			quantity: Number(formData.quantity),
		};

		try {
			await updateVoucher(voucherId, payload);
			toast.success('Cập nhật voucher thành công');
			onSuccess?.();
		} catch (err) {
			const message = err.response?.data?.message || err.message || 'Cập nhật thất bại';
			toast.error(message);
		}
	};

	if (loading) return <p>Đang tải dữ liệu...</p>;

	return (
		<form className={styles.form} onSubmit={handleSubmit}>
			<h2 className={styles.title}>Cập nhật voucher</h2>

			<label className={styles.label}>
				Mã voucher
				<input className={styles.input} name='code' value={formData.code} onChange={handleChange} />
			</label>

			<label className={styles.label}>
				Giá trị giảm
				<input
					className={styles.input}
					type='text'
					name='discountValue'
					value={formatPriceDisplay(formData.discountValue)}
					onChange={handleChange}
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
