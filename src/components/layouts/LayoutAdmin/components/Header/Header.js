import React, {useState, useEffect} from 'react';
import {useRouter} from 'next/router';
import Image from 'next/image';
import {jwtDecode} from 'jwt-decode';
import Tippy from '@tippyjs/react/headless';
import {HiOutlineUser, HiOutlineKey, HiOutlineLogout} from 'react-icons/hi';
import {HiOutlineMenuAlt2} from 'react-icons/hi';
import Loading from '@/components/common/Loading/Loading';
import styles from './Header.module.scss';
import avatar from '../../../../../../public/static/images/auth/user.svg';
import {FaTimes} from 'react-icons/fa';

const Header = ({title, setMenuOpen, menuOpen}) => {
	const [visible, setVisible] = useState(false);
	const [user, setUser] = useState(null);
	const [loading, setLoading] = useState(false);
	const router = useRouter();

	const handleClick = () => {
		setVisible(!visible);
	};

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

	const handleLogout = () => {
		setLoading(true);
		localStorage.removeItem('token');
		setUser(null);

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
						<div className={styles.dropdown} tabIndex='-1' {...attrs}>
							<ul>
								<li>
									<HiOutlineUser className={styles.icon} />
									Thông tin cá nhân
								</li>
								<li>
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
						<Image src={avatar} alt='Avatar' className={styles.avatar} width={40} height={40} />
					</div>
				</Tippy>
			</div>

			{loading && <Loading fullScreen />}
		</header>
	);
};

export default Header;
