import React, {useEffect, useState} from 'react';
import styles from './FormUpdateSize.module.scss';
import Button from '@/components/common/Button/Button';
import Image from 'next/image';
import icons from '@/constants/static/icons';
import {toast} from 'react-toastify';
import {getSizeById, updateSize} from '@/services/sizeService';

const FormUpdateSize = ({sizeId, onCancel, onSuccess}) => {
	const [formData, setFormData] = useState({
		name: '',
		description: '',
	});
	const [error, setError] = useState('');
	const [loading, setLoading] = useState(false);

	const handleChange = (e) => {
		const {name, value} = e.target;
		setFormData((prev) => ({...prev, [name]: value}));
	};

	// DetailSize
	useEffect(() => {
		const fetchSize = async () => {
			try {
				const data = await getSizeById(sizeId);
				setFormData({
					name: data.name || '',
					description: data.description || '',
				});
			} catch (err) {
				toast.error(err.message || 'Không thể lấy dữ liệu kích cỡ');
			}
		};
		if (sizeId) fetchSize();
	}, [sizeId]);

	// Update
	const handleSubmit = async () => {
		if (!formData.name) {
			setError('Tên kích cỡ là bắt buộc');
			return;
		}
		setLoading(true);
		try {
			await updateSize(sizeId, formData);
			toast.success('Cập nhật kích cỡ thành công');
			onSuccess();
		} catch (err) {
			toast.error(err.message || 'Cập nhật thất bại');
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className={styles.container}>
			<h2 className={styles.title}>Chỉnh sửa kích cỡ sản phẩm</h2>

			{error && <p className={styles.error}>{error}</p>}

			<div className={styles.formGroup}>
				<label>
					Tên kích cỡ <span className={styles.required}>*</span>
				</label>
				<input type='text' name='name' placeholder='Tên kích cỡ' value={formData.name} onChange={handleChange} />
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

export default FormUpdateSize;
