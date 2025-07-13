import React, {useState, useEffect} from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {useRouter} from 'next/router';
import {ROUTES} from '@/constants/config';
import {loginUser, loginWithGoogle} from '@/services/authService';
import styles from './MainLogin.module.scss';
import icons from '@/constants/static/icons';
import images from '@/constants/static/images';
import Loading from '@/components/common/Loading/Loading';
import Button from '@/components/common/Button/Button';
import {toast, ToastContainer} from 'react-toastify';
import {GoogleLogin} from '@react-oauth/google';
import {mergeCart} from '@/services/cartService';
import useCart from '@/hooks/useCart';
import {useDispatch} from 'react-redux';
import {loginSuccess} from '@/redux/slices/authSlice';
import {setUserInfo} from '@/redux/slices/userSlice';

const MainLogin = () => {
	const router = useRouter();
	const {syncCartAfterLogin} = useCart();
	const reduxDispatch = useDispatch();

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
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));

		if (errors[name]) {
			setErrors((prev) => ({
				...prev,
				[name]: '',
			}));
		}
	};

	const handleBlur = (e) => {
		const {name, value} = e.target;
		if (!value.trim()) {
			setErrors((prev) => ({
				...prev,
				[name]: 'Vui lòng nhập trường này',
			}));
		}
	};

	const handleLogin = async (e) => {
		e.preventDefault();
		setLoading(true);
		setErrors({});

		try {
			const response = await loginUser(formData.email, formData.password);
			const {id, name, email, avatar, role} = response.data;
			const token = response.token;

			localStorage.setItem('token', token);
			localStorage.setItem('name', name);
			localStorage.setItem('avatar', avatar);

			reduxDispatch(loginSuccess(token));
			reduxDispatch(setUserInfo({id, name, email, avatar, role}));

			if (rememberMe) {
				const expirationTime = new Date().getTime() + 30 * 24 * 60 * 60 * 1000;
				localStorage.setItem('email', formData.email);
				localStorage.setItem('remember_expiration', expirationTime);
			} else {
				localStorage.removeItem('email');
				localStorage.removeItem('remember_expiration');
			}

			const mergeResponse = await mergeCart();
			await syncCartAfterLogin();

			toast.success('Đăng nhập thành công!');
			router.push(role === 0 ? ROUTES.AdminDashboard : ROUTES.Home);
		} catch (error) {
			toast.error(error.message || 'Đăng nhập thất bại.');
		} finally {
			setLoading(false);
		}
	};

	const handleRememberMeChange = () => {
		setRememberMe((prev) => !prev);
	};

	useEffect(() => {
		const savedEmail = localStorage.getItem('email');
		const expirationTime = localStorage.getItem('remember_expiration');

		if (savedEmail && expirationTime) {
			const currentTime = new Date().getTime();
			if (currentTime < expirationTime) {
				setFormData((prev) => ({
					...prev,
					email: savedEmail,
				}));
				setRememberMe(true);
			} else {
				localStorage.removeItem('email');
				localStorage.removeItem('remember_expiration');
			}
		}
	}, []);

	return (
		<div className={styles.container}>
			{loading && <Loading fullScreen />}
			<ToastContainer />
			<div className={styles.loginWrapper}>
				<div className={styles.loginContent}>
					<Link href={ROUTES.Home} className={styles.logo}>
						<Image src={icons.logoSmall} alt='Logo' width={50} height={50} />
					</Link>

					<h2 className={styles.loginTitle}>Đăng nhập tài khoản</h2>
					<p className={styles.loginLabel}>
						Chào mừng bạn đến với hệ thống đặt mua quần áo trực tuyến. Đăng nhập để bắt đầu sử dụng!
					</p>

					<form className={styles.formGroup} onSubmit={handleLogin}>
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
								src={showPassword ? icons.eyeOpen : icons.eyeClose}
								alt='Toggle password visibility'
								onClick={() => setShowPassword((prev) => !prev)}
								className={styles.eyeIcon}
							/>
						</div>
						{errors.password && <span className={styles.errorMsg}>{errors.password}</span>}

						<div className={styles.actions}>
							<Button type='submit' className={styles.btnLogin} disabled={loading}>
								Đăng nhập
							</Button>
						</div>

						<GoogleLogin
							onSuccess={async (credentialResponse) => {
								try {
									setLoading(true);
									const {credential} = credentialResponse;
									const {token, data} = await loginWithGoogle(credential);

									localStorage.setItem('token', token);
									localStorage.setItem('name', data.name);
									localStorage.setItem('avatar', data.avatar);
									reduxDispatch(loginSuccess(token));
									reduxDispatch(setUserInfo(data));

									await mergeCart();

									await syncCartAfterLogin();

									toast.success('Đăng nhập bằng Google thành công!');
									router.push(data.role === 0 ? ROUTES.AdminDashboard : ROUTES.Home);
								} catch (err) {
									console.error('Google login error:', err);
									toast.error('Lỗi khi đăng nhập với Google');
								} finally {
									setLoading(false);
								}
							}}
							onError={() => toast.error('Đăng nhập bằng Google thất bại')}
							width='100%'
						/>
					</form>

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
					<Image src={images.bgLogin} alt='Login Background' layout='fill' objectFit='cover' className={styles.loginMedia} />
				</div>
			</div>
		</div>
	);
};

export default MainLogin;
