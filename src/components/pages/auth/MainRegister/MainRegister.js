import React, {useState, useEffect} from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {ROUTES} from '@/constants/config';

import styles from './MainRegister.module.scss';
import eyeOpen from '../../../../../public/static/icons/eye_open.svg';
import eyeClose from '../../../../../public/static/icons/eye_close.svg';
import logo from '../../../../../public/static/images/logo_small.svg';

const MainRegister = () => {
	const [formData, setFormData] = useState({
		fullName: '',
		phone: '',
		email: '',
		birthDate: '',
		gender: '',
		password: '',
		confirmPassword: '',
	});

	const [errors, setErrors] = useState({});
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);
	const [isFormValid, setIsFormValid] = useState(false);

	// Xử lý sự kiện khi người dùng nhập dữ liệu
	const handleChange = (e) => {
		const {name, value} = e.target;
		setFormData({
			...formData,
			[name]: value,
		});

		// Nếu người dùng nhập thì xóa lỗi
		if (errors[name]) {
			setErrors({
				...errors,
				[name]: '',
			});
		}
	};

	// validate blur
	const handleBlur = (e) => {
		const {name, value} = e.target;
		let errorMsg = '';

		if (!value.trim()) {
			errorMsg = 'Vui lòng nhập trường này';
		} else {
			if (name === 'email') {
				const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
				if (!emailRegex.test(value)) {
					errorMsg = 'Email không hợp lệ';
				}
			} else if (name === 'phone') {
				const phoneRegex = /^[0-9]{10}$/;
				if (!phoneRegex.test(value)) {
					errorMsg = 'Số điện thoại không hợp lệ';
				}
			} else if (name === 'password') {
				if (value.length < 6) {
					errorMsg = 'Mật khẩu phải có ít nhất 6 ký tự';
				}
			} else if (name === 'confirmPassword') {
				if (value !== formData.password) {
					errorMsg = 'Mật khẩu xác nhận không khớp';
				}
			}
		}

		setErrors({
			...errors,
			[name]: errorMsg,
		});
	};

	useEffect(() => {
		const isValid = Object.values(formData).every((val) => val.trim() !== '') && Object.values(errors).every((err) => err === '');
		setIsFormValid(isValid);
	}, [formData, errors]);

	return (
		<div className={styles.container}>
			<div className={styles.registerWrapper}>
				<div className={styles.registerContent}>
					<Link href={ROUTES.Home} className={styles.logo}>
						<Image src={logo} alt='Logo' width={50} height={50} />
					</Link>

					<h2 className={styles.registerTitle}>Tạo tài khoản mới</h2>
					<p className={styles.registerLabel}>Đăng ký ngay để tham gia hệ thống đặt mua quần áo trực tuyến của chúng tôi!</p>

					<form className={styles.formGroup}>
						{/* Họ và Tên */}
						<div className={styles.inputWrapper}>
							<input
								type='text'
								name='fullName'
								className={`${styles.formInput} ${styles.fullWidth}`}
								placeholder='Họ và Tên'
								value={formData.fullName}
								onChange={handleChange}
								onBlur={handleBlur}
							/>
							{errors.fullName && <span className={styles.errorMsg}>{errors.fullName}</span>}
						</div>

						{/* Email & Số điện thoại  */}
						<div className={styles.formRow}>
							<div className={styles.inputWrapper}>
								<input
									type='email'
									name='email'
									className={styles.formInput}
									placeholder='Email'
									value={formData.email}
									onChange={handleChange}
									onBlur={handleBlur}
								/>
								{errors.email && <span className={styles.errorMsg}>{errors.email}</span>}
							</div>

							<div className={styles.inputWrapper}>
								<input
									type='text'
									name='phone'
									className={styles.formInput}
									placeholder='Số điện thoại'
									value={formData.phone}
									onChange={handleChange}
									onBlur={handleBlur}
								/>
								{errors.phone && <span className={styles.errorMsg}>{errors.phone}</span>}
							</div>
						</div>

						{/* Ngày sinh & Giới tính */}
						<div className={styles.formRow}>
							<div className={styles.inputWrapper}>
								<input
									type='date'
									name='birthDate'
									className={styles.formInput}
									value={formData.birthDate}
									onChange={handleChange}
									onBlur={handleBlur}
								/>
								{errors.birthDate && <span className={styles.errorMsg}>{errors.birthDate}</span>}
							</div>

							<div className={styles.inputWrapper}>
								<select
									name='gender'
									className={styles.formInput}
									value={formData.gender}
									onChange={handleChange}
									onBlur={handleBlur}
								>
									<option value=''>Giới tính</option>
									<option value='male'>Nam</option>
									<option value='female'>Nữ</option>
									<option value='other'>Khác</option>
								</select>
								{errors.gender && <span className={styles.errorMsg}>{errors.gender}</span>}
							</div>
						</div>

						{/* Mật khẩu & Xác nhận mật khẩu */}
						<div className={styles.formRow}>
							<div className={styles.inputWrapper}>
								<input
									type={showPassword ? 'text' : 'password'}
									name='password'
									className={styles.formInput}
									placeholder='Mật khẩu'
									value={formData.password}
									onChange={handleChange}
									onBlur={handleBlur}
								/>
								<span className={styles.inputToggle}>
									<Image
										src={showPassword ? eyeOpen : eyeClose}
										alt='Toggle Password'
										className={styles.eyeIcon}
										onClick={() => setShowPassword(!showPassword)}
										width={20}
										height={20}
									/>
								</span>
								{errors.password && <span className={styles.errorMsg}>{errors.password}</span>}
							</div>

							<div className={styles.inputWrapper}>
								<input
									type={showConfirmPassword ? 'text' : 'password'}
									name='confirmPassword'
									className={styles.formInput}
									placeholder='Xác nhận mật khẩu'
									value={formData.confirmPassword}
									onChange={handleChange}
									onBlur={handleBlur}
								/>
								<span className={styles.inputToggle}>
									<Image
										src={showConfirmPassword ? eyeOpen : eyeClose}
										alt='Toggle Confirm Password'
										className={styles.eyeIcon}
										onClick={() => setShowConfirmPassword(!showConfirmPassword)}
										width={20}
										height={20}
									/>
								</span>
								{errors.confirmPassword && <span className={styles.errorMsg}>{errors.confirmPassword}</span>}
							</div>
						</div>
					</form>

					<div className={styles.actions}>
						<button className={styles.btnRegister} disabled={!isFormValid}>
							Đăng ký
						</button>
					</div>

					<div className={styles.registerAccount}>
						<span className={styles.registerNot}>Bạn đã có tài khoản?</span>
						<Link href={ROUTES.Login} className={styles.registerFree}>
							Đăng nhập ngay
						</Link>
					</div>
				</div>
			</div>
		</div>
	);
};

export default MainRegister;
