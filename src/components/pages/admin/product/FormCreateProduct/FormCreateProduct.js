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
import Select from 'react-select';
import {ROUTES} from '@/constants/config';
import {toast} from 'react-toastify';
import {createProduct} from '@/services/productService';
import {getAllColors} from '@/services/colorService';
import {getAllCategories} from '@/services/categoryService';
import {uploadMultiple} from '@/services/uploadService';

const JoditEditor = dynamic(() => import('jodit-react'), {ssr: false});

const FormCreateProduct = ({setActiveMenu}) => {
	const router = useRouter();

	const [selectedImages, setSelectedImages] = useState([]);
	const [errors, setErrors] = useState({});
	const [detailDescription, setDetailDesc] = useState('');
	const [colorOptions, setColorOptions] = useState([]);
	const [categoryOptions, setCategoryOptions] = useState([]);
	const [sizes, setSizes] = useState([]);
	const [sizeQuantities, setSizeQuantities] = useState({});
	const [loading, setLoading] = useState(false);

	const [form, setForm] = useState({
		name: '',
		code: '',
		id: '',
		category: {categoryId: '', name: ''},
		colors: [],
		price: '',
		description: '',
		detailDescription: '',
		isFeatured: false,
		status: '',
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

	const handleSubmitForm = async () => {
		setLoading(true);
		const formCreate = new FormData();
		const formUpload = new FormData();

		try {
			if (!form.name.trim()) {
				toast.error('Tên sản phẩm không được để trống!');
				return;
			}
			if (!form.category) {
				toast.error('Vui lòng chọn danh mục sản phẩm!');
				return;
			}
			if (!form.colors || form.colors.length === 0) {
				toast.error('Vui lòng chọn ít nhất một màu sắc!');
				return;
			}
			if (!form.price || isNaN(form.price) || Number(form.price) <= 0) {
				toast.error('Giá sản phẩm không hợp lệ!');
				return;
			}
			if (selectedImages.length === 0) {
				toast.error('Vui lòng chọn ít nhất một hình ảnh!');
				return;
			}

			selectedImages.forEach((file) => formUpload.append('files', file));
			const {data: imagesPath} = await uploadMultiple(formUpload);

			const quantityBySize = sizes
				.map((size) => ({
					sizeId: size._id,
					name: size.name,
					quantity: sizeQuantities[size.name] || 0,
				}))
				.filter((item) => item.quantity > 0);

			formCreate.append('quantityBySize', JSON.stringify(quantityBySize));
			formCreate.append('code', form.code);
			formCreate.append('name', form.name);
			formCreate.append('category', JSON.stringify(form.category));
			formCreate.append('colors', JSON.stringify(form.colors));
			formCreate.append('price', form.price);
			formCreate.append('description', form.description);
			formCreate.append('detailDescription', detailDescription);
			formCreate.append('isFeatured', form.isFeatured);
			formCreate.append('status', String(form.status));
			formCreate.append('images', JSON.stringify(imagesPath));

			const response = await createProduct(formCreate);
			if (response.message === 'Tạo sản phẩm thành công') {
				toast.success('Sản phẩm đã được tạo thành công!');
				router.push(ROUTES.AdminProduct);
			}
		} catch (error) {
			toast.error(error.message || 'Lỗi không xác định!');
		} finally {
			setLoading(false);
		}
	};

	const handleInputChange = (e) => {
		const {name, value} = e.target;

		if (name === 'name') {
			const autoCode = slugify(value);
			setForm((prev) => ({
				...prev,
				name: value,
				code: autoCode,
			}));
		} else if (name === 'category') {
			const selectedCategory = categoryOptions.find((cat) => cat._id === value);
			if (selectedCategory) {
				setForm((prev) => ({
					...prev,
					category: {
						categoryId: selectedCategory._id,
						name: selectedCategory.name,
					},
				}));
				setSizes(selectedCategory.sizes || []);
				const newQuantities = {};
				(selectedCategory.sizes || []).forEach((size) => {
					newQuantities[size.name] = 0;
				});
				setSizeQuantities(newQuantities);
			}
		} else {
			setForm((prev) => ({
				...prev,
				[name]: value,
			}));
			setErrors((prev) => ({...prev, [name]: null}));
		}
	};

	const handleSizeQuantityChange = (e, sizeName) => {
		let value = parseInt(e.target.value, 10);
		if (isNaN(value) || value < 0) value = 0;

		setSizeQuantities((prev) => ({
			...prev,
			[sizeName]: value,
		}));
	};

	const formatPriceDisplay = (value) => {
		return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
	};

	const parsePriceInput = (value) => {
		return value.replace(/\./g, '');
	};

	const slugify = (str) =>
		str
			.normalize('NFD')
			.replace(/[\u0300-\u036f]/g, '')
			.replace(/[^a-zA-Z0-9\s-]/g, '')
			.trim()
			.toLowerCase()
			.replace(/\s+/g, '-')
			.replace(/-+/g, '-');

	// Get all colors
	useEffect(() => {
		const fetchColors = async () => {
			try {
				const res = await getAllColors();
				if (res && res.colors) {
					setColorOptions(res.colors);
				} else {
					console.error('Không thể tải danh sách màu: Dữ liệu trả về không hợp lệ', res);
					toast.error('Lỗi khi tải danh sách màu.', {position: 'top-right'});
				}
			} catch (err) {
				console.error('Không thể tải danh sách màu:', err.message);
				toast.error('Lỗi kết nối khi tải danh sách màu.', {position: 'top-right'});
			}
		};
		fetchColors();
	}, []);

	// Get all category
	useEffect(() => {
		const fetchCategories = async () => {
			try {
				const res = await getAllCategories();
				if (res && res.categories) {
					setCategoryOptions(res.categories);
				} else {
					console.error('Không thể tải danh sách danh mục: Dữ liệu trả về không hợp lệ', res);
					toast.error('Lỗi khi tải danh sách danh mục.', {position: 'top-right'});
				}
			} catch (err) {
				console.error('Không thể tải danh sách danh mục:', err.message);
				toast.error('Lỗi kết nối khi tải danh sách danh mục.', {position: 'top-right'});
			}
		};
		fetchCategories();
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
						leftIcon={
							loading ? (
								<span className={styles.spinner}></span>
							) : (
								<Image src={icons.edit} alt='Icon' width={18} height={18} className={styles.icon} />
							)
						}
						className={styles.saveButton}
						onClick={handleSubmitForm}
						disabled={loading}
					>
						{loading ? 'Đang lưu...' : 'Lưu lại'}
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
					{errors.name && <p className={styles.errorText}>{errors.name}</p>}
				</div>

				{/* ID */}
				<div className={styles.formGroup}>
					<label htmlFor='code' className={styles.label}>
						Mã code <span style={{color: 'red'}}>*</span>
					</label>
					<input
						type='text'
						id='code'
						name='code'
						className={styles.input}
						placeholder='Mã sản phẩm'
						value={form.code}
						onChange={handleInputChange}
						disabled
					/>
				</div>

				{/* Category */}
				<div className={styles.formGroup}>
					<label htmlFor='category' className={styles.label}>
						Loại sản phẩm <span style={{color: 'red'}}>*</span>
					</label>
					<select
						id='category'
						name='category'
						className={styles.select}
						onChange={handleInputChange}
						value={form.category?.categoryId || ''}
					>
						<option value=''>Chọn loại sản phẩm</option>
						{categoryOptions.map((category) => (
							<option key={category._id} value={category._id}>
								{category.name}
							</option>
						))}
					</select>
				</div>

				{/* Color */}
				<div className={styles.formGroup}>
					<label htmlFor='colors' className={styles.label}>
						Màu sản phẩm <span style={{color: 'red'}}>*</span>
					</label>
					<Select
						isMulti
						name='colors'
						options={colorOptions.map((color) => ({
							value: color._id,
							label: color.name,
						}))}
						className={styles.select}
						classNamePrefix='react-select'
						onChange={(selectedOptions) => {
							const selectedColors = selectedOptions.map((option) => ({
								colorId: option.value,
								name: option.label,
							}));
							setForm((prev) => ({
								...prev,
								colors: selectedColors,
							}));
						}}
						value={form.colors.map((color) => ({
							value: color.colorId,
							label: color.name,
						}))}
						placeholder='Chọn màu sản phẩm'
						isSearchable
					/>
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
							value={formatPriceDisplay(form.price)}
							onChange={(e) => {
								const raw = parsePriceInput(e.target.value);
								if (/^\d*$/.test(raw)) {
									setForm((prev) => ({
										...prev,
										price: raw,
									}));
								}
							}}
						/>

						<span className={styles.currencyInside}>VNĐ</span>
					</div>
				</div>

				{/* Featured */}
				<div className={`${styles.formGroup} ${styles.featured}`}>
					<label htmlFor='isFeatured' className={styles.label}>
						Sản phẩm nổi bật
					</label>
					<input
						type='checkbox'
						id='isFeatured'
						name='isFeatured'
						checked={form.isFeatured}
						onChange={(e) =>
							setForm((prev) => ({
								...prev,
								isFeatured: e.target.checked,
							}))
						}
					/>
				</div>

				{/* Status */}
				<div className={styles.formGroup}>
					<label htmlFor='status' className={styles.label}>
						Trạng thái sản phẩm <span style={{color: 'red'}}>*</span>
					</label>
					<select id='status' name='status' className={styles.select} onChange={handleInputChange} value={form.status}>
						<option value=''>Chọn trạng thái</option>
						<option value='active'>Hoạt động</option>
						<option value='inactive'>Không hoạt động</option>
						<option value='discontinued'>Ngừng bán</option>
					</select>
					{errors.status && <p className={styles.errorText}>{errors.status}</p>}
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

				{/* Size */}
				{Array.isArray(sizes) &&
					sizes.map((size) => (
						<div className={styles.formGroup} key={size.name}>
							<label htmlFor={`size-${size.name}`} className={styles.label}>
								Nhập số lượng size {size.name}
							</label>
							<input
								type='number'
								id={`size-${size.name}`}
								name={`quantityBySize.${size.name}`}
								className={styles.input}
								placeholder='0'
								min={0}
								value={sizeQuantities[size.name] || ''}
								onChange={(e) => handleSizeQuantityChange(e, size.name)}
							/>
						</div>
					))}

				{/* Description */}
				<div className={`${styles.formGroup} ${styles.description}`}>
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
				<div className={`${styles.formGroup} ${styles.detailDescription}`}>
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
