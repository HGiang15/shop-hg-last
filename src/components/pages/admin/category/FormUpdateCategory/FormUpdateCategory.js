import React, {useEffect, useState} from 'react';
import styles from './FormUpdateCategory.module.scss';
import Button from '@/components/common/Button/Button';
import Image from 'next/image';
import icons from '@/constants/static/icons';
import {toast} from 'react-toastify';
import {getCategoryById, updateCategory} from '@/services/categoryService';

const FormUpdateCategory = ({categoryId, onCancel, onSuccess}) => {
	const [formData, setFormData] = useState({name: '', image: null});
	const [previewImage, setPreviewImage] = useState('');
	const [error, setError] = useState('');
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		if (categoryId) {
			(async () => {
				try {
					const data = await getCategoryById(categoryId);
					setFormData({name: data.name, image: null});
					setPreviewImage(data.image);
				} catch (error) {
					toast.error(error.message || 'Không thể lấy thông tin danh mục');
				}
			})();
		}
	}, [categoryId]);

	const handleChange = (e) => {
		const {name, value} = e.target;
		setFormData((prev) => ({...prev, [name]: value}));
	};

	const handleImageChange = (e) => {
		const file = e.target.files[0];
		setFormData((prev) => ({...prev, image: file}));
		if (file) setPreviewImage(URL.createObjectURL(file));
	};

	const handleSubmit = async () => {
		if (!formData.name) {
			setError('Tên danh mục là bắt buộc');
			return;
		}
		setLoading(true);

		const payload = new FormData();
		payload.append('name', formData.name);
		if (formData.image) payload.append('image', formData.image);

		try {
			await updateCategory(categoryId, payload);
			toast.success('Cập nhật danh mục thành công');
			onSuccess?.();
			onCancel?.();
		} catch (error) {
			toast.error(error.message || 'Cập nhật thất bại');
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className={styles.container}>
			<h2 className={styles.title}>Chỉnh sửa danh mục</h2>

			{error && <p className={styles.error}>{error}</p>}

			<div className={styles.formGroup}>
				<label>
					Tên danh mục <span className={styles.required}>*</span>
				</label>
				<input type='text' name='name' value={formData.name} onChange={handleChange} placeholder='Tên danh mục' />
			</div>

			<div className={styles.formGroup}>
				<label>Hình ảnh</label>
				<input type='file' accept='image/*' onChange={handleImageChange} />
				{previewImage && (
					<div className={styles.previewImage}>
						<Image src={previewImage} alt='Preview' width={100} height={100} />
					</div>
				)}
			</div>

			<div className={styles.actions}>
				<Button onClick={onCancel} className={styles.btnCancel}>
					Hủy
				</Button>
				<Button
					onClick={handleSubmit}
					leftIcon={<Image src={icons.folderOpen} alt='Icon' width={20} height={20} />}
					className={styles.btnSave}
					disabled={loading}
				>
					{loading ? 'Đang lưu...' : 'Lưu thay đổi'}
				</Button>
			</div>
		</div>
	);
};

export default FormUpdateCategory;
