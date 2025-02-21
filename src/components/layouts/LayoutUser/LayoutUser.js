import React, { Fragment } from 'react';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import styles from './LayoutUser.module.scss';

function LayoutUser({ children }) {
	return (
		<div className={styles.container}>
			<header>
				<Header />
			</header>

			<main className={styles.main}>{children}</main>

			<footer>
				<Footer />
			</footer>
		</div>
	);
}

export default LayoutUser;
