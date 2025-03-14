import React, {useState, useEffect} from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {useRouter} from 'next/router';
import {ROUTES} from '@/constants/config';
import {loginUser} from '@/services/authService';
import styles from './MainLogin.module.scss';
import googleIcon from '../../../../../public/static/icons/google.svg';
import bgImage from '../../../../../public/static/images/auth/login-bg.jpg';
import eyeOpen from '../../../../../public/static/icons/eye_open.svg';
import eyeClose from '../../../../../public/static/icons/eye_close.svg';
import logo from '../../../../../public/static/images/logo_small.svg';
import Loading from '@/components/common/Loading/Loading';

const MainLogin = () => {
	const router = useRouter();
	const [formData, setFormData] = useState({
		email: '',
		password: '',
	});

	const [errors, setErrors] = useState({});
	const [loading, setLoading] = useState(false);
	const [showPassword, setShowPassword] = useState(false);
	const [rememberMe, setRememberMe] = useState(false);

	const handleChange = (e) => {
		const {name, value} = e.target;
		setFormData({
			...formData,
			[name]: value,
		});

		if (errors[name]) {
			setErrors({
				...errors,
				[name]: '',
			});
		}
	};

	const handleBlur = (e) => {
		const {name, value} = e.target;
		if (!value.trim()) {
			setErrors({
				...errors,
				[name]: 'Vui lòng nhập trường này',
			});
		}
	};

	const handleLogin = async (e) => {
		e.preventDefault();
		setLoading(true);
		setErrors({});

		try {
			const response = await loginUser(formData.email, formData.password);

			const {id, name, email, role} = response.data; // Get data user API
			const token = response.token;
			localStorage.setItem('token', token);
			localStorage.setItem('name', name);

			if (rememberMe) {
				const expirationTime = new Date().getTime() + 30 * 24 * 60 * 60 * 1000;
				localStorage.setItem('email', email);
				// localStorage.setItem('password', formData.password);
				localStorage.setItem('remember_expiration', expirationTime);
			}

			if (role === 1) {
				router.push(ROUTES.Home);
			} else if (role === 0) {
				router.push(ROUTES.AdminDashboard);
			} else {
				setErrors({general: 'Vai trò không hợp lệ'});
			}
		} catch (error) {
			setErrors({general: error.message || 'Đăng nhập thất bại'});
		} finally {
			setTimeout(() => {
				setLoading(false);
			}, 4000);
		}
	};

	const handleRememberMeChange = () => {
		setRememberMe((prev) => !prev);
	};

	useEffect(() => {
		const savedEmail = localStorage.getItem('email');
		// const savedPassword = localStorage.getItem('password');
		const expirationTime = localStorage.getItem('remember_expiration');

		if (savedEmail && expirationTime) {
			const currentTime = new Date().getTime();

			if (currentTime < expirationTime) {
				setFormData({
					email: savedEmail,
					// password: savedPassword,
				});
				setRememberMe(true);
			} else {
				// Thời gian hết hạn, xoá dữ liệu cũ
				localStorage.removeItem('email');
				// localStorage.removeItem('password');
				localStorage.removeItem('remember_expiration');
			}
		}
	}, []);

	return (
		<div className={styles.container}>
			{loading && <Loading fullScreen />}

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

					<form className={styles.formGroup} onSubmit={handleLogin}>
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

						<div className={styles.actions}>
							<button type='submit' className={styles.btnLogin} disabled={loading}>
								Đăng nhập
							</button>
						</div>
					</form>
					{errors.general && <p className={styles.errorMsg}>{errors.general}</p>}

					<div className={styles.contentWrapper}>
						<input
							type='checkbox'
							className={styles.formCheckbox}
							id='remember'
							checked={rememberMe}
							onChange={handleRememberMeChange}
						/>
						<label htmlFor='remember' className={styles.formText}>
							Ghi nhớ trong 30 ngày
						</label>
						<Link href={ROUTES.forgot_password} className={styles.formForgot}>
							Quên mật khẩu
						</Link>
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
