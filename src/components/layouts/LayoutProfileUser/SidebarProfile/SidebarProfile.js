import React, {useState, useEffect, useRef} from 'react';
import styles from './SidebarProfile.module.scss';
import {FaTimes} from 'react-icons/fa';
import icons from '@/constants/static/icons';
import images from '@/constants/static/images';
import Link from 'next/link';
import Image from 'next/image';
import {ROUTES} from '@/constants/config';
import {useRouter} from 'next/router';
import {getCurrentUser} from '@/services/authService';
import Loading from '@/components/common/Loading/Loading';
import useCart from '@/hooks/useCart';
import {useDispatch} from 'react-redux';
import {logout} from '@/redux/slices/authSlice';
import {clearUserInfo} from '@/redux/slices/userSlice';

const SidebarProfile = ({isOpen, onClose}) => {
	const router = useRouter();
	const {clearCart} = useCart();

	const reduxDispatch = useDispatch();

	const [loading, setLoading] = useState(false);
	const [activeLink, setActiveLink] = useState(ROUTES.Profile);
	const sidebarRef = useRef(null);
	const [isClient, setIsClient] = useState(false);
	const [user, setUser] = useState({
		name: '',
		gender: '',
		dateOfBirth: '',
		avatar: '',
	});

	useEffect(() => {
		setIsClient(true);
		setActiveLink(router.asPath);
	}, [router.asPath]);

	useEffect(() => {
		const fetchUser = async () => {
			try {
				const currentUser = await getCurrentUser();
				setUser({
					name: currentUser.name || '',
					gender: currentUser.gender || '',
					dateOfBirth: currentUser.dateOfBirth ? currentUser.dateOfBirth.slice(0, 10) : '',
					avatar: currentUser.avatar || '',
				});
			} catch (error) {
				console.error('Lỗi khi lấy thông tin người dùng:', error.message || error);
			}
		};
		fetchUser();
	}, []);

	const handleLinkClick = (route) => {
		setActiveLink(route);
		if (isClient && window.innerWidth < 768) {
			onClose();
		}
	};

	useEffect(() => {
		const handleClickOutside = (event) => {
			if (sidebarRef.current && !sidebarRef.current.contains(event.target) && isClient && window.innerWidth < 768 && isOpen) {
				onClose();
			}
		};

		if (isClient) {
			document.addEventListener('mousedown', handleClickOutside);
			return () => {
				document.removeEventListener('mousedown', handleClickOutside);
			};
		}
	}, [isOpen, isClient, onClose]);

	const avatarSrc = user.avatar ? user.avatar : images.defaultAvatar;

	const genderDisplay =
		{
			Male: 'Nam',
			Female: 'Nữ',
			Other: 'Khác',
		}[user.gender] || '';

	const formatDate = (dateStr) => {
		if (!dateStr) return '';
		const d = new Date(dateStr);
		return d.toLocaleDateString('vi-VN');
	};

	const handleLogout = () => {
		setLoading(true);
		localStorage.removeItem('token');
		localStorage.removeItem('cart');
		localStorage.removeItem('name');
		localStorage.removeItem('avatar');
		localStorage.removeItem('cartToken');
		localStorage.removeItem('persist:root');

		clearCart();

		reduxDispatch(logout());
		reduxDispatch(clearUserInfo());

		setUser({
			name: '',
			gender: '',
			dateOfBirth: '',
			avatar: '',
		});

		window.dispatchEvent(new Event('storage'));

		setTimeout(() => {
			setLoading(false);
			router.push('/');
		}, 1500);
	};

	return (
		<div ref={sidebarRef} className={`${styles.container} ${isOpen ? styles.open : styles.closed}`}>
			{isClient && window.innerWidth < 768 && isOpen && (
				<div className={styles.closeButton} onClick={onClose}>
					<FaTimes />
				</div>
			)}

			<div className={styles.profileHeader}>
				<Image src={avatarSrc} alt='Avatar' width={80} height={80} className={styles.avatar} />
				<div className={styles.profileInfo}>
					<h2 className={styles.name}>{user.name || 'Tên người dùng'}</h2>
					<span className={styles.details}>
						{genderDisplay} {genderDisplay && user.dateOfBirth ? ' - ' : ''}
					</span>
					<span className={styles.details}>{formatDate(user.dateOfBirth)}</span>
				</div>
			</div>

			<ul className={styles.menu}>
				<li className={`${styles.menuItem} ${activeLink === ROUTES.Profile ? styles.active : ''}`}>
					<Link href={ROUTES.Profile} onClick={() => handleLinkClick(ROUTES.Profile)}>
						<div className={styles.menuLink}>
							<Image src={icons.profileCircle} alt='Thông tin cá nhân' width={20} height={20} className={styles.icon} />
							Thông tin cá nhân
						</div>
					</Link>
				</li>
				<li className={`${styles.menuItem} ${activeLink === ROUTES.ChangePassword ? styles.active : ''}`}>
					<Link href={ROUTES.ChangePassword} onClick={() => handleLinkClick(ROUTES.ChangePassword)}>
						<div className={styles.menuLink}>
							<Image src={icons.lockCircle} alt='Đổi mật khẩu' width={20} height={20} className={styles.icon} />
							Đổi mật khẩu
						</div>
					</Link>
				</li>
				<li className={`${styles.menuItem} ${activeLink === ROUTES.Address ? styles.active : ''}`}>
					<Link href={ROUTES.Address} onClick={() => handleLinkClick(ROUTES.Address)}>
						<div className={styles.menuLink}>
							<Image src={icons.iconAddress} alt='Sổ địa chỉ' width={20} height={20} className={styles.icon} />
							Sổ địa chỉ
						</div>
					</Link>
				</li>
				<li className={`${styles.menuItem} ${activeLink === ROUTES.HistoryOrder ? styles.active : ''}`}>
					<Link href={ROUTES.HistoryOrder} onClick={() => handleLinkClick(ROUTES.HistoryOrder)}>
						<div className={styles.menuLink}>
							<Image src={icons.iconTick} alt='Đơn hàng của tôi' width={20} height={20} className={styles.icon} />
							Đơn hàng của tôi
						</div>
					</Link>
				</li>
				<li className={`${styles.menuItem} ${activeLink === ROUTES.TransactionHistory ? styles.active : ''}`}>
					<Link href={ROUTES.TransactionHistory} onClick={() => handleLinkClick(ROUTES.TransactionHistory)}>
						<div className={styles.menuLink}>
							<Image src={icons.iconAddress} alt='Lịch sử giao dịch' width={20} height={20} className={styles.icon} />
							Lịch sử giao dịch
						</div>
					</Link>
				</li>
				<li className={`${styles.menuItem} ${activeLink === ROUTES.MyReview ? styles.active : ''}`}>
					<Link href={ROUTES.MyReview} onClick={() => handleLinkClick(ROUTES.MyReview)}>
						<div className={styles.menuLink}>
							<Image src={icons.medalStar} alt='Đánh giá của tôi' width={20} height={20} className={styles.icon} />
							Đánh giá của tôi
						</div>
					</Link>
				</li>
				<li className={`${styles.menuItem} ${activeLink === '/logout' ? styles.active : ''}`}>
					<div onClick={handleLogout} className={styles.menuLink} role='button' tabIndex={0}>
						<Image src={icons.logout} alt='Đăng xuất' width={20} height={20} className={styles.icon} />
						Đăng xuất
					</div>
				</li>
			</ul>
			{loading && <Loading fullScreen />}
		</div>
	);
};

export default SidebarProfile;
