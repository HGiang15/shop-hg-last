import {Fragment} from 'react';
import {RiArrowRightSLine} from 'react-icons/ri';
import clsx from 'clsx';
import styles from './Breadcrumb.module.scss';
import Link from 'next/link';

function Breadcrumb({titles, listHref}) {
	if (!Array.isArray(titles) || !Array.isArray(listHref)) {
		return <div>Invalid breadcrumb data</div>;
	}

	return (
		<div className={styles.container}>
			{titles.map((v, i) => (
				<Fragment key={i}>
					{i !== 0 ? (
						<span className={styles.icon}>
							<RiArrowRightSLine />
						</span>
					) : null}
					{titles.length - 1 === i ? (
						<span className={clsx(styles.item, styles.last)}>{v}</span>
					) : (
						<Link
							href={listHref[i] || '/'}
							className={clsx(styles.item, {
								[styles.last]: i === titles.length - 1,
							})}
						>
							{v}
						</Link>
					)}
				</Fragment>
			))}
		</div>
	);
}

export default Breadcrumb;
