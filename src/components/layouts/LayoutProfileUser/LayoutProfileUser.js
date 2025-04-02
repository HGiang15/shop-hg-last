import React from 'react';
import Breadcrumb from '@/components/common/Breadcrumb/Breadcrumb';
import styles from './LayoutProfileUser.module.scss';
import SidebarProfile from './SidebarProfile/SidebarProfile';

const LayoutProfileUser = ({children, breadcrumbItems = {titles: [], listHref: []}}) => {
	if (!breadcrumbItems.titles || !breadcrumbItems.listHref) {
		return <div>Invalid breadcrumb data</div>;
	}
	return (
		<div className={styles.container}>
			{/* Nhận breadcrumbItems từ props và truyền vào Breadcrumb */}
			<Breadcrumb titles={breadcrumbItems.titles} listHref={breadcrumbItems.listHref} />

			<div className={styles.main}>
				<SidebarProfile />
				{children}
			</div>
		</div>
	);
};

export default LayoutProfileUser;
