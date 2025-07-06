import React, {useState} from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {useRouter} from 'next/router';
import {useSearchParams} from 'next/navigation';
import {ROUTES} from '@/constants/config';
import styles from './MainResetPassword.module.scss';
import images from '@/constants/static/images';
import icons from '@/constants/static/icons';
import Button from '@/components/common/Button/Button';
import {resetPassword, forgotPassword} from '@/services/authService';
import {toast, ToastContainer} from 'react-toastify';

const MainResetPassword = () => {
	const router = useRouter();
	const searchParams = useSearchParams();
	const email = searchParams.get('email');

	const [formData, setFormData] = useState({
		otp: '',
		newPassword: '',
	});

	const [errors, setErrors] = useState({});
	const [serverError, setServerError] = useState('');
	const [loading, setLoading] = useState(false);
	const [showPassword, setShowPassword] = useState(false);

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
		}

		setErrors({
			...errors,
			[name]: errorMsg,
		});
	};

	const handleResetPassword = async (e) => {
		e.preventDefault();
		setLoading(true);
		setServerError('');

		try {
			const response = await resetPassword(email, formData.otp, formData.newPassword);
			toast.success(response.message, {
				position: 'top-right',
				autoClose: 3000,
				hideProgressBar: false,
				closeOnClick: true,
				pauseOnHover: true,
				draggable: true,
				progress: undefined,
			});
			setTimeout(() => {
				router.push(ROUTES.Login);
			}, 3000);
		} catch (error) {
			setServerError(error);
			toast.error(error.message || 'Đặt lại mật khẩu thất bại.', {
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

	const handleResendOTP = async () => {
		setLoading(true);
		setServerError('');

		try {
			const response = await forgotPassword(email);
			toast.success(response.message, {
				position: 'top-right',
				autoClose: 3000,
				hideProgressBar: false,
				closeOnClick: true,
				pauseOnHover: true,
				draggable: true,
				progress: undefined,
			});
		} catch (error) {
			setServerError(error);
			toast.error(error.message || 'Gửi lại OTP thất bại.', {
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

	return (
		<div className={styles.container}>
			<ToastContainer />
			<div className={styles.resetWrapper}>
				<div className={styles.resetContent}>
					<Link href={ROUTES.Home} className={styles.logo}>
						<Image src={icons.logoSmall} alt='Logo' width={50} height={50} />
					</Link>
					<h2 className={styles.resetTitle}>Đặt lại mật khẩu</h2>
					<p className={styles.resetLabel}>Vui lòng nhập mã OTP đã được gửi đến email của bạn.</p>
					<form className={styles.formGroup} onSubmit={handleResetPassword}>
						{/* OTP */}
						<div className={styles.inputWrapper}>
							<input
								type='number'
								name='otp'
								className={styles.formInput}
								placeholder='Mã OTP'
								value={formData.otp}
								onChange={handleChange}
								onBlur={handleBlur}
							/>
						</div>
						{errors.otp && <span className={styles.errorMsg}>{errors.otp}</span>}

						{/* Mật khẩu mới */}
						<div className={styles.inputWrapper}>
							<input
								type={showPassword ? 'text' : 'password'}
								name='newPassword'
								className={styles.formInput}
								placeholder='Mật khẩu mới'
								value={formData.newPassword}
								onChange={handleChange}
								onBlur={handleBlur}
							/>
							<Image
								src={showPassword ? icons.eyeOpen : icons.eyeClose}
								alt='Toggle password visibility'
								onClick={() => setShowPassword((prev) => !prev)}
								className={styles.eyeIcon}
							/>
						</div>
						{errors.newPassword && <span className={styles.errorMsg}>{errors.newPassword}</span>}

						<div className={styles.actions}>
							<Button type='submit' className={styles.btnReset} disabled={loading}>
								Đặt lại mật khẩu
							</Button>
						</div>
					</form>
					{serverError && <p className={styles.errorMsg}>{serverError.message}</p>}
					<Button className={styles.resendOtpButton} onClick={handleResendOTP}>
						Gửi lại OTP
					</Button>
					<div className={styles.resetAccount}>
						<Link href={ROUTES.Login} className={styles.resetFree}>
							Quay lại trang đăng nhập
						</Link>
					</div>
				</div>
				<div className={styles.media}>
					<Image src={images.bgLogin} alt='Reset Background' layout='fill' objectFit='cover' className={styles.resetMedia} />
				</div>
			</div>
		</div>
	);
};

export default MainResetPassword;
