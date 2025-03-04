import React, {useState} from 'react';
import styles from './FilterProduct.module.scss';

const FilterProduct = () => {
	const [selectedCategories, setSelectedCategories] = useState([]);
	const [selectedColors, setSelectedColors] = useState([]);

	const categories = ['Quần nam', 'Áo khoác', 'Áo thun', 'Chân váy'];
	const colors = ['Màu đỏ', 'Màu xanh', 'Màu tím', 'Màu vàng'];

	const handleCategoryChange = (category) => {
		setSelectedCategories((prev) => (prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category]));
	};

	const handleColorChange = (color) => {
		setSelectedColors((prev) => (prev.includes(color) ? prev.filter((c) => c !== color) : [...prev, color]));
	};

	return (
		<div className={styles.filterContainer}>
			{/* Filter Product */}
			<div className={styles.filterSection}>
				<h3 className={styles.filterHeading}>DANH MỤC SẢN PHẨM</h3>
				<div className={styles.divider}></div>
				<label className={styles.filterLabel}>
					<input type='checkbox' checked={selectedCategories.length === 0} readOnly />
					<span className={styles.customCheckbox}></span>
					Tất cả
				</label>
				{categories.map((category) => (
					<label className={styles.filterLabel} key={category}>
						<input
							type='checkbox'
							checked={selectedCategories.includes(category)}
							onChange={() => handleCategoryChange(category)}
						/>
						<span className={styles.customCheckbox}></span>
						{category}
					</label>
				))}
			</div>

			{/* Filter Color */}
			<div className={styles.filterSection}>
				<h3 className={styles.filterHeading}>MÀU SẮC SẢN PHẨM</h3>
				<div className={styles.divider}></div>
				<label className={styles.filterLabel}>
					<input type='checkbox' checked={selectedColors.length === 0} readOnly />
					<span className={styles.customCheckbox}></span>
					Tất cả
				</label>
				{colors.map((color) => (
					<label className={styles.filterLabel} key={color}>
						<input type='checkbox' checked={selectedColors.includes(color)} onChange={() => handleColorChange(color)} />
						<span className={styles.customCheckbox}></span>
						{color}
					</label>
				))}
			</div>
		</div>
	);
};

export default FilterProduct;
