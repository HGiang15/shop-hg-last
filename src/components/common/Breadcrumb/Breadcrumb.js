import Link from 'next/link';
import styles from './Breadcrumb.module.scss';

const Breadcrumb = ({items}) => {
	return (
		<div className={styles.container}>
			<nav className={styles.breadcrumb}>
				{items.map((item, index) => (
					<span key={index}>
						{item.link ? (
							<Link href={item.link} className={styles.link}>
								{item.label}
							</Link>
						) : (
							<span className={styles.active}>{item.label}</span>
						)}
						{index < items.length - 1 && <span className={styles.separator}>›</span>}
					</span>
				))}
			</nav>
		</div>
	);
};

export default Breadcrumb;
