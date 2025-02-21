import React from 'react';
import Link from 'next/link';
import styles from './Header.module.scss';
import Image from 'next/image';
import logo from '../../../../../../public/static/images/logo_small.svg';
import LayoutGrid from '@/components/layouts/LayoutGrid/LayoutGrid';

function Header() {
	return (
		<div className={styles.header}>
			{/* Menu */}
			<nav className={styles.header__nav}>
				<ul className={styles.nav__list}>
					<li className={styles.nav__item}>
						{/* Logo */}
						<div className={styles.header__logo}>
							<Link href='/'>
								<Image className={styles.logo_home} src={logo} alt='Logo' />
							</Link>
						</div>
					</li>

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
				</ul>
			</nav>

			{/* action */}
			<div className={styles.header__auth}>
				<Link href='/login'>
					<button className={styles.auth__login}>Đăng nhập</button>
				</Link>
				<Link href='/register'>
					<button className={styles.auth__register}>Đăng ký</button>
				</Link>
			</div>
		</div>
	);
}

export default Header;
