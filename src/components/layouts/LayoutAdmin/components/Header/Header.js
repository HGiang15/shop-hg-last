import React, {useState} from 'react';
import Image from 'next/image';
import Tippy from '@tippyjs/react/headless';
import {HiOutlineUser, HiOutlineKey, HiOutlineLogout} from 'react-icons/hi';
import {HiOutlineMenuAlt2} from 'react-icons/hi';
import styles from './Header.module.scss';
import avatar from '../../../../../../public/static/images/auth/user.svg';

const Header = ({title}) => {
	const [visible, setVisible] = useState(false);

	const handleClick = () => {
		setVisible(!visible);
	};

	return (
		<header className={styles.container}>
			<div className={styles.left}>
				<HiOutlineMenuAlt2 className={styles.menuIcon} />
				{/* <h1 className={styles.title}>BÁO CÁO TỔNG QUAN</h1> */}
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
								<li>
									<HiOutlineLogout className={styles.icon} />
									Đăng xuất
								</li>
							</ul>
						</div>
					)}
				>
					<Image src={avatar} alt='Avatar' className={styles.avatar} onClick={handleClick} width={40} height={40} />
				</Tippy>
			</div>
		</header>
	);
};

export default Header;
