import React, {useState, useEffect} from 'react';
import styles from './FormUpdateProduct.module.scss';
import Button from '@/components/common/Button/Button';
import Image from 'next/image';
import icons from '@/constants/static/icons';
import images from '@/constants/static/images';
import {useRouter} from 'next/router';
import {connect} from 'react-redux';
import {setActiveMenu} from '@/redux/actions/menuTabActions';
import dynamic from 'next/dynamic';
import {ROUTES, API_URL_IMG} from '@/constants/config';
import {getProductById, updateProduct} from '@/services/productService';
import {toast} from 'react-toastify';
import Select from 'react-select';
import {getAllColors} from '@/services/colorService';
import {getAllSizes} from '@/services/sizeService';
import {getAllCategories} from '@/services/categoryService';
const JoditEditor = dynamic(() => import('jodit-react'), {ssr: false});

const FormUpdateProduct = ({setActiveMenu, productId}) => {
	const router = useRouter();
	const {_id: productIdFromRouter} = router.query;

	const [selectedImages, setSelectedImages] = useState([]);
	const [selectedFiles, setSelectedFiles] = useState([]);
	const [detailDescription, setDetailDesc] = useState('');
	const [oldImageFilenames, setOldImageFilenames] = useState([]);
	const [colorOptions, setColorOptions] = useState([]);
	const [categoryOptions, setCategoryOptions] = useState([]);
	const [sizes, setSizes] = useState([]);
	const [sizeQuantities, setSizeQuantities] = useState({});

	const [form, setForm] = useState({
		name: '',
		code: '',
		id: '',
		category: '',
		colors: '',
		price: '',
		description: '',
		detailDescription: '',
		isFeatured: false,
	});
	const MAX_IMAGES = 6;

	// Detail Product
	useEffect(() => {
		setActiveMenu(ROUTES.AdminProduct);
		if (productIdFromRouter) {
			(async () => {
				try {
					const productData = await getProductById(productIdFromRouter);
					if (!productData) throw new Error('Không tìm thấy sản phẩm với ID này!');

					// Cập nhật dữ liệu form từ API
					setForm({
						name: productData.name || '',
						code: productData.code || '',
						id: productData._id || '',
						category: JSON.stringify({
							categoryId: productData.category[0]?.categoryId || '',
							name: productData.category[0]?.name || '',
						}),
						colors: JSON.stringify(
							productData.colors.map((color) => ({
								colorId: color.colorId || '',
								name: color.name || '',
							}))
						),
						price: productData.price || '',
						description: productData.description || '',
						detailDescription: productData.detailDescription || '',
						isFeatured: productData.isFeatured || false,
					});

					setDetailDesc(productData.detailDescription || '');

					const initialQuantities = {};
					sizes.forEach((size) => {
						const productSize = productData.quantityBySize.find((item) => item.name === size.name);
						initialQuantities[size.name] = productSize ? productSize.quantity : ''; // Gán '' nếu không có
					});

					setSizeQuantities(initialQuantities);

					const oldFilenames = productData.images || [];
					setOldImageFilenames(oldFilenames); // Cập nhật tên ảnh cũ
					const oldImageUrls = oldFilenames.map((filename) => `${API_URL_IMG}uploads/${filename}`);

					setSelectedImages(oldImageUrls);
				} catch (err) {
					toast.error(err.message || 'Lỗi khi tải dữ liệu sản phẩm!');
					router.back();
				}
			})();
		}
	}, [setActiveMenu, productIdFromRouter, router, sizes]);

	const handleImageChange = (event) => {
		const files = event.target.files;
		if (!files?.length) return;
		const newFiles = Array.from(files).slice(0, MAX_IMAGES - selectedImages.length);
		const newImageUrls = newFiles.map((file) => URL.createObjectURL(file));

		setSelectedFiles((prev) => [...prev, ...newFiles]);
		setSelectedImages((prev) => [...prev, ...newImageUrls]);
	};

	const handleRemoveImage = (index) => {
		const totalOld = oldImageFilenames.length;

		// Nếu là ảnh cũ
		if (index < totalOld) {
			const updatedOldImages = [...oldImageFilenames];
			updatedOldImages.splice(index, 1);
			setOldImageFilenames(updatedOldImages);
		}

		// Xử lý selectedImages và selectedFiles
		const updatedSelectedImages = [...selectedImages];
		updatedSelectedImages.splice(index, 1);
		setSelectedImages(updatedSelectedImages);

		if (index >= totalOld) {
			const fileIndex = index - totalOld;
			const updatedSelectedFiles = [...selectedFiles];
			updatedSelectedFiles.splice(fileIndex, 1);
			setSelectedFiles(updatedSelectedFiles);
		}
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

	const handleInputChange = (e) => {
		const {name, value} = e.target;

		if (name === 'category') {
			const selectedCategory = categoryOptions.find((cat) => cat._id === value);
			if (selectedCategory) {
				setForm((prev) => ({
					...prev,
					category: JSON.stringify({
						categoryId: selectedCategory._id,
						name: selectedCategory.name,
					}),
				}));
			}
		} else {
			setForm((prev) => ({
				...prev,
				[name]: value,
			}));
		}
	};

	const handleColorChange = (selectedOptions) => {
		const selectedColors = selectedOptions ? selectedOptions.map((option) => ({colorId: option.value, name: option.label})) : [];
		setForm((prev) => ({
			...prev,
			colors: JSON.stringify(selectedColors),
		}));
	};

	const handleSizeQuantityChange = (e, sizeName) => {
		let value = parseInt(e.target.value, 10);
		if (isNaN(value) || value < 0) value = 0;

		setSizeQuantities((prev) => ({
			...prev,
			[sizeName]: value,
		}));
	};

	// Get all Colors
	useEffect(() => {
		const fetchColors = async () => {
			try {
				const res = await getAllColors();
				if (res?.colors) {
					setColorOptions(res.colors.map((color) => ({value: color._id, label: color.name})));
				} else {
					toast.error('Lỗi khi tải danh sách màu.');
				}
			} catch (error) {
				toast.error('Không thể kết nối để lấy màu.');
			}
		};
		fetchColors();
	}, []);

	// Get all sizes
	useEffect(() => {
		const fetchSizes = async () => {
			try {
				const res = await getAllSizes();
				if (res?.sizes) {
					setSizes(res.sizes);
				} else {
					toast.error('Lỗi khi tải danh sách size.');
				}
			} catch (error) {
				toast.error('Không thể kết nối để lấy size.');
			}
		};
		fetchSizes();
	}, []);

	// Get all categories
	useEffect(() => {
		const fetchCategories = async () => {
			try {
				const res = await getAllCategories();
				if (res?.categories) {
					setCategoryOptions(res.categories);
				} else {
					toast.error('Lỗi khi tải danh sách danh mục.');
				}
			} catch (error) {
				toast.error('Không thể kết nối để lấy danh mục.');
			}
		};
		fetchCategories();
	}, []);

	const handleUpdateProduct = async () => {
		if (!productIdFromRouter) return toast.error('Không có ID sản phẩm để cập nhật!');

		try {
			const formData = new FormData();

			const quantityBySize = sizes
				.map((size) => ({
					sizeId: size._id,
					name: size.name,
					quantity: sizeQuantities[size.name] || 0,
				}))
				.filter((item) => item.quantity > 0);

			formData.append('code', form.code);
			formData.append('name', form.name);
			formData.append(
				'quantityBySize',
				JSON.stringify(
					quantityBySize.map((item) => ({
						sizeId: item.sizeId.toString(),
						name: item.name,
						quantity: item.quantity,
					}))
				)
			);

			// Lấy category từ form.category
			const category = JSON.parse(form.category || '{}');
			formData.append(
				'category',
				JSON.stringify({
					categoryId: category.categoryId || '',
					name: category.name || '',
				})
			);

			// Lấy colors từ form.colors
			const colors = JSON.parse(form.colors || '[]');
			formData.append('colors', JSON.stringify(colors));

			formData.append('price', form.price);
			formData.append('description', form.description);
			formData.append('detailDescription', detailDescription);
			formData.append('isFeatured', form.isFeatured);

			// Thêm tên ảnh cũ để server có thể xử lý (nếu cần xóa)
			formData.append('oldImages', JSON.stringify(oldImageFilenames));

			// Thêm ảnh mới
			selectedFiles.forEach((file) => formData.append('images', file));

			const response = await updateProduct(productIdFromRouter, formData, {
				headers: {'Content-Type': 'multipart/form-data'},
			});

			toast.success(response.message || 'Cập nhật sản phẩm thành công!');
			router.push(ROUTES.AdminProduct);
		} catch (err) {
			console.error('Lỗi khi cập nhật sản phẩm:', err);
			toast.error(err.message || 'Chỉnh sửa sản phẩm thất bại!');
		}
	};

	const handleSubmitForm = () => {
		handleUpdateProduct();
	};

	const parseColors = (colorsString) => {
		try {
			const parsedColors = JSON.parse(colorsString || '[]');
			return Array.isArray(parsedColors)
				? parsedColors.map((color) => ({value: color?.colorId || '', label: color?.name || ''}))
				: [];
		} catch (error) {
			console.error('Lỗi parse form.colors:', error);
			return [];
		}
	};

	const formatPriceDisplay = (value) => {
		return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
	};

	const parsePriceInput = (value) => {
		return value.replace(/\./g, '');
	};

	return (
		<div className={styles.container}>
			<div className={styles.header}>
				<div className={styles.wrapper}>
					<h2 className={styles.title}>Chỉnh sửa sản phẩm</h2>
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
						value={form.name}
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
						value={form.code}
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
						value={form.category ? JSON.parse(form.category).categoryId : ''}
					>
						<option value=''>Chọn loại sản phẩm</option>
						{categoryOptions.map((category) => (
							<option key={category._id} value={category.categoryId}>
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
						options={colorOptions}
						className={styles.select}
						classNamePrefix='react-select'
						onChange={handleColorChange}
						value={parseColors(form.colors)}
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

				{/* Image */}
				<div className={styles.formGroup}>
					<label className={styles.label}>
						Chọn ảnh <span style={{color: 'red'}}>*</span>
					</label>
					<div className={styles.imageUpload}>
						<div className={styles.imagePreviewContainer}>
							{selectedImages.map((imageUrl, index) => (
								<div key={index} className={styles.imagePreview}>
									<Image
										src={imageUrl}
										alt={`Ảnh ${index + 1}`}
										width={80}
										height={80}
										onError={() => console.error('Lỗi tải ảnh:', imageUrl)}
									/>
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
						value={form.description}
					/>
				</div>

				{/* DescriptionDetail */}
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

export default connect(null, mapDispatchToProps)(FormUpdateProduct);
