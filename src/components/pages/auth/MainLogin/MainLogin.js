import React, {useState} from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {ROUTES} from '@/constants/config';
import styles from './MainLogin.module.scss';
import googleIcon from '../../../../../public/static/icons/google.svg';
import bgImage from '../../../../../public/static/images/auth/login-bg.jpg';
import eyeOpen from '../../../../../public/static/icons/eye_open.svg';
import eyeClose from '../../../../../public/static/icons/eye_close.svg';
import logo from '../../../../../public/static/images/logo_small.svg';

const MainLogin = () => {
	const [formData, setFormData] = useState({
		email: '',
		password: '',
	});

	const [errors, setErrors] = useState({});
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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
		if (!value.trim()) {
			setErrors({
				...errors,
				[name]: 'Vui lòng nhập trường này',
			});
		}
	};

	return (
		<div className={styles.container}>
			<div className={styles.loginWrapper}>
				<div className={styles.loginContent}>
					<Link href={ROUTES.Home} className={styles.logo}>
						<Image src={logo} alt='Logo' width={50} height={50} />
					</Link>

					<h2 className={styles.loginTitle}>Đăng nhập tài khoản</h2>
					<p className={styles.loginLabel}>
						Chào mừng bạn đến với hệ thống đặt mua quần áo trực tuyến. Đăng nhập để bắt đầu sử dụng!
					</p>

					<button className={styles.loginAction}>
						<Image src={googleIcon} alt='Google' width={24} height={24} className={styles.loginImg} />
						<span className={styles.loginDesc}>Đăng nhập với Google</span>
					</button>

					<form className={styles.formGroup}>
						{/* Email */}
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
						</div>
						{errors.email && <span className={styles.errorMsg}>{errors.email}</span>}

						{/* Password */}
						<div className={styles.inputWrapper}>
							<input
								type={showPassword ? 'text' : 'password'}
								name='password'
								value={formData.password}
								onChange={handleChange}
								onBlur={handleBlur}
								className={styles.formInput}
								placeholder='Password'
							/>
							<Image
								src={showPassword ? eyeOpen : eyeClose}
								alt='Toggle password visibility'
								onClick={() => setShowPassword((prev) => !prev)}
								className={styles.eyeIcon}
							/>
						</div>
						{errors.password && <span className={styles.errorMsg}>{errors.password}</span>}
					</form>

					<div className={styles.contentWrapper}>
						<input type='checkbox' className={styles.formCheckbox} id='remember' />
						<label htmlFor='remember' className={styles.formText}>
							Ghi nhớ trong 30 ngày
						</label>
						<a href={ROUTES.forgot_password} className={styles.formForgot}>
							Quên mật khẩu
						</a>
					</div>

					<div className={styles.actions}>
						<button className={styles.btnLogin}>Đăng nhập</button>
					</div>

					<div className={styles.loginAccount}>
						<span className={styles.loginNot}>Bạn chưa có tài khoản?</span>
						<Link href={ROUTES.Register} className={styles.loginFree}>
							Đăng ký tại đây
						</Link>
					</div>
				</div>
				<div className={styles.media}>
					<Image src={bgImage} alt='Login Background' layout='fill' objectFit='cover' className={styles.loginMedia} />
				</div>
			</div>
		</div>
	);
};

export default MainLogin;
