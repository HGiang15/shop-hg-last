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
import jwt_decode from 'jwt-decode';
import {addToCart, getAllCart, mergeCart} from '@/services/cartService';
import useCart from '@/hooks/useCart';

const MainLogin = () => {
	const router = useRouter();
	const {dispatch} = useCart();

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
			const {id, name, email, avatar, role} = response.data;
			const token = response.token;

			// Lưu thông tin người dùng vào localStorage
			localStorage.setItem('token', token);
			localStorage.setItem('name', name);
			localStorage.setItem('avatar', avatar);

			// Nếu có cart local -> merge vào cart BE
			const localCart = JSON.parse(localStorage.getItem('cart')) || [];
			if (localCart.length > 0) {
				await mergeCart(localCart); // Gửi cart tạm lên server
			}

			localStorage.removeItem('cartToken'); // clear cartToken sau khi merge

			const serverCart = await getAllCart();
			// Cập nhật giỏ hàng từ server vào context
			dispatch({type: 'SET_CART', payload: serverCart.items || []});

			localStorage.removeItem('cart'); // không cần cart local nữa

			if (role === 1) {
				router.push(ROUTES.Home);
			} else if (role === 0) {
				router.push(ROUTES.AdminDashboard);
			}
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
				localStorage.removeItem('password');
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
									const {credential} = credentialResponse;
									const {token, data} = await loginWithGoogle(credential);

									localStorage.setItem('token', token);
									localStorage.setItem('name', data.name);
									localStorage.setItem('avatar', data.avatar);

									toast.success('Đăng nhập bằng Google thành công!');
									router.push(data.role === 0 ? ROUTES.AdminDashboard : ROUTES.Home);
								} catch (err) {
									console.error('Google login error:', err);
									toast.error('Lỗi khi đăng nhập với Google');
								}
							}}
							onError={() => toast.error('Đăng nhập bằng Google thất bại')}
							width='100%'
						/>
					</form>
					{/* {errors.general && <p className={styles.errorMsg}>{errors.general}</p>} */}

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
