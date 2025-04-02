import React from 'react';
import styles from './MainPageProduct.module.scss';
import Breadcrumb from '@/components/common/Breadcrumb/Breadcrumb';
import FilterProduct from '../FilterProduct/FilterProduct';
import ProductCard from '../ProductCard/ProductCard';

const MainPageProduct = ({breadcrumbItems = {titles: [], listHref: []}}) => {
	if (!Array.isArray(breadcrumbItems.titles) || !Array.isArray(breadcrumbItems.listHref)) {
		return <div>Invalid breadcrumb data</div>;
	}
	return (
		<div className={styles.container}>
			<Breadcrumb titles={breadcrumbItems.titles} listHref={breadcrumbItems.listHref} />

			<div className={styles.main}>
				<FilterProduct />
				<ProductCard />
			</div>
		</div>
	);
};

export default MainPageProduct;
