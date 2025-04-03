import React, {useState, useEffect} from 'react';
import Breadcrumb from '@/components/common/Breadcrumb/Breadcrumb';
import styles from './LayoutProfileUser.module.scss';
import SidebarProfile from './SidebarProfile/SidebarProfile';
import icons from '@/constants/static/icons';
import Image from 'next/image';

const LayoutProfileUser = ({children, breadcrumbItems = {titles: [], listHref: []}}) => {
	const [isSidebarOpen, setIsSidebarOpen] = useState(false);
	const [isClient, setIsClient] = useState(false);

	useEffect(() => {
		setIsClient(true);
	}, []);

	if (!Array.isArray(breadcrumbItems.titles) || !Array.isArray(breadcrumbItems.listHref)) {
		return <div>Invalid breadcrumb data</div>;
	}

	const handleToggleSidebar = () => {
		setIsSidebarOpen(!isSidebarOpen);
	};

	return (
		<div className={styles.container}>
			<Breadcrumb titles={breadcrumbItems.titles} listHref={breadcrumbItems.listHref} />

			<div className={styles.main}>
				<SidebarProfile isOpen={isSidebarOpen} onClose={handleToggleSidebar} />
				<div className={`${styles.children} ${isSidebarOpen && isClient && window.innerWidth < 768 ? styles.childrenBlurred : ''}`}>
					{children}
				</div>
				{isClient && window.innerWidth < 768 && !isSidebarOpen && (
					<div className={styles.toggleButton} onClick={handleToggleSidebar}>
						{/* {console.log(icons.menu)} */}
						<Image src={icons.menu} alt='Menu' width={24} height={24} style={{filter: 'brightness(0)'}} />
					</div>
				)}
				{isSidebarOpen && isClient && window.innerWidth < 768 && <div className={styles.overlay} onClick={handleToggleSidebar} />}
			</div>
		</div>
	);
};

export default LayoutProfileUser;
