import React, {useEffect} from 'react';
import styles from './MainPageOrder.module.scss';
import Breadcrumb from '@/components/common/Breadcrumb/Breadcrumb';

const MainPageOrder = ({breadcrumbItems = {titles: [], listHref: []}}) => {
	useEffect(() => {
		if (!Array.isArray(breadcrumbItems.titles) || !Array.isArray(breadcrumbItems.listHref)) {
			console.error('Invalid breadcrumb data');
		}
	}, [breadcrumbItems]);

	return (
		<div className={styles.container}>
			<Breadcrumb titles={breadcrumbItems.titles} listHref={breadcrumbItems.listHref} />
			<div className={styles.main}>MainPageOrder</div>
		</div>
	);
};

export default MainPageOrder;
