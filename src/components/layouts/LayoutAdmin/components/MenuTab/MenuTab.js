import React from 'react';
import {useRouter} from 'next/router';
import styles from './MenuTab.module.scss';
import Image from 'next/image';
import Link from 'next/link';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import PaletteIcon from '@mui/icons-material/Palette';
import FormatSizeIcon from '@mui/icons-material/FormatSize';
import CategoryIcon from '@mui/icons-material/Category';
import InventoryIcon from '@mui/icons-material/Inventory';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import logo from '../../../../../../public/static/images/logo_small.svg';
import {ROUTES} from '@/constants/config';

const menuItems = [
	{label: 'Tổng quan', icon: <DashboardIcon />, path: ROUTES.AdminDashboard},
	{label: 'Người dùng', icon: <PeopleIcon />, path: ROUTES.AdminUser},
	{label: 'Màu sản phẩm', icon: <PaletteIcon />, path: '/admin/colors'},
	{label: 'Kích cỡ sản phẩm', icon: <FormatSizeIcon />, path: '/admin/sizes'},
	{label: 'Danh mục sản phẩm', icon: <CategoryIcon />, path: '/admin/categories'},
	{label: 'Quản lý sản phẩm', icon: <InventoryIcon />, path: '/admin/products'},
	{label: 'Quản lý đơn hàng', icon: <ShoppingCartIcon />, path: '/admin/orders'},
];

const MenuTab = ({menuOpen}) => {
	const router = useRouter();

	return (
		<div className={styles.menuTab}>
			<div className={styles.logo}>
				<Image src={logo} alt='Logo' width={120} height={50} />
			</div>

			<ul className={styles.menuList}>
				{menuItems.map((item, index) => {
					const isActive = router.pathname === item.path;

					return (
						<li key={index} className={isActive ? styles.active : ''}>
							<Link href={item.path} className={styles.menuItem}>
								{item.icon}
								<span>{item.label}</span>
							</Link>
						</li>
					);
				})}
			</ul>
		</div>
	);
};

export default MenuTab;
