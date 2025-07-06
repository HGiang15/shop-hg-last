import React, {useState} from 'react';
import styles from './FormCreateUser.module.scss';
import {createUserByAdmin} from '@/services/authService';
import Button from '@/components/common/Button/Button';

const FormCreateUser = ({onCancel, onSuccess}) => {
	const [formData, setFormData] = useState({
		name: '',
		email: '',
		phone: '',
		dateOfBirth: '',
		gender: 'Male',
		password: '',
		role: 1,
		verified: true,
		status: 1,
	});

	const [loading, setLoading] = useState(false);
	const [message, setMessage] = useState('');
	const [isError, setIsError] = useState(false);

	const handleChange = (e) => {
		const {name, value, type, checked} = e.target;
		setFormData((prevData) => ({
			...prevData,
			[name]: type === 'checkbox' ? checked : value,
		}));
	};

	const validateForm = () => {
		const {name, email, password, phone, dateOfBirth, gender, role} = formData;

		if (!name || !email || !password) {
			setMessage('Vui lòng không để trống tên, email và mật khẩu.');
			setIsError(true);
			return false;
		}

		if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
			setMessage('Email không hợp lệ.');
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

		if (password.length < 6) {
			setMessage('Mật khẩu quá ngắn, ít nhất 6 ký tự.');
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

			const response = await createUserByAdmin(dataToSend);
			setMessage(response.message || 'Người dùng đã được tạo thành công!');
			setIsError(false);

			if (onSuccess) {
				onSuccess();
			}

			setFormData({
				name: '',
				email: '',
				phone: '',
				dateOfBirth: '',
				gender: 'Male',
				password: '',
				role: 1,
				verified: true,
				status: 1,
			});
		} catch (error) {
			console.error('Lỗi khi tạo người dùng:', error);
			setMessage(error.message || 'Lỗi khi tạo người dùng. Vui lòng thử lại.');
			setIsError(true);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className={styles.container}>
			<div className={styles.formCard}>
				<h2 className={styles.formTitle}>Tạo Người Dùng Mới</h2>

				{message && (
					<div className={`${styles.messageBox} ${isError ? styles.errorMessage : styles.successMessage}`}>{message}</div>
				)}

				<form onSubmit={handleSubmit} className={styles.formGrid}>
					<div>
						<label htmlFor='name' className={styles.label}>
							Tên Người Dùng
						</label>
						<input
							type='text'
							id='name'
							name='name'
							value={formData.name}
							onChange={handleChange}
							className={styles.inputField}
							placeholder='Nhập tên người dùng'
							required
						/>
					</div>

					<div>
						<label htmlFor='email' className={styles.label}>
							Email
						</label>
						<input
							type='email'
							id='email'
							name='email'
							value={formData.email}
							onChange={handleChange}
							className={styles.inputField}
							placeholder='Nhập email'
							required
						/>
					</div>

					<div>
						<label htmlFor='password' className={styles.label}>
							Mật khẩu
						</label>
						<input
							type='password'
							id='password'
							name='password'
							value={formData.password}
							onChange={handleChange}
							className={styles.inputField}
							placeholder='Nhập mật khẩu (ít nhất 6 ký tự)'
							required
						/>
					</div>

					<div>
						<label htmlFor='phone' className={styles.label}>
							Số Điện Thoại (Tùy chọn)
						</label>
						<input
							type='tel'
							id='phone'
							name='phone'
							value={formData.phone}
							onChange={handleChange}
							className={styles.inputField}
							placeholder='Nhập số điện thoại'
						/>
					</div>

					<div>
						<label htmlFor='dateOfBirth' className={styles.label}>
							Ngày Sinh (Tùy chọn)
						</label>
						<input
							type='date'
							id='dateOfBirth'
							name='dateOfBirth'
							value={formData.dateOfBirth}
							onChange={handleChange}
							className={styles.inputField}
						/>
					</div>

					<div>
						<label htmlFor='gender' className={styles.label}>
							Giới Tính (Tùy chọn)
						</label>
						<select id='gender' name='gender' value={formData.gender} onChange={handleChange} className={styles.inputField}>
							<option value='Male'>Nam</option>
							<option value='Female'>Nữ</option>
							<option value='Other'>Khác</option>
						</select>
					</div>

					<div>
						<label htmlFor='role' className={styles.label}>
							Vai Trò
						</label>
						<select id='role' name='role' value={formData.role} onChange={handleChange} className={styles.inputField}>
							<option value={1}>Người dùng</option>
							<option value={0}>Quản trị</option>
						</select>
					</div>

					<div className={styles.checkboxContainer}>
						<label htmlFor='verified' className={styles.checkboxLabel}>
							<input
								type='checkbox'
								id='verified'
								name='verified'
								checked={formData.verified}
								onChange={handleChange}
								className={styles.checkboxInput}
								disabled
							/>
							Đã xác minh
						</label>
						<label htmlFor='status' className={styles.checkboxLabel}>
							<input
								type='checkbox'
								id='status'
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
							type='submit'
							disabled={loading}
							className={`${styles.submitButton} ${loading ? styles.submitButtonLoading : styles.submitButtonActive}`}
						>
							{loading ? 'Đang tạo...' : 'Tạo Người Dùng'}
						</Button>
					</div>
				</form>
			</div>
		</div>
	);
};

export default FormCreateUser;
