import React, {useState} from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {useRouter} from 'next/router';
import {ROUTES} from '@/constants/config';
import styles from './MainForgotPassword.module.scss';
import images from '@/constants/static/images';
import icons from '@/constants/static/icons';
import Button from '@/components/common/Button/Button';
import {forgotPassword} from '@/services/authService';
import {toast, ToastContainer} from 'react-toastify';
import Loading from '@/components/common/Loading/Loading';

const MainForgotPassword = () => {
	const router = useRouter();
	const [formData, setFormData] = useState({
		email: '',
	});

	const [errors, setErrors] = useState({});
	const [serverError, setServerError] = useState('');
	const [successMessage, setSuccessMessage] = useState('');
	const [loading, setLoading] = useState(false);

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
			}
		}

		setErrors({
			...errors,
			[name]: errorMsg,
		});
	};

	const handleForgotPassword = async (e) => {
		e.preventDefault();
		setLoading(true);
		setServerError('');

		try {
			const response = await forgotPassword(formData.email);
			toast.success(response.message, {
				position: 'top-right',
				autoClose: 3000,
				hideProgressBar: false,
				closeOnClick: true,
				pauseOnHover: true,
				draggable: true,
				progress: undefined,
			});
			router.push({
				pathname: ROUTES.ResetPassword,
				query: {email: formData.email},
			});
		} catch (error) {
			setServerError(error);
			toast.error(error.message || 'Gửi yêu cầu đặt lại mật khẩu thất bại.', {
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
			{loading && <Loading fullScreen />}
			<ToastContainer />
			<div className={styles.forgotWrapper}>
				<div className={styles.forgotContent}>
					<Link href={ROUTES.Home} className={styles.logo}>
						<Image src={icons.logoSmall} alt='Logo' width={50} height={50} />
					</Link>

					<h2 className={styles.forgotTitle}>Quên mật khẩu</h2>
					<p className={styles.forgotLabel}>
						Nhập email của bạn bên dưới và chúng tôi sẽ gửi cho bạn hướng dẫn về cách đặt lại mật khẩu.
					</p>

					<form className={styles.formGroup} onSubmit={handleForgotPassword}>
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

						<div className={styles.actions}>
							<Button type='submit' className={styles.btnForgot} disabled={loading}>
								Đặt lại mật khẩu
							</Button>
						</div>
					</form>
					{serverError && <p className={styles.errorMsg}>{serverError}</p>}

					<div className={styles.forgotAccount}>
						<Link href={ROUTES.Home} className={styles.forgotFree}>
							Quay lại trang chủ
						</Link>
					</div>
				</div>
				<div className={styles.media}>
					<Image src={images.bgLogin} alt='Forgot Background' layout='fill' objectFit='cover' className={styles.forgotMedia} />
				</div>
			</div>
		</div>
	);
};

export default MainForgotPassword;
