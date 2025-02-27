import React, {useState} from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {ROUTES} from '@/constants/config';
import styles from './MainForgotPassword.module.scss';
import bgImage from '../../../../../public/static/images/auth/login-bg.jpg';
import logo from '../../../../../public/static/images/logo_small.svg';

const MainForgotPassword = () => {
	const [formData, setFormData] = useState({
		email: '',
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
			}
		}

		setErrors({
			...errors,
			[name]: errorMsg,
		});
	};

	return (
		<div className={styles.container}>
			<div className={styles.forgotWrapper}>
				<div className={styles.forgotContent}>
					<Link href={ROUTES.Home} className={styles.logo}>
						<Image src={logo} alt='Logo' width={50} height={50} />
					</Link>

					<h2 className={styles.forgotTitle}>Quên mật khẩu</h2>
					<p className={styles.forgotLabel}>
						Nhập email của bạn bên dưới và chúng tôi sẽ gửi cho bạn hướng dẫn về cách đặt lại mật khẩu.
					</p>

                    {/* Form */}
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
					</form>

					<div className={styles.actions}>
						<button className={styles.btnForgot} href={''}>Đặt lại mật khẩu</button>
					</div>

					<div className={styles.forgotAccount}>
						<Link href={ROUTES.Home} className={styles.forgotFree}>
							Quay lại trang chủ
						</Link>
					</div>
				</div>
				<div className={styles.media}>
					<Image src={bgImage} alt='Forgot Background' layout='fill' objectFit='cover' className={styles.forgotMedia} />
				</div>
			</div>
		</div>
	);
};

export default MainForgotPassword;
