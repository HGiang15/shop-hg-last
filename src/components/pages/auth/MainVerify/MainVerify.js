import React, {useState} from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {useRouter} from 'next/router';
import {ROUTES} from '@/constants/config';
import styles from './MainVerify.module.scss';
import images from '@/constants/static/images';
import icons from '@/constants/static/icons';
import Button from '@/components/common/Button/Button';
import {verifyOTP, forgotPassword} from '@/services/authService';
import {useSearchParams} from 'next/navigation';
import {toast, ToastContainer} from 'react-toastify';

const MainVerify = () => {
	const router = useRouter();
	const searchParams = useSearchParams();
	const userId = searchParams.get('userId');

	const [formData, setFormData] = useState({
		otp: '',
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
		}

		setErrors({
			...errors,
			[name]: errorMsg,
		});
	};

	const handleVerify = async (e) => {
		e.preventDefault();
		setLoading(true);
		setServerError('');

		try {
			const response = await verifyOTP(userId, formData.otp);
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

	const handleResendOTP = async () => {
		setLoading(true);
		setServerError('');

		try {
			const registrationData = JSON.parse(localStorage.getItem('registrationData'));
			const email = registrationData?.email;

			if (!email) {
				setServerError('Không tìm thấy thông tin email.');
				toast.error('Không tìm thấy thông tin email.', {
					position: 'top-right',
					autoClose: 3000,
					hideProgressBar: false,
					closeOnClick: true,
					pauseOnHover: true,
					draggable: true,
					progress: undefined,
				});
				return;
			}

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

	return (
		<div className={styles.container}>
			<ToastContainer />
			<div className={styles.verifyWrapper}>
				<div className={styles.verifyContent}>
					<Link href={ROUTES.Home} className={styles.logo}>
						<Image src={icons.logoSmall} alt='Logo' width={50} height={50} />
					</Link>

					<h2 className={styles.verifyTitle}>Xác minh email</h2>
					{/* <p className={styles.verifyLabel}>Bạn đã gửi mã đến Email gianghoang150503@gmail.com</p> */}

					<form className={styles.formGroup} onSubmit={handleVerify}>
						{/* OTP */}
						<div className={styles.inputWrapper}>
							<input
								type='number'
								name='otp'
								className={styles.formInput}
								placeholder='Nhập mã OTP'
								value={formData.otp}
								onChange={handleChange}
								onBlur={handleBlur}
							/>
						</div>
						{errors.otp && <span className={styles.errorMsg}>{errors.otp}</span>}

						<div className={styles.actions}>
							<Button type='submit' className={styles.btnVerify} disabled={loading}>
								Xác nhận
							</Button>
						</div>
					</form>

					{serverError && <p className={styles.errorMsg}>{serverError.message}</p>}
					{successMessage && <p className={styles.successMsg}>{successMessage.message}</p>}

					<Button type='button' className={styles.btnResendOTP} onClick={handleResendOTP} disabled={loading}>
						Gửi lại OTP
					</Button>

					<div className={styles.verifyAccount}>
						<Link href={ROUTES.Home} className={styles.verifyFree}>
							Quay lại trang chủ
						</Link>
					</div>
				</div>
				<div className={styles.media}>
					<Image src={images.bgLogin} alt='Login Background' layout='fill' objectFit='cover' className={styles.verifyMedia} />
				</div>
			</div>
		</div>
	);
};

export default MainVerify;
