import React, {useEffect, useState, useRef} from 'react';
import styles from './FormUpdateCategory.module.scss';
import Button from '@/components/common/Button/Button';
import Image from 'next/image';
import icons from '@/constants/static/icons';
import {toast} from 'react-toastify';
import {getCategoryById, updateCategory} from '@/services/categoryService';
import {uploadSingle} from '@/services/uploadService';
import {getAllSizes} from '@/services/sizeService';
import Select from 'react-select';

const FormUpdateCategory = ({categoryId, onCancel, onSuccess}) => {
	const [formData, setFormData] = useState({name: '', image: null});
	const [previewImage, setPreviewImage] = useState('');
	const [error, setError] = useState('');
	const [loading, setLoading] = useState(false);
	const [sizes, setSizes] = useState([]);
	const [selectedSizes, setSelectedSizes] = useState([]);

	useEffect(() => {
		if (categoryId) {
			(async () => {
				try {
					const data = await getCategoryById(categoryId);
					setFormData({name: data.name, image: null});
					setPreviewImage(data.image);
					setSelectedSizes(
						data.sizes.map((size) => ({
							value: size._id,
							label: size.name,
						}))
					);
				} catch (error) {
					toast.error(error.message || 'Không thể lấy thông tin danh mục');
				}
			})();
		}
	}, [categoryId]);

	// Get all sizes
	useEffect(() => {
		const fetchSizes = async () => {
			try {
				const res = await getAllSizes();
				const sizeOptions = res.sizes.map((size) => ({
					value: size._id,
					label: size.name,
				}));
				setSizes(sizeOptions);

				setSelectedSizes((prev) =>
					prev.map((item) => {
						const found = sizeOptions.find((opt) => opt.value === item.value);
						return found || item;
					})
				);
			} catch (err) {
				console.error('Lỗi khi lấy danh sách size:', err);
			}
		};
		fetchSizes();
	}, []);

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
		if (!formData.name.trim()) {
			toast.error('Tên danh mục là bắt buộc.');
			return;
		}
		if (selectedSizes.length === 0) {
			toast.error('Vui lòng chọn ít nhất một kích cỡ.');
			return;
		}
		setError('');
		try {
			setLoading(true);
			const formUpdate = new FormData();

			// Nếu user chọn ảnh mới thì upload
			if (formData.image) {
				const formUpload = new FormData();
				formUpload.append('file', formData.image);
				const {data: image} = await uploadSingle(formUpload);
				formUpdate.append('image', image);
			} else {
				formUpdate.append('image', previewImage);
			}

			formUpdate.append('name', formData.name);

			const sizeIds = selectedSizes.map((s) => s.value);
			formUpdate.append('sizes', JSON.stringify(sizeIds));

			await updateCategory(categoryId, formUpdate);

			toast.success('Chỉnh sửa danh mục thành công!');
			onSuccess?.();
			onCancel?.();
		} catch (err) {
			setError(err.message || 'Chỉnh sửa danh mục thất bại');
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className={styles.container}>
			<h2 className={styles.title}>Chỉnh sửa danh mục</h2>

			<div className={styles.formGroup}>
				<label>
					Tên danh mục <span className={styles.required}>*</span>
				</label>
				<input type='text' name='name' value={formData.name} onChange={handleChange} placeholder='Tên danh mục' />
			</div>

			<div className={styles.formGroup}>
				<label>
					Kích cỡ <span className={styles.required}>*</span>
				</label>
				<Select isMulti options={sizes} value={selectedSizes} onChange={setSelectedSizes} placeholder='Chọn kích cỡ...' />
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
