import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ROUTES } from '@/constants/config';
import styles from './MainLogin.module.scss';
import googleIcon from '../../../../../public/static/icons/google.svg';
import bgImage from '../../../../../public/static/images/auth/login-bg.jpg';
import logo from '../../../../../public/static/images/logo_small.svg';

const MainLogin = () => {
	return (
		<div className={styles.container}>
			<div className={styles.loginWrapper}>
				<div className={styles.loginContent}>
					<Link href={ROUTES.Home} className={styles.logo}>
						<Image src={logo} alt='Logo' width={50} height={50} />
					</Link>

					<h2 className={styles.loginTitle}>Đăng nhập tài khoản</h2>
					<p className={styles.loginLabel}>Chào mừng bạn đến với hệ thống đặt mua quần áo trực tuyến.
					Đăng nhập để bắt đầu sử dụng!</p>

					<button className={styles.loginAction}>
						<Image src={googleIcon} alt='Google' width={24} height={24} className={styles.loginImg} />
						<span className={styles.loginDesc}>Log in with Google</span>
					</button>

					<input type='email' className={styles.formInput} placeholder='Email' />
					<input type='password' className={styles.formInput} placeholder='Password' />

					<div className={styles.contentWrapper}>
						<input type='checkbox' className={styles.formCheckbox} id='remember' />
						<label htmlFor='remember' className={styles.formText}>
							Remember for 30 days
						</label>
						<a href={ROUTES.forgot_password} className={styles.formForgot}>
							Forgot password
						</a>
					</div>

					<div className={styles.actions}>
						<button className={styles.btnLogin}>Log in</button>
					</div>

					<div className={styles.loginAccount}>
						<span className={styles.loginNot}>Don’t have an account?</span>
						<Link href={ROUTES.Register} className={styles.loginFree}>
							Sign up for free
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
