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
import ShoppingCart from '@/components/pages/user/cart/ShoppingCart/ShoppingCart';
import useCart from '@/hooks/useCart';
import {getCurrentUser} from '@/services/authService';

function Header() {
	const router = useRouter();
	const {dispatch} = useCart();

	const [menuOpen, setMenuOpen] = useState(false);
	const [user, setUser] = useState(null);
	const [loading, setLoading] = useState(false);
	const [showDropdown, setShowDropdown] = useState(false);
	const [cartItemCount, setCartItemCount] = useState(0);
	const [showCart, setShowCart] = useState(false);

	useEffect(() => {
		const fetchUser = async () => {
			const token = localStorage.getItem('token');
			if (!token) return;

			try {
				const decoded = jwtDecode(token);
				const currentUser = await getCurrentUser();
				setUser({
					...decoded,
					name: currentUser.name || '',
					avatar: currentUser.avatar || '',
				});
			} catch (error) {
				console.error('Lỗi khi lấy thông tin người dùng:', error.message || error);
				localStorage.removeItem('token');
				setUser(null);
			}
		};

		fetchUser();

		// Cập nhật số lượng giỏ hàng từ localStorage
		const cart = localStorage.getItem('cart');
		if (cart) {
			try {
				const cartItems = JSON.parse(cart);
				const totalQuantity = cartItems.reduce((sum, item) => sum + item.quantity, 0);
				setCartItemCount(totalQuantity);
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

	const updateCartCount = (newCount) => {
		setCartItemCount(newCount);
	};

	const handleLogout = () => {
		setLoading(true);
		localStorage.removeItem('token');
		localStorage.removeItem('cart');
		localStorage.removeItem('name');
		localStorage.removeItem('avatar');
		localStorage.removeItem('cartToken');

		// Xoá giỏ hàng trong context
		dispatch({type: 'CLEAR_CART'});

		setUser(null);

		// Đồng bộ các tab (nếu dùng nhiều tab)
		window.dispatchEvent(new Event('storage'));

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
						<Link className={styles.nav__link} href='/policy'>
							Chính sách bảo mật
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
				<Button className={styles.cart} onClick={() => setShowCart(true)}>
					<Image src={icons.cart} width={28} height={28} alt='Cart' className='' />
					{cartItemCount > 0 && <span className={styles.cart__count}>{cartItemCount}</span>}
				</Button>

				{showCart && <ShoppingCart onClose={() => setShowCart(false)} onUpdateCartCount={updateCartCount} />}

				<div className={styles.header__auth}>
					{user ? (
						// if login
						<div className={styles.userDropdown}>
							<div className={styles.userInfo} onClick={toggleDropdown}>
								<Image
									src={user?.avatar && user.avatar.startsWith('http') ? user.avatar : images.defaultAvatar}
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
									<li>
										<Link href={ROUTES.HistoryOrder}>Đơn hàng của tôi</Link>
									</li>
									<li>
										<Link href={ROUTES.ChangePassword}>Thay đổi mật khẩu</Link>
									</li>
									<li onClick={handleLogout}>Đăng xuất</li>
								</ul>
							)}
						</div>
					) : (
						// if not login
						<>
							<Button href={ROUTES.Login} className={styles.auth__login}>
								Đăng nhập
							</Button>
							<Button href={ROUTES.Register} className={styles.auth__register}>
								Đăng ký
							</Button>
						</>
					)}
				</div>
			</div>

			{loading && <Loading fullScreen />}
		</div>
	);
}

export default Header;
