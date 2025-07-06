import React, {useState} from 'react';
import styles from './FormCreateColor.module.scss';
import Button from '@/components/common/Button/Button';
import Image from 'next/image';
import icons from '@/constants/static/icons';
import {createColor} from '@/services/colorService';
import {toast} from 'react-toastify';

const FormCreateColor = ({onCancel, onSuccess}) => {
	const [formData, setFormData] = useState({
		name: '',
		code: '#000000',
		description: '',
	});
	const [error, setError] = useState('');
	const [loading, setLoading] = useState(false);

	const handleChange = (e) => {
		const {name, value} = e.target;
		setFormData((prev) => ({...prev, [name]: value}));
	};

	const handleColorChange = (e) => {
		setFormData((prev) => ({...prev, code: e.target.value}));
	};

	const handleSubmit = async () => {
		if (!formData.name.trim()) {
			setError('Tên màu là bắt buộc.');
			return;
		}
		setError('');
		try {
			setLoading(true);
			await createColor(formData);
			toast.success('Thêm màu thành công!');
			onSuccess?.();
			onCancel?.();
		} catch (err) {
			setError(err.message || 'Thêm màu thất bại');
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className={styles.container}>
			<h2 className={styles.title}>Thêm mới màu sản phẩm</h2>

			{error && <p className={styles.error}>{error}</p>}

			<div className={styles.formGroup}>
				<label>
					Tên màu <span className={styles.required}>*</span>
				</label>
				<input type='text' name='name' placeholder='Tên màu' value={formData.name} onChange={handleChange} />
			</div>

			<div className={styles.formGroup}>
				<label>
					Mã màu <span className={styles.required}>*</span>
				</label>
				<div className={styles.colorInputGroup}>
					<input type='color' value={formData.code} onChange={handleColorChange} />
					<input type='text' value={formData.code} disabled />
				</div>
			</div>

			<div className={styles.formGroup}>
				<label>Mô tả</label>
				<textarea name='description' placeholder='Mô tả' value={formData.description} onChange={handleChange} />
			</div>

			<div className={styles.actions}>
				<Button onClick={onCancel} className={styles.btnCancel}>
					Hủy bỏ
				</Button>
				<Button
					onClick={handleSubmit}
					leftIcon={<Image src={icons.folderOpen} alt='Icon' width={20} height={20} />}
					className={styles.btnSave}
					disabled={loading}
				>
					{loading ? 'Đang lưu...' : 'Lưu lại'}
				</Button>
			</div>
		</div>
	);
};

export default FormCreateColor;
