import React, {useState, useEffect} from 'react';
import {FaBarsProgress} from 'react-icons/fa6';
import Breadcrumb from '@/components/common/Breadcrumb/Breadcrumb';
import styles from './LayoutProfileUser.module.scss';
import SidebarProfile from './SidebarProfile/SidebarProfile';
import RequireAuth from '@/components/protected/RequireAuth';

const LayoutProfileUser = ({children, breadcrumbItems = {titles: [], listHref: []}}) => {
	const [isSidebarOpen, setIsSidebarOpen] = useState(false);
	const [isMobile, setIsMobile] = useState(false);

	useEffect(() => {
		const handleResize = () => {
			setIsMobile(window.innerWidth < 768);
		};
		handleResize();
		window.addEventListener('resize', handleResize);

		return () => {
			window.removeEventListener('resize', handleResize);
		};
	}, []);

	if (!Array.isArray(breadcrumbItems.titles) || !Array.isArray(breadcrumbItems.listHref)) {
		return <div>Invalid breadcrumb data</div>;
	}

	const handleToggleSidebar = () => {
		setIsSidebarOpen(!isSidebarOpen);
	};

	return (
		<RequireAuth>
			<div className={styles.container}>
				<Breadcrumb titles={breadcrumbItems.titles} listHref={breadcrumbItems.listHref} />

				<div className={styles.main}>
					<SidebarProfile isOpen={isSidebarOpen} onClose={handleToggleSidebar} />
					<div className={`${styles.children} ${isSidebarOpen && isMobile ? styles.childrenBlurred : ''}`}>{children}</div>
					{isMobile && !isSidebarOpen && (
						<div className={styles.toggleButton} onClick={handleToggleSidebar}>
							<FaBarsProgress className={styles.iconBars} />
						</div>
					)}
					{isSidebarOpen && isMobile && <div className={styles.overlay} onClick={handleToggleSidebar} />}
				</div>
			</div>
		</RequireAuth>
	);
};

export default LayoutProfileUser;
