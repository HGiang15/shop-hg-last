import React from 'react';
import Link from 'next/link';
import styles from './LayoutPages.module.scss';
import {useRouter} from 'next/router';

const LayoutPages = ({listPages = [], children}) => {
	const router = useRouter();

	return (
		<div className={styles.wrapper}>
			<div className={styles.navTab}>
				{listPages.map((page, index) => {
					const isActive = router.pathname === page.path;
					return (
						<Link key={index} href={page.path} className={`${styles.tabItem} ${isActive ? styles.active : ''}`}>
							{page.title}
						</Link>
					);
				})}
			</div>
			<div className={styles.content}>{children}</div>
		</div>
	);
};

export default LayoutPages;
