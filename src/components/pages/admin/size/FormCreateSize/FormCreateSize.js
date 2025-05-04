import React, {useState} from 'react';
import styles from './FormCreateSize.module.scss';
import Button from '@/components/common/Button/Button';
import Image from 'next/image';
import icons from '@/constants/static/icons';
import {toast} from 'react-toastify';
import {createSize} from '@/services/sizeService';

const FormCreateSize = ({onCancel, onSuccess}) => {
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

	const handleSubmit = async () => {
		if (!formData.name.trim()) {
			setError('Vui lòng nhập tên kích cỡ');
			return;
		}

		setError('');
		setLoading(true);

		try {
			await createSize(formData);
			toast.success('Thêm kích cỡ thành công');
			onSuccess();
		} catch (err) {
			toast.error(err.message || 'Thêm kích cỡ thất bại');
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className={styles.container}>
			<h2 className={styles.title}>Thêm mới kích cỡ sản phẩm</h2>

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

export default FormCreateSize;
