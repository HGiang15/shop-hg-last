import React, { useState } from 'react';
import Image from 'next/image';
import styles from './CategoryHome.module.scss';
import product1 from '../../../../../../public/static/images/product_1.webp';
import product2 from '../../../../../../public/static/images/product_2.webp';
import product3 from '../../../../../../public/static/images/product_3.webp';
import product4 from '../../../../../../public/static/images/product_4.webp';

const categories = [
  { id: 1, name: 'Quần nam', image: product1 },
  { id: 2, name: 'Áo khoác', image: product2 },
  { id: 3, name: 'Áo thun', image: product3 },
  { id: 4, name: 'Chân váy', image: product4 },
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
