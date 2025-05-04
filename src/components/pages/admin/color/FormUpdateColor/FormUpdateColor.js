import React, {useEffect, useState} from 'react';
import styles from './FormUpdateColor.module.scss';
import Button from '@/components/common/Button/Button';
import Image from 'next/image';
import icons from '@/constants/static/icons';
import {toast} from 'react-toastify';
import {getColorById, updateColor} from '@/services/colorService';

const FormUpdateColor = ({colorId, onCancel, onSuccess}) => {
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

	// DetailColor
	useEffect(() => {
		const fetchColor = async () => {
			try {
				const data = await getColorById(colorId);
				setFormData({
					name: data.name || '',
					code: data.code || '#000000',
					description: data.description || '',
				});
			} catch (err) {
				toast.error(err.message || 'Không thể lấy dữ liệu màu');
			}
		};
		if (colorId) fetchColor();
	}, [colorId]);

	// Update
	const handleSubmit = async () => {
		if (!formData.name || !formData.code) {
			setError('Tên màu và mã màu là bắt buộc');
			return;
		}
		setLoading(true);
		try {
			await updateColor(colorId, formData);
			toast.success('Cập nhật màu thành công');
			onSuccess();
		} catch (err) {
			toast.error(err.message || 'Cập nhật thất bại');
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className={styles.container}>
			<h2 className={styles.title}>Chỉnh sửa màu sản phẩm</h2>

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

export default FormUpdateColor;
