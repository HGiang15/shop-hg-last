import React, {useState, useEffect} from 'react';
import {useRouter} from 'next/router';
import Link from 'next/link';
import Image from 'next/image';
import {FaBars, FaTimes} from 'react-icons/fa';
import {jwtDecode} from 'jwt-decode';
import {ROUTES} from '@/constants/config';
import Loading from '@/components/common/Loading/Loading';
import styles from './Header.module.scss';
import images from '@/constants/static/images';
import icons from '@/constants/static/icons';
import Button from '@/components/common/Button/Button';

function Header() {
	const [menuOpen, setMenuOpen] = useState(false);
	const [user, setUser] = useState(null);
	const [loading, setLoading] = useState(false);
	const [showDropdown, setShowDropdown] = useState(false);
	const router = useRouter();
	const [cartItemCount, setCartItemCount] = useState(1);

	useEffect(() => {
		const token = localStorage.getItem('token');
		const name = localStorage.getItem('name');
		const cart = localStorage.getItem('cart'); // Get cart from local storage

		if (token) {
			try {
				const decoded = jwtDecode(token);
				setUser({...decoded, name});
			} catch (error) {
				console.error('Token không hợp lệ', error);
				localStorage.removeItem('token');
			}
		}

		// Update cart item count from local storage
		if (cart) {
			try {
				const cartItems = JSON.parse(cart);
				setCartItemCount(cartItems.length);
			} catch (error) {
				console.error('Lỗi khi phân tích giỏ hàng từ localStorage', error);
				setCartItemCount(0);
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
		setLoading(true);
		localStorage.removeItem('token');
		setUser(null);

		setTimeout(() => {
			setLoading(false);
			router.push('/');
		}, 1500);
	};

	return (
		<div className={styles.header}>
			<div className={styles.header__logo}>
				<Link href='/'>
					<Image className={styles.logo_home} src={images.logoSmall} alt='Logo' />
				</Link>
			</div>

			{/* Menu Responsive */}
			<button className={styles.menuToggle} onClick={toggleMenu}>
				{menuOpen ? <FaTimes /> : <FaBars />}
			</button>

			{/* Overlay */}
			<div className={`${styles.overlay} ${menuOpen ? styles.open : ''}`} onClick={toggleMenu}></div>

			<nav className={`${styles.header__nav} ${menuOpen ? styles.open : ''}`}>
				<ul className={styles.nav__list}>
					<li className={styles.nav__item}>
						<Link className={styles.nav__link} href='/'>
							Trang chủ
						</Link>
					</li>
					<li className={styles.nav__item}>
						<Link className={styles.nav__link} href={ROUTES.Product}>
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

			<div className={styles.header__actions}>
				<Link href={ROUTES.Cart} className={styles.header__cart}>
					<Image src={icons.cart} width={28} height={28} alt='Cart' className='' />
					{cartItemCount > 0 && <span className={styles.cart__count}>{cartItemCount}</span>}
				</Link>
				<div className={styles.header__auth}>
					{user ? (
						// if login
						<div className={styles.userDropdown}>
							<div className={styles.userInfo} onClick={toggleDropdown}>
								<Image
									src={user.avatar || images.defaultAvatar}
									alt='User Avatar'
									width={40}
									height={40}
									className={styles.userAvatar}
								/>
								<span className={styles.userName}>{user.name || 'Người dùng'}</span>
							</div>

							{showDropdown && (
								<ul className={styles.dropdownMenu}>
									<li>
										<Link href={ROUTES.Profile}>Thông tin tài khoản</Link>
									</li>
									<li onClick={handleLogout}>Đăng xuất</li>
								</ul>
							)}
						</div>
					) : (
						// if not login
						<>
							<Link href={ROUTES.Login}>
								<Button className={styles.auth__login}>Đăng nhập</Button>
							</Link>
							<Link href={ROUTES.Register}>
								<Button className={styles.auth__register}>Đăng ký</Button>
							</Link>
						</>
					)}
				</div>
			</div>

			{loading && <Loading fullScreen />}
		</div>
	);
}

export default Header;
