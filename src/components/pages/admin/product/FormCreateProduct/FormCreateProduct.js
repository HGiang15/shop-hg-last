import React, {useEffect, useState} from 'react';
import styles from './FormCreateProduct.module.scss';
import Button from '@/components/common/Button/Button';
import Image from 'next/image';
import icons from '@/constants/static/icons';
import images from '@/constants/static/images';
import {useRouter} from 'next/router';
import {connect} from 'react-redux';
import {setActiveMenu} from '@/redux/actions/menuTabActions';
import dynamic from 'next/dynamic';
import {ROUTES} from '@/constants/config';
import {createProduct} from '@/services/productService';
const JoditEditor = dynamic(() => import('jodit-react'), {ssr: false});
import {toast} from 'react-toastify';
import {getAllColors} from '@/services/colorService';

const FormCreateProduct = ({setActiveMenu}) => {
	const router = useRouter();

	const [selectedImages, setSelectedImages] = useState([]);
	const [detailDescription, setDetailDesc] = useState('');
	const [colorOptions, setColorOptions] = useState([]);
	const [form, setForm] = useState({
		name: '',
		code: '',
		id: '',
		category: '',
		colors: '',
		price: '',
		description: '',
		detailDescription: '',
		sizeS: 0,
		sizeM: 0,
		sizeL: 0,
		sizeXL: 0,
		sizeXXL: 0,
	});
	const MAX_IMAGES = 6;

	const handleImageChange = (event) => {
		const files = event.target.files;
		if (files && files.length > 0) {
			const newFiles = Array.from(files).slice(0, Math.max(0, MAX_IMAGES - selectedImages.length));
			setSelectedImages((prevFiles) => {
				const combinedFiles = [...prevFiles, ...newFiles].slice(0, MAX_IMAGES);
				return combinedFiles;
			});
		}
	};

	const handleRemoveImage = (index) => {
		setSelectedImages((prevFiles) => {
			const newFiles = [...prevFiles];
			newFiles.splice(index, 1);
			return newFiles;
		});
	};

	const handleDetailDescChange = (content) => {
		setDetailDesc(content);
		setForm((prev) => ({
			...prev,
			detailDescription: content,
		}));
	};

	const handleCancelClick = () => {
		setActiveMenu(ROUTES.AdminProduct);
		router.back();
	};

	// Create Product
	const handleSubmitForm = async () => {
		const formData = new FormData();
		formData.append('name', form.name);
		formData.append('code', form.code);
		formData.append('category', form.category);
		formData.append('colors', form.colors);
		formData.append('price', form.price);
		formData.append('description', form.description);
		formData.append('detailDescription', detailDescription);

		const quantityBySize = {
			S: parseInt(form.sizeS, 10) || 0,
			M: parseInt(form.sizeM, 10) || 0,
			L: parseInt(form.sizeL, 10) || 0,
			XL: parseInt(form.sizeXL, 10) || 0,
			XXL: parseInt(form.sizeXXL, 10) || 0,
		};

		formData.append('quantityBySize', JSON.stringify(quantityBySize));

		selectedImages.forEach((file) => {
			formData.append('images', file);
		});

		try {
			const response = await createProduct(formData);
			if (response.message === 'Tạo sản phẩm thành công') {
				toast.success('Sản phẩm đã được tạo thành công!', {
					position: 'top-right',
				});
				router.push(ROUTES.AdminProduct);
			}
		} catch (error) {
			toast.error('Đã có lỗi xảy ra khi tạo sản phẩm!', {
				position: 'top-right',
			});
		}
	};

	const handleInputChange = (e) => {
		if (!e || !e.target) return;
		const {name, value} = e.target;
		setForm((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	useEffect(() => {
		const fetchColors = async () => {
			try {
				const res = await getAllColors();
				setColorOptions(res);
			} catch (err) {
				console.error('Không thể tải danh sách màu:', err.message);
			}
		};
		fetchColors();
	}, []);

	return (
		<div className={styles.container}>
			<div className={styles.header}>
				<div className={styles.wrapper}>
					<h2 className={styles.title}>Thêm sản phẩm</h2>
					<p className={styles.description}>Điền đầy đủ các thông tin sản phẩm</p>
				</div>

				<div className={styles.buttonGroup}>
					<Button className={styles.cancelButton} onClick={handleCancelClick}>
						Hủy bỏ
					</Button>
					<Button
						leftIcon={<Image src={icons.edit} alt='Icon' width={18} height={18} className={styles.icon} />}
						className={styles.saveButton}
						onClick={handleSubmitForm}
					>
						Lưu lại
					</Button>
				</div>
			</div>
			<form className={styles.formGrid}>
				{/* Name */}
				<div className={styles.formGroup}>
					<label htmlFor='name' className={styles.label}>
						Tên sản phẩm <span style={{color: 'red'}}>*</span>
					</label>
					<input
						type='text'
						id='name'
						name='name'
						className={styles.input}
						placeholder='Tên sản phẩm'
						onChange={handleInputChange}
					/>
				</div>

				{/* ID */}
				<div className={styles.formGroup}>
					<label htmlFor='code' className={styles.label}>
						Mã sản phẩm <span style={{color: 'red'}}>*</span>
					</label>
					<input
						type='text'
						id='code'
						name='code'
						className={styles.input}
						placeholder='Mã sản phẩm'
						onChange={handleInputChange}
					/>
				</div>

				{/* Type */}
				<div className={styles.formGroup}>
					<label htmlFor='category' className={styles.label}>
						Loại sản phẩm <span style={{color: 'red'}}>*</span>
					</label>
					<select id='category' name='category' className={styles.select} onChange={handleInputChange}>
						<option value=''>Chọn loại sản phẩm</option>
						<option value='Áo CLB'>Áo CLB</option>
						<option value='Áo đội tuyển'>Áo đội tuyển</option>
						<option value='Áo không logo'>Áo không logo</option>
						<option value='Giày đá bóng'>Giày đá bóng</option>
					</select>
				</div>

				{/* Color */}
				<div className={styles.formGroup}>
					<label htmlFor='colors' className={styles.label}>
						Màu sản phẩm <span style={{color: 'red'}}>*</span>
					</label>
					<select id='colors' name='colors' className={styles.select} onChange={handleInputChange}>
						<option value=''>Chọn màu sản phẩm</option>
						{colorOptions.map((color) => (
							<option key={color._id} value={color.name}>
								{color.name}
							</option>
						))}
					</select>
				</div>

				{/* Price */}
				<div className={styles.formGroup}>
					<label htmlFor='price' className={styles.label}>
						Giá <span style={{color: 'red'}}>*</span>
					</label>
					<div className={styles.priceInput}>
						<input
							type='text'
							id='price'
							name='price'
							className={styles.input}
							placeholder='100.000'
							onChange={handleInputChange}
						/>
						<span className={styles.currencyInside}>VNĐ</span>
					</div>
				</div>

				{/* Images */}
				<div className={styles.formGroup}>
					<label className={styles.label}>
						Chọn ảnh <span style={{color: 'red'}}>*</span>
					</label>
					<div className={styles.imageUpload}>
						<div className={styles.imagePreviewContainer}>
							{selectedImages.map((file, index) => (
								<div key={index} className={styles.imagePreview}>
									<Image src={URL.createObjectURL(file)} alt={`Ảnh ${index + 1}`} width={80} height={80} />
									<button type='button' className={styles.removeImageButton} onClick={() => handleRemoveImage(index)}>
										<svg
											xmlns='http://www.w3.org/2000/svg'
											viewBox='0 0 20 20'
											fill='currentColor'
											className={styles.removeIcon}
										>
											<path
												fillRule='evenodd'
												d='M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z'
												clipRule='evenodd'
											/>
										</svg>
									</button>
								</div>
							))}
							{selectedImages.length < MAX_IMAGES && (
								<label htmlFor='chonAnh' className={styles.imagePlaceholderLabel}>
									<Image
										src={images.defaultBg}
										width={80}
										height={80}
										alt='icon'
										className={styles.placeholderIcon}
										style={{cursor: 'pointer'}}
										priority
									/>
								</label>
							)}
						</div>
						<input
							type='file'
							id='chonAnh'
							className={styles.fileInput}
							accept='image/*'
							multiple
							onChange={handleImageChange}
						/>
						<label htmlFor='chonAnh' className={styles.uploadButton}>
							Chọn ảnh
						</label>
						<p className={styles.fileSize}>File không vượt quá 5MB và chọn tối đa 6 ảnh</p>
					</div>
				</div>

				{/* S */}
				<div className={styles.formGroup}>
					<label htmlFor='sizeS' className={styles.label}>
						Nhập số lượng size S <span style={{color: 'red'}}>*</span>
					</label>
					<input type='number' id='sizeS' name='sizeS' className={styles.input} placeholder='0' onChange={handleInputChange} />
				</div>

				{/* M */}
				<div className={styles.formGroup}>
					<label htmlFor='sizeM' className={styles.label}>
						Nhập số lượng size M <span style={{color: 'red'}}>*</span>
					</label>
					<input type='number' id='sizeM' name='sizeM' className={styles.input} placeholder='0' onChange={handleInputChange} />
				</div>

				{/* L */}
				<div className={styles.formGroup}>
					<label htmlFor='sizeL' className={styles.label}>
						Nhập số lượng size L <span style={{color: 'red'}}>*</span>
					</label>
					<input type='number' id='sizeL' name='sizeL' className={styles.input} placeholder='0' onChange={handleInputChange} />
				</div>

				{/* XL */}
				<div className={styles.formGroup}>
					<label htmlFor='sizeXL' className={styles.label}>
						Nhập số lượng size XL <span style={{color: 'red'}}>*</span>
					</label>
					<input type='number' id='sizeXL' name='sizeXL' className={styles.input} placeholder='0' onChange={handleInputChange} />
				</div>

				{/* XXL */}
				<div className={styles.formGroup}>
					<label htmlFor='sizeXXL' className={styles.label}>
						Nhập số lượng size XXL <span style={{color: 'red'}}>*</span>
					</label>
					<input
						type='number'
						id='sizeXXL'
						name='sizeXXL'
						className={styles.input}
						placeholder='0'
						onChange={handleInputChange}
					/>
				</div>

				{/* Description */}
				<div className={styles.formGroup}>
					<label htmlFor='description' className={styles.label}>
						Mô tả chính
					</label>
					<textarea
						id='description'
						name='description'
						className={styles.textarea}
						placeholder='Nhập mô tả chi tiết'
						rows={4}
						onChange={handleInputChange}
					/>
				</div>

				{/* Description all */}
				<div className={styles.formGroup}>
					<label htmlFor='detailDescription' className={styles.label}>
						Mô tả chi tiết
					</label>
					<JoditEditor
						value={detailDescription}
						name='detailDescription'
						config={{
							placeholder: 'Nhập mô tả chi tiết',
							readonly: false,
							toolbar: true,
							spellcheck: true,
							language: 'en',
							toolbarButtonSize: 'medium',
							toolbarAdaptive: false,
							showCharsCounter: true,
							showWordsCounter: true,
							showXPathInStatusbar: false,
							askBeforePasteHTML: false,
							askBeforePasteFromWord: false,
							defaultActionOnPaste: 'insert_clear_html',
						}}
						tabIndex={1}
						onBlur={(newContent) => handleDetailDescChange(newContent)}
					/>
				</div>
			</form>
		</div>
	);
};

const mapDispatchToProps = (dispatch) => ({
	setActiveMenu: (menuPath) => dispatch(setActiveMenu(menuPath)),
});

export default connect(null, mapDispatchToProps)(FormCreateProduct);
