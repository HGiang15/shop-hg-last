import React, {useEffect, useState} from 'react';
import styles from './FormUpdateUser.module.scss'; // Import CSS module
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
		role: 1, // Added role
		verified: true, // Added verified
		status: 1, // Added status
	});
	const [loading, setLoading] = useState(false);
	const [message, setMessage] = useState('');
	const [isError, setIsError] = useState(false);

	useEffect(() => {
		const fetchUser = async () => {
			if (!userId) return; // Ensure userId exists before fetching
			setLoading(true);
			try {
				const data = await getUserById(userId);
				setFormData({
					name: data.name || '',
					email: data.email || '',
					phone: data.phone || '',
					// Format dateOfBirth to YYYY-MM-DD for input type="date"
					dateOfBirth: data.dateOfBirth ? data.dateOfBirth.split('T')[0] : '',
					gender: data.gender || 'Male',
					role: data.role !== undefined ? data.role : 1, // Set default if undefined
					verified: data.verified !== undefined ? data.verified : true, // Set default if undefined
					status: data.status !== undefined ? data.status : 1, // Set default if undefined
				});
				setMessage('');
				setIsError(false);
			} catch (err) {
				console.error('Lỗi khi tải dữ liệu người dùng', err);
				setMessage('Lỗi khi tải dữ liệu người dùng.');
				setIsError(true);
			} finally {
				setLoading(false);
			}
		};
		fetchUser();
	}, [userId]);

	const handleChange = (e) => {
		const {name, value, type, checked} = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: type === 'checkbox' ? checked : value,
		}));
	};

	const validateForm = () => {
		const {name, email, phone, dateOfBirth, gender, role} = formData;

		if (!name || !email) {
			// Email is disabled, but still need name
			setMessage('Vui lòng không để trống tên và email.');
			setIsError(true);
			return false;
		}

		if (phone && !/^\d{10,15}$/.test(phone)) {
			setMessage('Số điện thoại không hợp lệ (10-15 chữ số).');
			setIsError(true);
			return false;
		}

		if (dateOfBirth && !new Date(dateOfBirth).getTime()) {
			setMessage('Ngày sinh không hợp lệ.');
			setIsError(true);
			return false;
		}

		if (gender && !['Male', 'Female', 'Other'].includes(gender)) {
			setMessage('Giới tính không hợp lệ. Chọn Nam, Nữ hoặc Khác.');
			setIsError(true);
			return false;
		}

		if (Number(role) !== 0 && Number(role) !== 1) {
			setMessage('Vai trò không hợp lệ. Chỉ chấp nhận 0 (Quản trị) hoặc 1 (Người dùng).');
			setIsError(true);
			return false;
		}

		setMessage('');
		setIsError(false);
		return true;
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setMessage('');
		setIsError(false);

		if (!validateForm()) {
			return;
		}

		setLoading(true);
		try {
			const dataToSend = {
				...formData,
				role: Number(formData.role),
				verified: Boolean(formData.verified),
				status: Number(formData.status),
			};
			// Note: email and password are intentionally not sent from this admin update form
			delete dataToSend.email; // Email is disabled, should not be updated via this form

			await updateUser(userId, dataToSend);
			toast.success('Cập nhật người dùng thành công!');
			if (onSuccess) onSuccess();
		} catch (err) {
			console.error('Lỗi khi cập nhật người dùng:', err);
			setMessage(err.message || 'Cập nhật thất bại');
			setIsError(true);
		} finally {
			setLoading(false);
		}
	};

	if (loading) {
		return <div className={styles.loadingMessage}>Đang tải dữ liệu người dùng...</div>;
	}

	if (isError && !loading) {
		return <div className={styles.errorMessage}>{message}</div>;
	}

	return (
		<form className={styles.formUpdateUser} onSubmit={handleSubmit}>
			<h2 className={styles.formTitle}>Chỉnh sửa người dùng</h2>

			{message && <div className={`${styles.messageBox} ${isError ? styles.errorMessage : styles.successMessage}`}>{message}</div>}

			<label className={styles.label}>
				Họ và tên<span className={styles.required}>*</span>
			</label>
			<input type='text' name='name' value={formData.name} onChange={handleChange} className={styles.inputField} required />

			<label className={styles.label}>
				Email<span className={styles.required}>*</span>
			</label>
			{/* Email is disabled as per your original `editUser` API, which explicitly deletes `updates.email` */}
			<input
				type='email'
				name='email'
				value={formData.email}
				onChange={handleChange}
				className={styles.inputField}
				required
				disabled
			/>

			<label className={styles.label}>
				Số điện thoại<span className={styles.required}>*</span>
			</label>
			<input type='text' name='phone' value={formData.phone} onChange={handleChange} className={styles.inputField} required />

			<label className={styles.label}>
				Ngày sinh<span className={styles.required}>*</span>
			</label>
			<input
				type='date'
				name='dateOfBirth'
				value={formData.dateOfBirth}
				onChange={handleChange}
				className={styles.inputField}
				required
			/>

			<label className={styles.label}>
				Giới tính<span className={styles.required}>*</span>
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
							className={styles.radioInput}
						/>
						{genderLabel === 'Male' ? 'Nam' : genderLabel === 'Female' ? 'Nữ' : 'Khác'}
					</label>
				))}
			</div>

			<label className={styles.label}>
				Vai trò<span className={styles.required}>*</span>
			</label>
			<select name='role' value={formData.role} onChange={handleChange} className={styles.inputField} required>
				<option value={1}>Người dùng</option>
				<option value={0}>Quản trị</option>
			</select>

			<div className={styles.checkboxContainer}>
				<label className={styles.checkboxLabel}>
					<input
						type='checkbox'
						name='verified'
						checked={formData.verified}
						onChange={handleChange}
						className={styles.checkboxInput}
						disabled
					/>
					Đã xác minh
				</label>
				<label className={styles.checkboxLabel}>
					<input
						type='checkbox'
						name='status'
						checked={formData.status === 1}
						onChange={(e) => setFormData((prev) => ({...prev, status: e.target.checked ? 1 : 0}))}
						className={styles.checkboxInput}
					/>
					Hoạt động
				</label>
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
