import React, {useState} from 'react';
import Header from './components/Header/Header';
import MenuTab from './components/MenuTab/MenuTab';
import styles from './LayoutAdmin.module.scss';

const LayoutAdmin = ({children, title}) => {
	return (
		<div className={styles.container}>
			<div className={styles.header}>
				<Header title={title} />
			</div>

			<div className={styles.menuTab}>
				<MenuTab />
			</div>

			<div className={styles.main}>{children}</div>
		</div>
	);
};

export default LayoutAdmin;
