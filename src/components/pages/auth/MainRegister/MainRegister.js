import React, {useState, useEffect} from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {useRouter} from 'next/router';
import {ROUTES} from '@/constants/config';
import {registerUser} from '@/services/authService';
import styles from './MainRegister.module.scss';
import icons from '@/constants/static/icons';
import Loading from '@/components/common/Loading/Loading';
import Button from '@/components/common/Button/Button';
import {toast, ToastContainer} from 'react-toastify';

const MainRegister = () => {
	const router = useRouter();

	const [formData, setFormData] = useState({
		name: '',
		email: '',
		phone: '',
		dateOfBirth: '',
		gender: '',
		password: '',
		confirmPassword: '',
	});

	const [errors, setErrors] = useState({});
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);
	const [isFormValid, setIsFormValid] = useState(false);
	const [loading, setLoading] = useState(false);
	const [showSuccessModal, setShowSuccessModal] = useState(false);
	const [serverError, setServerError] = useState('');

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

	const handleRegister = async (e) => {
		e.preventDefault();
		setErrors({});
		setServerError('');

		try {
			setLoading(true);
			const response = await registerUser(formData);

			if (response.code === 'USER_PENDING_VERIFICATION') {
				if (response.data && response.data.userId) {
					toast.success('Đăng ký thành công, vui lòng xác minh email.', {
						position: 'top-right',
						autoClose: 3000,
						hideProgressBar: false,
						closeOnClick: true,
						pauseOnHover: true,
						draggable: true,
						progress: undefined,
					});

					localStorage.setItem('registrationData', JSON.stringify(formData));

					router.push({
						pathname: ROUTES.verify_password,
						query: {userId: response.data.userId},
					});
				} else {
					setServerError('Không tìm thấy userId');
					toast.error('Đăng ký thất bại, không tìm thấy userId.', {
						position: 'top-right',
						autoClose: 3000,
						hideProgressBar: false,
						closeOnClick: true,
						pauseOnHover: true,
						draggable: true,
						progress: undefined,
					});
				}
			} else {
				setServerError(response.message || 'Đăng ký thất bại');
				toast.error(response.message || 'Đăng ký thất bại.', {
					position: 'top-right',
					autoClose: 3000,
					hideProgressBar: false,
					closeOnClick: true,
					pauseOnHover: true,
					draggable: true,
					progress: undefined,
				});
			}
		} catch (error) {
			setServerError(error);
			toast.error(error, {
				position: 'top-right',
				autoClose: 3000,
				hideProgressBar: false,
				closeOnClick: true,
				pauseOnHover: true,
				draggable: true,
				progress: undefined,
			});
		} finally {
			setLoading(false);
		}
	};
	useEffect(() => {
		const isValid = Object.values(formData).every((val) => val.trim() !== '') && Object.values(errors).every((err) => err === '');
		setIsFormValid(isValid);
	}, [formData, errors]);

	return (
		<div className={styles.container}>
			{loading && <Loading fullScreen />}
			<ToastContainer />

			{showSuccessModal && (
				<div className={styles.modalOverlay}>
					<div className={styles.modalContent}>
						<h3>Chúc mừng bạn đã đăng ký thành công ✅</h3>
					</div>
				</div>
			)}

			<div className={styles.registerWrapper}>
				<div className={styles.registerContent}>
					<Link href={ROUTES.Home} className={styles.logo}>
						<Image src={icons.logoSmall} alt='Logo' width={50} height={50} />
					</Link>

					<h2 className={styles.registerTitle}>Tạo tài khoản mới</h2>
					<p className={styles.registerLabel}>Đăng ký ngay để tham gia hệ thống đặt mua quần áo trực tuyến của chúng tôi!</p>

					<form className={styles.formGroup} onSubmit={handleRegister}>
						{/* Họ và Tên */}
						<div className={styles.inputWrapper}>
							<input
								type='text'
								name='name'
								className={`${styles.formInput} ${styles.fullWidth}`}
								placeholder='Họ và Tên'
								value={formData.name}
								onChange={handleChange}
								onBlur={handleBlur}
							/>
							{errors.name && <span className={styles.errorMsg}>{errors.name}</span>}
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
									type='number'
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
									name='dateOfBirth'
									className={styles.formInput}
									value={formData.dateOfBirth}
									onChange={handleChange}
									onBlur={handleBlur}
								/>
								{errors.dateOfBirth && <span className={styles.errorMsg}>{errors.dateOfBirth}</span>}
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
									<option value='Male'>Nam</option>
									<option value='Female'>Nữ</option>
									<option value='Other'>Khác</option>
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
										src={showPassword ? icons.eyeOpen : icons.eyeClose}
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
										src={showConfirmPassword ? icons.eyeOpen : icons.eyeClose}
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

						<div className={styles.actions}>
							<Button type='submit' className={styles.btnRegister} disabled={!isFormValid || loading}>
								Đăng ký
							</Button>
						</div>
					</form>
					{serverError && <p className={styles.errorMsg}>{serverError}</p>}

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
