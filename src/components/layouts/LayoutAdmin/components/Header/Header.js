import React, {useState, useEffect} from 'react';
import {useRouter} from 'next/router';
import Image from 'next/image';
import {jwtDecode} from 'jwt-decode';
import Tippy from '@tippyjs/react/headless';
import {HiOutlineUser, HiOutlineKey, HiOutlineLogout, HiOutlineMenuAlt2} from 'react-icons/hi';
import Loading from '@/components/common/Loading/Loading';
import styles from './Header.module.scss';
import {FaTimes} from 'react-icons/fa';
import images from '@/constants/static/images';
import {ROUTES} from '@/constants/config';
import {getCurrentUser} from '@/services/authService';
import {useDispatch} from 'react-redux';
import {logout} from '@/redux/slices/authSlice';
import {clearUserInfo} from '@/redux/slices/userSlice';

const Header = ({title, setMenuOpen, menuOpen}) => {
	const [visible, setVisible] = useState(false);
	const [user, setUser] = useState(null);
	const [loading, setLoading] = useState(false);
	const router = useRouter();
	const dispatch = useDispatch();

	const handleClick = () => {
		setVisible(!visible);
	};

	useEffect(() => {
		const fetchUser = async () => {
			const token = localStorage.getItem('token');
			if (!token) return;

			try {
				const decoded = jwtDecode(token);
				const userData = await getCurrentUser();

				setUser({
					...decoded,
					name: userData.name,
					avatar: userData.avatar,
				});
			} catch (error) {
				console.error('Lỗi khi lấy thông tin người dùng', error);
				localStorage.removeItem('token');
			}
		};

		fetchUser();
	}, []);

	const handleLogout = () => {
		setLoading(true);

		localStorage.removeItem('token');
		localStorage.removeItem('persist:root');

		// Cập nhật Redux
		dispatch(logout()); // Reset authSlice
		dispatch(clearUserInfo()); // Reset userSlice

		setUser(null); // Reset local user trong component

		setTimeout(() => {
			setLoading(false);
			router.push('/');
		}, 1500);
	};

	const handleMenuToggle = () => {
		setMenuOpen(!menuOpen);
	};

	return (
		<header className={styles.container}>
			<div className={styles.left}>
				<div className={styles.menuIcon} onClick={handleMenuToggle}>
					{menuOpen ? <FaTimes /> : <HiOutlineMenuAlt2 />}
				</div>
				<h1 className={styles.title}>{title}</h1>
			</div>
			<div className={styles.right}>
				<Tippy
					interactive
					visible={visible}
					onClickOutside={() => setVisible(false)}
					offset={[0, 5]}
					render={(attrs) => (
						<div className={styles.dropdown} tabIndex='-1' ref={attrs.ref} {...attrs}>
							<ul>
								<li
									onClick={() => {
										router.push(ROUTES.AdminProfile);
										setVisible(false);
									}}
								>
									<HiOutlineUser className={styles.icon} />
									Thông tin cá nhân
								</li>
								<li
									onClick={() => {
										router.push(ROUTES.AdminChangePassword);
										setVisible(false);
									}}
								>
									<HiOutlineKey className={styles.icon} />
									Đổi mật khẩu
								</li>

								<li onClick={handleLogout}>
									<HiOutlineLogout className={styles.icon} />
									Đăng xuất
								</li>
							</ul>
						</div>
					)}
				>
					<div className={styles.userInfo} onClick={handleClick}>
						{user?.name && <span className={styles.userName}>{user.name}</span>}
						<Image src={user?.avatar || images.defaultAvatar} alt='Avatar' className={styles.avatar} width={40} height={40} />
					</div>
				</Tippy>
			</div>
			{loading && <Loading fullScreen />}
		</header>
	);
};

export default Header;
