import React, {useState, useRef, useEffect} from 'react';
import styles from './FormCreateCategory.module.scss';
import Button from '@/components/common/Button/Button';
import Image from 'next/image';
import icons from '@/constants/static/icons';
import {createCategory} from '@/services/categoryService';
import {toast} from 'react-toastify';
import images from '@/constants/static/images';
import {uploadSingle} from '@/services/uploadService';
import {getAllSizes} from '@/services/sizeService';
import Select from 'react-select';

const FormCreateCategory = ({onCancel, onSuccess}) => {
	const fileInputRef = useRef(null);
	const [formData, setFormData] = useState({
		name: '',
		image: null,
	});
	const [sizes, setSizes] = useState([]);
	const [selectedSizes, setSelectedSizes] = useState([]);
	const [imagePreview, setImagePreview] = useState(null);
	const [error, setError] = useState('');
	const [loading, setLoading] = useState(false);

	// Get all sizes
	useEffect(() => {
		const fetchSizes = async () => {
			try {
				const res = await getAllSizes();
				setSizes(res.sizes || []);
			} catch (err) {
				console.error('Lỗi khi lấy danh sách size:', err);
			}
		};
		fetchSizes();
	}, []);

	const options = sizes.map((size) => ({
		value: size._id,
		label: size.name,
	}));

	const handleChange = (e) => {
		setFormData((prev) => ({...prev, name: e.target.value}));
	};

	const handleImageChange = (e) => {
		const file = e.target.files[0];
		if (file) {
			const img = new window.Image();
			const objectUrl = URL.createObjectURL(file);
			img.src = objectUrl;
			img.onload = () => {
				if (img.width >= 300 && img.height >= 300) {
					setFormData((prev) => ({...prev, image: file}));
					setImagePreview(objectUrl);
					setError('');
				} else {
					setError('Hình ảnh phải có kích thước tối thiểu 300x300 pixel.');
					setFormData((prev) => ({...prev, image: null}));
					setImagePreview(null);
				}
			};
		}
	};

	// Create category
	const handleSubmit = async () => {
		if (!formData.name.trim()) {
			toast.error('Vui lòng nhập tên danh mục!');
			return;
		}

		if (selectedSizes.length === 0) {
			toast.error('Vui lòng chọn ít nhất một kích cỡ cho danh mục.');
			return;
		}

		if (!formData.image) {
			toast.error('Vui lòng chọn ảnh danh mục!');
			return;
		}
		setError('');
		try {
			setLoading(true);

			const formCreate = new FormData();
			const formUpload = new FormData();
			formUpload.append('file', formData.image);

			// Xử lý upload ảnh
			const {data: image} = await uploadSingle(formUpload);

			formCreate.append('name', formData.name);
			const sizeIds = selectedSizes.map((s) => s.value);
			formCreate.append('sizes', JSON.stringify(sizeIds));

			formCreate.append('image', image);

			await createCategory(formCreate);
			toast.success('Thêm danh mục thành công!');
			onSuccess?.();
			onCancel?.();
		} catch (err) {
			setError(err.message || 'Thêm danh mục thất bại');
		} finally {
			setLoading(false);
		}
	};

	const handleImageClick = () => {
		fileInputRef.current?.click();
	};

	return (
		<div className={styles.container}>
			<h2 className={styles.title}>Thêm mới danh mục</h2>

			<div className={styles.formGroup}>
				<label>
					Tên danh mục <span className={styles.required}>*</span>
				</label>
				<input type='text' name='name' placeholder='Tên danh mục' value={formData.name} onChange={handleChange} />
			</div>

			<div className={styles.formGroup}>
				<label>
					Kích cỡ <span className={styles.required}>*</span>
				</label>
				<div style={{flex: 1}}>
					<Select isMulti options={options} value={selectedSizes} onChange={setSelectedSizes} placeholder='Chọn kích cỡ...' />
				</div>
			</div>

			<div className={styles.imageUploadContainer}>
				<Image
					src={imagePreview || images.defaultBg}
					alt='Preview'
					width={100}
					height={100}
					className={styles.previewImage}
					onClick={handleImageClick}
					style={{cursor: 'pointer'}}
				/>

				<input ref={fileInputRef} type='file' accept='image/png, image/jpeg' onChange={handleImageChange} hidden />

				<div className={styles.uploadInstructions}>
					<p>
						Hình ảnh tải lên đạt kích thước tối thiểu <strong>300pixel x 300pixel</strong>
					</p>
					<p>
						<em>Định dạng hỗ trợ: JPG, JPEG, PNG</em>
					</p>
					<label className={styles.uploadButton} onClick={handleImageClick}>
						<Image src={icons.folderOpen} alt='Upload icon' width={16} height={16} />
						Chọn ảnh
					</label>
				</div>
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

export default FormCreateCategory;
