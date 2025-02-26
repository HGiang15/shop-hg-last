import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FaBars, FaTimes } from 'react-icons/fa';
import { ROUTES } from '@/constants/config';
import logo from '../../../../../../public/static/images/logo_small.svg';
import styles from './Header.module.scss';

function Header() {
	const [menuOpen, setMenuOpen] = useState(false);

	const toggleMenu = () => {
		setMenuOpen(!menuOpen);
	};

	return (
		<header className={styles.header}>
			{/* Logo */}
			<div className={styles.header__logo}>
				<Link href='/'>
					<Image className={styles.logo_home} src={logo} alt='Logo' />
				</Link>
			</div>

			{/* Menu Responsive */}
			<button className={styles.menuToggle} onClick={toggleMenu}>
				{menuOpen ? <FaTimes /> : <FaBars />}
			</button>

			{/* Overlay */}
			<div className={`${styles.overlay} ${menuOpen ? styles.open : ''}`} onClick={toggleMenu}></div>

			{/* Menu */}
			<nav className={`${styles.header__nav} ${menuOpen ? styles.open : ''}`}>
				<ul className={styles.nav__list}>
					<li className={styles.nav__item}>
						<Link className={styles.nav__link} href='/'>Trang chủ</Link>
					</li>
					<li className={styles.nav__item}>
						<Link className={styles.nav__link} href='/products'>Sản phẩm</Link>
					</li>
					<li className={styles.nav__item}>
						<Link className={styles.nav__link} href='/about'>Về chúng tôi</Link>
					</li>
					<li className={styles.nav__item}>
						<Link className={styles.nav__link} href='/blog'>Blog</Link>
					</li>
					<li className={styles.nav__item}>
						<Link className={styles.nav__link} href='/contact'>Liên hệ</Link>
					</li>
				</ul>
			</nav>

			{/* Actions */}
			<div className={styles.header__auth}>
				<Link href={ROUTES.Login}>
					<button className={styles.auth__login}>Đăng nhập</button>
				</Link>
				<Link href={ROUTES.Register}>
					<button className={styles.auth__register}>Đăng ký</button>
				</Link>
			</div>
		</header>
	);
}

export default Header;
