import React, {useState} from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {ROUTES} from '@/constants/config';
import styles from './MainVerify.module.scss';
import bgImage from '../../../../../public/static/images/auth/login-bg.jpg';
import logo from '../../../../../public/static/images/logo_small.svg';

const MainVerify = () => {
	const [formData, setFormData] = useState({
		otp: '',
	});

	const [errors, setErrors] = useState({});

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

	return (
		<div className={styles.container}>
			<div className={styles.verifyWrapper}>
				<div className={styles.verifyContent}>
					<Link href={ROUTES.Home} className={styles.logo}>
						<Image src={logo} alt='Logo' width={50} height={50} />
					</Link>

					<h2 className={styles.verifyTitle}>Xác minh email</h2>
					<p className={styles.verifyLabel}>Bạn đã gửi mã đến Email gianghoang150503@gmail.com</p>

					<form className={styles.formGroup}>
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
					</form>

					<div className={styles.actions}>
						<button className={styles.btnVerify}>Xác nhận</button>
					</div>

					<div className={styles.verifyAccount}>
						<Link href={ROUTES.Home} className={styles.verifyFree}>
							Quay lại trang chủ
						</Link>
					</div>
				</div>
				<div className={styles.media}>
					<Image src={bgImage} alt='Login Background' layout='fill' objectFit='cover' className={styles.verifyMedia} />
				</div>
			</div>
		</div>
	);
};

export default MainVerify;
