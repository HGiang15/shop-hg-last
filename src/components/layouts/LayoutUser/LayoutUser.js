import React, { Fragment } from 'react';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import styles from './LayoutUser.module.scss';

function LayoutUser({ children }) {
	return (
		<Fragment>
			<header className={styles.header}>
				<Header />
			</header>

			<main className={styles.main}>{children}</main>

			<footer>
				<Footer />
			</footer>
		</Fragment>
	);
}

export default LayoutUser;
