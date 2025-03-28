import React, {useState} from 'react';
import Image from 'next/image';
import images from '@/constants/static/images';
import styles from './CategoryHome.module.scss';

const categories = [
	{id: 1, name: 'Áo CLB', image: images.product1},
	{id: 2, name: 'Áo đội tuyển', image: images.product8},
	{id: 3, name: 'Áo không logo', image: images.product10},
	{id: 4, name: 'Giày đá bóng', image: images.product11},
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
