import React, {useState, useEffect, useRef} from 'react';
import styles from './SidebarProfile.module.scss';
import {FaTimes} from 'react-icons/fa';
import icons from '@/constants/static/icons';
import images from '@/constants/static/images';
import Link from 'next/link';
import Image from 'next/image';
import {ROUTES} from '@/constants/config';
import {useRouter} from 'next/router';

const SidebarProfile = ({isOpen, onClose}) => {
	const router = useRouter();
	const [activeLink, setActiveLink] = useState(ROUTES.Profile);
	const sidebarRef = useRef(null);
	const [isClient, setIsClient] = useState(false);

	useEffect(() => {
		setIsClient(true);
		setActiveLink(router.asPath);
	}, [router.asPath]);

	const handleLinkClick = (route) => {
		setActiveLink(route);
		if (isClient && window.innerWidth < 768) {
			onClose(); // Đóng sidebar khi chọn link
		}
	};

	useEffect(() => {
		const handleClickOutside = (event) => {
			if (sidebarRef.current && !sidebarRef.current.contains(event.target) && isClient && window.innerWidth < 768 && isOpen) {
				onClose(); // Đóng sidebar khi click ra ngoài
			}
		};

		if (isClient) {
			document.addEventListener('mousedown', handleClickOutside);
			return () => {
				document.removeEventListener('mousedown', handleClickOutside);
			};
		}
	}, [isOpen, isClient, onClose]);

	return (
		<div ref={sidebarRef} className={`${styles.container} ${isOpen ? styles.open : styles.closed}`}>
			{isClient && window.innerWidth < 768 && isOpen && (
				<div className={styles.closeButton} onClick={onClose}>
					<FaTimes />
				</div>
			)}
			<div className={styles.profileHeader}>
				<Image src={images.user} alt='Avatar' width={60} height={60} className={styles.avatar} />
				<div className={styles.profileInfo}>
					<h2 className={styles.name}>Nguyễn Đăng Hoàng Giang</h2>
					<span className={styles.details}>Nam - </span>
					<span className={styles.details}>15/05/2003</span>
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
				<li className={`${styles.menuItem} ${activeLink === '/logout' ? styles.active : ''}`}>
					<Link href='#' onClick={() => handleLinkClick('/logout')}>
						<div className={styles.menuLink}>
							<Image src={icons.logout} alt='Đăng xuất' width={20} height={20} className={styles.icon} />
							Đăng xuất
						</div>
					</Link>
				</li>
			</ul>
		</div>
	);
};

export default SidebarProfile;
