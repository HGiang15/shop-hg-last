import React, {useState} from 'react';
import Header from './components/Header/Header';
import MenuTab from './components/MenuTab/MenuTab';
import styles from './LayoutAdmin.module.scss';

const LayoutAdmin = ({children, title}) => {
	const [menuOpen, setMenuOpen] = useState(false);

	return (
		<div className={styles.container}>
			<div className={styles.header}>
				<Header title={title} setMenuOpen={setMenuOpen} menuOpen={menuOpen} />
			</div>

			<div className={`${styles.menuTab} ${menuOpen ? styles.menuTabOpen : ''}`}>
				<MenuTab menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
			</div>

			<div className={styles.main}>{children}</div>
		</div>
	);
};

export default LayoutAdmin;
