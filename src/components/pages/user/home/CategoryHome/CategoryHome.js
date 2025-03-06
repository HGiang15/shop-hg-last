import React, {useState} from 'react';
import Image from 'next/image';
import styles from './CategoryHome.module.scss';
import product1 from '../../../../../../public/static/images/products/ao_clb/mu_01.webp';
import product2 from '../../../../../../public/static/images/products/ao_doituyen/eng_01.webp';
import product3 from '../../../../../../public/static/images/products/ao_kologo/kologo_01.webp';
import product4 from '../../../../../../public/static/images/products/giay_db/nike_01.webp';

const categories = [
	{id: 1, name: 'Áo CLB', image: product1},
	{id: 2, name: 'Áo đội tuyển', image: product2},
	{id: 3, name: 'Áo không logo', image: product3},
	{id: 4, name: 'Giày đá bóng', image: product4},
];

const CategoryHome = () => {
	const [activeCategory, setActiveCategory] = useState(categories[0].id);

	return (
		<div className={styles.container}>
			<h2 className={styles.categoryTitle}>Danh mục sản phẩm</h2>
			<div className={styles.categoryList}>
				{categories.map((category) => (
					<div
						key={category.id}
						className={`${styles.categoryItem} ${activeCategory === category.id ? styles.active : ''}`}
						onClick={() => setActiveCategory(category.id)}
					>
						<span className={styles.categoryName}>{category.name}</span>
						<Image src={category.image} alt={category.name} width={80} height={80} />
					</div>
				))}
			</div>
		</div>
	);
};

export default CategoryHome;
