import React from 'react';
import styles from './LayoutProfileUser.module.scss';
import SidebarProfile from './SidebarProfile/SidebarProfile';

const LayoutProfileUser = ({children}) => {
	return (
		<div className={styles.container}>
			<div className={styles.main}>
				<SidebarProfile />
				{children}
			</div>
		</div>
	);
};

export default LayoutProfileUser;
