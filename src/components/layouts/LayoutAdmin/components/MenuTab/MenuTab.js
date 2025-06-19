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
import {ROUTES} from '@/constants/config';
import {FaTimes} from 'react-icons/fa';
import {connect} from 'react-redux';
import {AirplaneTicketTwoTone, ContactMail, Password, Settings, StarBorderOutlined} from '@mui/icons-material';
import images from '@/constants/static/images';

const menuItems = [
	{label: 'Tổng quan', icon: <DashboardIcon />, path: ROUTES.AdminDashboard},
	{label: 'Người dùng', icon: <PeopleIcon />, path: ROUTES.AdminUser},
	{label: 'Màu sản phẩm', icon: <PaletteIcon />, path: ROUTES.AdminColor},
	{label: 'Kích cỡ sản phẩm', icon: <FormatSizeIcon />, path: ROUTES.AdminSize},
	{label: 'Danh mục sản phẩm', icon: <CategoryIcon />, path: ROUTES.AdminCategory},
	{label: 'Quản lý sản phẩm', icon: <InventoryIcon />, path: ROUTES.AdminProduct},
	{label: 'Quản lý đơn hàng', icon: <ShoppingCartIcon />, path: ROUTES.AdminOrder},
	{label: 'Quản lý đánh giá', icon: <StarBorderOutlined />, path: ROUTES.AdminReview},
	{label: 'Quản lý voucher', icon: <AirplaneTicketTwoTone />, path: ROUTES.AdminVoucher},
	{label: 'Quản lý liên hệ', icon: <ContactMail />, path: ROUTES.AdminContact},
	{label: 'Thông tin cá nhân', icon: <Settings />, path: ROUTES.AdminProfile},
	{label: 'Đổi mật khẩu', icon: <Password />, path: ROUTES.AdminChangePassword},
];

const MenuTab = ({menuOpen, setMenuOpen, activeMenu}) => {
	const router = useRouter();

	const handleClose = () => {
		setMenuOpen(false);
	};

	return (
		<div className={styles.menuTab}>
			{menuOpen && (
				<div className={styles.closeButton} onClick={handleClose}>
					<FaTimes />
				</div>
			)}
			<div className={styles.logo}>
				<Image src={images.logoSmall} alt='Logo' width={120} height={50} />
			</div>

			<ul className={styles.menuList}>
				{menuItems.map((item, index) => {
					const isActive =
						item.path === ROUTES.AdminProduct
							? router.pathname.startsWith(ROUTES.AdminProduct) || activeMenu === ROUTES.AdminProductCreate // Kiểm tra cả pathname và activeMenu
							: router.pathname === item.path || activeMenu === item.path;

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

const mapStateToProps = (state) => ({
	activeMenu: state.menu.activeMenu, // Lấy trạng thái activeMenu từ reducer 'menu'
});

export default connect(mapStateToProps)(MenuTab);
