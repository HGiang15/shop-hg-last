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
import {ROUTES} from '@/constants/config';
import {getProductById, updateProduct} from '@/services/productService';
import {toast} from 'react-toastify';
import Select from 'react-select';
import {getAllColors} from '@/services/colorService';
import {getSizesByCategoryId} from '@/services/sizeService';
import {getAllCategories} from '@/services/categoryService';
import {uploadMultiple} from '@/services/uploadService';

const JoditEditor = dynamic(() => import('jodit-react'), {ssr: false});

const FormUpdateProduct = ({setActiveMenu}) => {
	const router = useRouter();
	const {_id} = router.query;

	const [imagesSelected, setImagesSelected] = useState([]);
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

	// Detail Product
	useEffect(() => {
		if (!_id) return;

		const fetchProductAndSizes = async () => {
			try {
				const productData = await getProductById(_id);
				if (!productData) throw new Error('Không tìm thấy sản phẩm với ID này!');

				setForm({
					name: productData.name || '',
					code: productData.code || '',
					id: productData._id || '',
					category: {
						categoryId: productData.category[0]?.categoryId || '',
						name: productData.category[0]?.name || '',
					},
					colors: productData.colors.map((color) => ({
						colorId: color.colorId || '',
						name: color.name || '',
					})),
					price: productData.price || '',
					description: productData.description || '',
					detailDescription: productData.detailDescription || '',
					isFeatured: productData.isFeatured || false,
					status: productData.status || '',
				});

				setDetailDesc(productData.detailDescription || '');

				// Gọi API size theo category của product
				const categoryId = productData.category[0]?.categoryId;
				if (categoryId) {
					const res = await getSizesByCategoryId(categoryId);
					const fetchedSizes = res?.sizes || [];
					setSizes(fetchedSizes);

					// Gán số lượng theo size
					const initialQuantities = {};
					fetchedSizes.forEach((size) => {
						const match = productData.quantityBySize.find((item) => item.name === size.name);
						initialQuantities[size.name] = match ? match.quantity : '';
					});
					setSizeQuantities(initialQuantities);
				}

				setImagesSelected(
					productData?.images?.map((img) => ({
						path: img,
						file: null,
						url: '',
					}))
				);
			} catch (err) {
				toast.error(err.message || 'Lỗi khi tải dữ liệu sản phẩm!');
				router.back();
			}
		};

		fetchProductAndSizes();
	}, [_id]);

	const handleImageChange = (event) => {
		const files = event.target.files;
		if (!files?.length) return;

		const newImages = [];
		for (let i = 0; i < files.length; i++) {
			const file = files[i];
			const url = URL.createObjectURL(file);
			newImages.push({
				file: file,
				url: url,
				path: '',
			});
		}

		setImagesSelected((prev) => [...prev, ...newImages]);
	};

	const handleDelete = (index) => {
		setImagesSelected((prev) => {
			URL.revokeObjectURL(prev[index].url);
			return [...prev.slice(0, index), ...prev.slice(index + 1)];
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

	const handleInputChange = async (e) => {
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

				try {
					const res = await getSizesByCategoryId(selectedCategory._id);
					setSizes(res?.sizes || []);

					const newQuantities = {};
					(res?.sizes || []).forEach((size) => {
						newQuantities[size.name] = '';
					});
					setSizeQuantities(newQuantities);
				} catch (err) {
					toast.error('Lỗi khi tải size theo danh mục');
				}
			}
		} else {
			setForm((prev) => ({
				...prev,
				[name]: value,
			}));
		}
	};

	const handleColorChange = (selectedOptions) => {
		const selectedColors = selectedOptions
			? selectedOptions.map((option) => ({
					colorId: option.value,
					name: option.label,
			  }))
			: [];
		setForm((prev) => ({
			...prev,
			colors: selectedColors,
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
		if (!_id) return toast.error('Không có ID sản phẩm để cập nhật!');

		setLoading(true);
		const formUpdate = new FormData();
		const formUpload = new FormData();

		try {
			if (!form.name.trim()) {
				toast.error('Tên sản phẩm không được để trống!', {position: 'top-right'});
				return;
			}
			if (!form.category || form.category === '{}') {
				toast.error('Vui lòng chọn danh mục sản phẩm!', {position: 'top-right'});
				return;
			}
			if (!form.colors || form.colors === '[]') {
				toast.error('Vui lòng chọn ít nhất một màu sắc!', {position: 'top-right'});
				return;
			}
			if (!form.price || isNaN(form.price) || Number(form.price) <= 0) {
				toast.error('Giá sản phẩm không hợp lệ!', {position: 'top-right'});
				return;
			}

			const files = imagesSelected?.filter((v) => !!v.file && !v.path)?.map((m) => m.file) || [];
			const existingPaths = imagesSelected?.filter((v) => !!v.path && !v.file)?.map((m) => m.path) || [];

			let finalImagePaths = [...existingPaths];

			if (files.length > 0) {
				files.forEach((file) => formUpload.append('files', file));
				const {data: uploadedPaths} = await uploadMultiple(formUpload);
				finalImagePaths = [...existingPaths, ...uploadedPaths];
			}

			if (finalImagePaths.length === 0) {
				toast.error('Cần ít nhất 1 ảnh sản phẩm!', {position: 'top-right'});
				return;
			}
			formUpdate.append('images', JSON.stringify(finalImagePaths));

			const quantityBySize = sizes
				.map((size) => ({
					sizeId: size._id,
					name: size.name,
					quantity: sizeQuantities[size.name] || 0,
				}))
				.filter((item) => item.quantity > 0);

			formUpdate.append('code', form.code);
			formUpdate.append('name', form.name);
			formUpdate.append('quantityBySize', JSON.stringify(quantityBySize));
			formUpdate.append('category', JSON.stringify(form.category));
			formUpdate.append('colors', JSON.stringify(form.colors));
			formUpdate.append('price', form.price);
			formUpdate.append('description', form.description);
			formUpdate.append('detailDescription', detailDescription);
			formUpdate.append('isFeatured', form.isFeatured);
			formUpdate.append('status', form.status);

			const response = await updateProduct(_id, formUpdate);
			if (response.message === 'Cập nhật sản phẩm thành công') {
				toast.success('Cập nhật sản phẩm thành công!', {position: 'top-right'});
				router.push(ROUTES.AdminProduct);
			}
		} catch (error) {
			if (error.response?.data?.errors) {
				setErrors(error.response.data.errors);
			} else {
				toast.error(error.message || 'Vui lòng điền đầy đủ thông tin sản phẩm', {position: 'top-right'});
			}
			console.error('Lỗi cập nhật sản phẩm:', error);
		} finally {
			setLoading(false);
		}
	};

	const parseColors = (colors) => {
		if (!Array.isArray(colors)) return [];
		return colors.map((c) => ({
			value: c.colorId,
			label: c.name,
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
						leftIcon={
							loading ? (
								<span className={styles.spinner}></span>
							) : (
								<Image src={icons.edit} alt='Icon' width={18} height={18} className={styles.icon} />
							)
						}
						className={styles.saveButton}
						onClick={handleUpdateProduct}
						disabled={loading}
					>
						{loading ? 'Đang cập nhật...' : 'Lưu lại'}
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
						Mã code <span style={{color: 'red'}}>*</span>
					</label>
					<input
						type='text'
						id='code'
						name='code'
						className={styles.input}
						placeholder='Mã sản phẩm'
						onChange={handleInputChange}
						value={form.code}
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
				</div>

				{/* Image */}
				<div className={styles.formGroup}>
					<label className={styles.label}>
						Chọn ảnh <span style={{color: 'red'}}>*</span>
					</label>
					<div className={styles.imageUpload}>
						<div className={styles.imagePreviewContainer}>
							{imagesSelected.map((image, index) => (
								<div key={index} className={styles.imagePreview}>
									<Image
										src={image?.url || image?.path}
										alt={`Ảnh ${index + 1}`}
										width={80}
										height={80}
										onError={() => console.error('Lỗi tải ảnh:', imageUrl)}
									/>
									<button type='button' className={styles.removeImageButton} onClick={() => handleDelete(index)}>
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
							{imagesSelected.length < MAX_IMAGES && (
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
