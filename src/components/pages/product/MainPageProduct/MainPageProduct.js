import React, {useState} from 'react';
import styles from './MainPageProduct.module.scss';
import Breadcrumb from '@/components/common/Breadcrumb/Breadcrumb';
import FilterProduct from '../FilterProduct/FilterProduct';
import ProductCard from '../ProductCard/ProductCard';

const MainPageProduct = ({breadcrumbItems = {titles: [], listHref: []}}) => {
	const [selectedCategories, setSelectedCategories] = useState([]);
	const [selectedColors, setSelectedColors] = useState([]);

	if (!Array.isArray(breadcrumbItems.titles) || !Array.isArray(breadcrumbItems.listHref)) {
		return <div>Invalid breadcrumb data</div>;
	}

	return (
		<div className={styles.container}>
			<Breadcrumb titles={breadcrumbItems.titles} listHref={breadcrumbItems.listHref} />

			<div className={styles.main}>
				<FilterProduct
					selectedCategories={selectedCategories}
					setSelectedCategories={setSelectedCategories}
					selectedColors={selectedColors}
					setSelectedColors={setSelectedColors}
				/>
				<ProductCard selectedCategories={selectedCategories} selectedColors={selectedColors} />
			</div>
		</div>
	);
};

export default MainPageProduct;
