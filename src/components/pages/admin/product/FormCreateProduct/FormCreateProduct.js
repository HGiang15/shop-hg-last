import React, {useState} from 'react';
import styles from './FormCreateProduct.module.scss';
import Button from '@/components/common/Button/Button';
import Image from 'next/image';
import icons from '@/constants/static/icons';
import {useRouter} from 'next/router';
import images from '@/constants/static/images';

import dynamic from 'next/dynamic';
const JoditEditor = dynamic(() => import('jodit-react'), {ssr: false});

const FormCreateProduct = () => {
	const router = useRouter();

	const [selectedImages, setSelectedImages] = useState([]);
	const [detailDesc, setDetailDesc] = useState('');
	const MAX_IMAGES = 6;

	const handleImageChange = (event) => {
		const files = event.target.files;
		if (files && files.length > 0) {
			const newImages = Array.from(files)
				.slice(0, Math.max(0, MAX_IMAGES - selectedImages.length))
				.map((file) => URL.createObjectURL(file));

			setSelectedImages((prevImages) => {
				const combinedImages = [...prevImages, ...newImages];
				return combinedImages.slice(0, MAX_IMAGES);
			});
		}
	};

	const handleRemoveImage = (index) => {
		setSelectedImages((prevImages) => {
			const newImages = [...prevImages];
			newImages.splice(index, 1);
			return newImages;
		});
	};

	const handleMoTaChiTietChange = (content) => {
		setDetailDesc(content);
	};

	return (
		<div className={styles.container}>
			<div className={styles.header}>
				<div className={styles.wrapper}>
					<h2 className={styles.title}>Thêm sản phẩm</h2>
					<p className={styles.description}>Điền đầy đủ các thông tin sản phẩm</p>
				</div>

				<div className={styles.buttonGroup}>
					<Button className={styles.cancelButton} onClick={() => router.back()}>
						Hủy bỏ
					</Button>
					<Button
						leftIcon={<Image src={icons.edit} alt='Icon' width={18} height={18} className={styles.icon} />}
						className={styles.saveButton}
					>
						Lưu lại
					</Button>
				</div>
			</div>

			<form className={styles.formGrid}>
				{/* Name */}
				<div className={styles.formGroup}>
					<label htmlFor='tenSanPham' className={styles.label}>
						Tên sản phẩm <span style={{color: 'red'}}>*</span>
					</label>
					<input type='text' id='tenSanPham' className={styles.input} placeholder='Tên sản phẩm' />
				</div>

				{/* ID */}
				<div className={styles.formGroup}>
					<label htmlFor='maSanPham' className={styles.label}>
						Mã sản phẩm <span style={{color: 'red'}}>*</span>
					</label>
					<input type='text' id='maSanPham' className={styles.input} placeholder='Mã sản phẩm' />
				</div>

				{/* Type */}
				<div className={styles.formGroup}>
					<label htmlFor='loaiSanPham' className={styles.label}>
						Loại sản phẩm <span style={{color: 'red'}}>*</span>
					</label>
					<select id='loaiSanPham' className={styles.select}>
						<option value=''>Chọn loại sản phẩm</option>
					</select>
				</div>

				{/* Color */}
				<div className={styles.formGroup}>
					<label htmlFor='mauSanPham' className={styles.label}>
						Màu sản phẩm <span style={{color: 'red'}}>*</span>
					</label>
					<select id='mauSanPham' className={styles.select}>
						<option value=''>Chọn màu sản phẩm</option>
					</select>
				</div>

				{/* Price */}
				<div className={styles.formGroup}>
					<label htmlFor='gia' className={styles.label}>
						Giá <span style={{color: 'red'}}>*</span>
					</label>
					<div className={styles.priceInput}>
						<input type='number' id='gia' className={styles.input} placeholder='100.000' />
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
							{selectedImages.map((imageUrl, index) => (
								<div key={index} className={styles.imagePreview}>
									<Image src={imageUrl} alt={`Ảnh ${index + 1}`} width={80} height={80} objectFit='cover' />
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
					<input type='number' id='sizeS' className={styles.input} placeholder='0' />
				</div>

				{/* M */}
				<div className={styles.formGroup}>
					<label htmlFor='sizeM' className={styles.label}>
						Nhập số lượng size M <span style={{color: 'red'}}>*</span>
					</label>
					<input type='number' id='sizeM' className={styles.input} placeholder='0' />
				</div>

				{/* L */}
				<div className={styles.formGroup}>
					<label htmlFor='sizeL' className={styles.label}>
						Nhập số lượng size L <span style={{color: 'red'}}>*</span>
					</label>
					<input type='number' id='sizeL' className={styles.input} placeholder='0' />
				</div>

				{/* XL */}
				<div className={styles.formGroup}>
					<label htmlFor='sizeXL' className={styles.label}>
						Nhập số lượng size XL <span style={{color: 'red'}}>*</span>
					</label>
					<input type='number' id='sizeXL' className={styles.input} placeholder='0' />
				</div>

				{/* XXL */}
				<div className={styles.formGroup}>
					<label htmlFor='sizeXXL' className={styles.label}>
						Nhập số lượng size XXL <span style={{color: 'red'}}>*</span>
					</label>
					<input type='number' id='sizeXXL' className={styles.input} placeholder='0' />
				</div>

				{/* Description */}
				<div className={styles.formGroup}>
					<label htmlFor='moTaChinh' className={styles.label}>
						Mô tả chính
					</label>
					<textarea id='moTaChinh' className={styles.textarea} placeholder='Nhập mô tả chi tiết' rows={4} />
				</div>

				{/* Description all */}
				<div className={styles.formGroup}>
					<label htmlFor='detailDesc' className={styles.label}>
						Mô tả chi tiết
					</label>
					<JoditEditor
						value={detailDesc}
						config={{
							readonly: false,
							toolbar: true,
							spellcheck: true,
							language: 'en',
							placeholder: 'Nhập mô tả chi tiết sản phẩm...',
						}}
						tabIndex={1}
						onBlur={(newContent) => handleMoTaChiTietChange(newContent)} // preferred to onChange if performance is a concern
						onChange={(newContent) => {}}
					/>
				</div>
			</form>
		</div>
	);
};

export default FormCreateProduct;
