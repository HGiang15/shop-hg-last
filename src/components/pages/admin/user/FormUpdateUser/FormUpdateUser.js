import React, {useEffect, useState} from 'react';
import styles from './FormUpdateUser.module.scss';
import {getUserById, updateUser} from '@/services/authService';
import {toast} from 'react-toastify';
import Button from '@/components/common/Button/Button';
import Image from 'next/image';
import icons from '@/constants/static/icons';

const FormUpdateUser = ({userId, onCancel, onSuccess}) => {
	const [formData, setFormData] = useState({
		name: '',
		email: '',
		phone: '',
		dateOfBirth: '',
		gender: 'Male',
	});

	useEffect(() => {
		const fetchUser = async () => {
			try {
				const data = await getUserById(userId);
				setFormData({
					name: data.name || '',
					email: data.email || '',
					phone: data.phone || '',
					dateOfBirth: data.dateOfBirth?.split('T')[0] || '',
					gender: data.gender || 'Male',
				});
			} catch (err) {
				console.error('Lỗi khi tải dữ liệu người dùng', err);
			}
		};
		fetchUser();
	}, [userId]);

	const handleChange = (e) => {
		const {name, value} = e.target;
		setFormData((prev) => ({...prev, [name]: value}));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			await updateUser(userId, formData);
			toast.success('Cập nhật người dùng thành công!');
			if (onSuccess) onSuccess();
		} catch (err) {
			toast.error(err.message || 'Cập nhật thất bại');
		}
	};

	return (
		<form className={styles.formUpdateUser} onSubmit={handleSubmit}>
			<h2>Chỉnh sửa người dùng</h2>

			<label>
				Họ và tên<span>*</span>
			</label>
			<input type='text' name='name' value={formData.name} onChange={handleChange} required />

			<label>
				Email<span>*</span>
			</label>
			<input type='email' name='email' value={formData.email} onChange={handleChange} required disabled />

			<label>
				Số điện thoại<span>*</span>
			</label>
			<input type='text' name='phone' value={formData.phone} onChange={handleChange} required />

			<label>
				Ngày sinh<span>*</span>
			</label>
			<input type='date' name='dateOfBirth' value={formData.dateOfBirth} onChange={handleChange} required />

			<label>
				Giới tính<span>*</span>
			</label>
			<div className={styles.genderGroup}>
				{['Male', 'Female', 'Other'].map((genderLabel) => (
					<label key={genderLabel}>
						<input
							type='radio'
							name='gender'
							value={genderLabel}
							checked={formData.gender === genderLabel}
							onChange={handleChange}
						/>
						{genderLabel === 'Male' ? 'Nam' : genderLabel === 'Female' ? 'Nữ' : 'Khác'}
					</label>
				))}
			</div>

			<div className={styles.formButtons}>
				<Button type='button' className={styles.btnCancel} onClick={onCancel}>
					Hủy bỏ
				</Button>
				<Button
					leftIcon={<Image src={icons.folderOpen} alt='Icon' width={20} height={20} />}
					type='submit'
					className={styles.btnSubmit}
				>
					Cập nhật
				</Button>
			</div>
		</form>
	);
};

export default FormUpdateUser;
