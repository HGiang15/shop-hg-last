import React, {useState, useEffect} from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {FaBars, FaTimes} from 'react-icons/fa';
import {jwtDecode} from 'jwt-decode';
import {ROUTES} from '@/constants/config';
import logo from '../../../../../../public/static/images/logo_small.svg';
import defaultAvatar from '../../../../../../public/static/images/auth/user.svg';
import styles from './Header.module.scss';

function Header() {
	const [menuOpen, setMenuOpen] = useState(false);
	const [user, setUser] = useState(null);
	const [showDropdown, setShowDropdown] = useState(false);

	// Lấy thông tin user từ localStorage khi component mount
	useEffect(() => {
		const token = localStorage.getItem('token');
		const name = localStorage.getItem('name');

		if (token) {
			try {
				const decoded = jwtDecode(token);
				setUser({...decoded, name});
			} catch (error) {
				console.error('Token không hợp lệ', error);
				localStorage.removeItem('token');
			}
		}
	}, []);

	const toggleMenu = () => {
		setMenuOpen(!menuOpen);
	};

	const toggleDropdown = () => {
		setShowDropdown(!showDropdown);
	};

	const handleLogout = () => {
		localStorage.removeItem('token');
		setUser(null);
		window.location.reload();
	};

	return (
		<div className={styles.header}>
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
						<Link className={styles.nav__link} href='/'>
							Trang chủ
						</Link>
					</li>
					<li className={styles.nav__item}>
						<Link className={styles.nav__link} href='/products'>
							Sản phẩm
						</Link>
					</li>
					<li className={styles.nav__item}>
						<Link className={styles.nav__link} href={ROUTES.About}>
							Về chúng tôi
						</Link>
					</li>
					<li className={styles.nav__item}>
						<Link className={styles.nav__link} href='/blog'>
							Blog
						</Link>
					</li>
					<li className={styles.nav__item}>
						<Link className={styles.nav__link} href='/contact'>
							Liên hệ
						</Link>
					</li>
				</ul>
			</nav>

			{/* Actions */}
			<div className={styles.header__auth}>
				{user ? (
					// if login
					<div className={styles.userDropdown}>
						<div className={styles.userInfo}>
							<Image
								src={user.avatar || defaultAvatar}
								alt='User Avatar'
								width={40}
								height={40}
								className={styles.userAvatar}
							/>
							<span className={styles.userName}>{user.name || 'Người dùng'}</span>
						</div>

						{/* Dropdown Menu */}
						<ul className={styles.dropdownMenu}>
							<li>
								<Link href='/profile'>Thông tin tài khoản</Link>
							</li>
							<li onClick={handleLogout}>Đăng xuất</li>
						</ul>
					</div>
				) : (
					// if not login
					<>
						<Link href={ROUTES.Login}>
							<button className={styles.auth__login}>Đăng nhập</button>
						</Link>
						<Link href={ROUTES.Register}>
							<button className={styles.auth__register}>Đăng ký</button>
						</Link>
					</>
				)}
			</div>
		</div>
	);
}

export default Header;
