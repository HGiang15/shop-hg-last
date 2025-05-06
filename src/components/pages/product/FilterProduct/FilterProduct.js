import React, {useEffect, useState} from 'react';
import styles from './FilterProduct.module.scss';
import {getAllCategories} from '@/services/categoryService';
import {getAllColors} from '@/services/colorService';
import {useRouter} from 'next/router';

const FilterProduct = ({selectedCategories, setSelectedCategories, selectedColors, setSelectedColors}) => {
	const router = useRouter();

	const [categories, setCategories] = useState([]);
	const [colors, setColors] = useState([]);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const categoryData = await getAllCategories();
				const colorData = await getAllColors();
				setCategories(categoryData);
				setColors(colorData);
			} catch (error) {
				console.error('Lỗi khi tải danh mục hoặc màu:', error);
			}
		};

		fetchData();
	}, []);

	useEffect(() => {
		const {category, colors} = router.query;

		if (category) {
			setSelectedCategories(Array.isArray(category) ? category : category.split(','));
		}
		if (colors) {
			setSelectedColors(Array.isArray(colors) ? colors : colors.split(','));
		}
	}, [router.query]);

	const handleCategoryChange = (category) => {
		const newCategories = selectedCategories.includes(category)
			? selectedCategories.filter((c) => c !== category)
			: [...selectedCategories, category];

		setSelectedCategories(newCategories);

		const query = {
			...router.query,
			category: newCategories.join(','),
		};
		router.push({pathname: router.pathname, query}, undefined, {shallow: true});
	};

	const handleColorChange = (color) => {
		const newColors = selectedColors.includes(color) ? selectedColors.filter((c) => c !== color) : [...selectedColors, color];

		setSelectedColors(newColors);

		const query = {
			...router.query,
			colors: newColors.join(','),
		};
		router.push({pathname: router.pathname, query}, undefined, {shallow: true});
	};

	return (
		<div className={styles.filterContainer}>
			<div className={styles.filterSection}>
				<h3 className={styles.filterHeading}>DANH MỤC SẢN PHẨM</h3>
				<div className={styles.divider}></div>
				<label className={styles.filterLabel}>
					<input
						type='checkbox'
						checked={selectedCategories.length === 0}
						onChange={() => {
							setSelectedCategories([]);
							const query = {...router.query};
							delete query.category; // Xóa khỏi query
							router.push({pathname: router.pathname, query}, undefined, {shallow: true});
						}}
					/>
					<span className={styles.customCheckbox}></span>
					Tất cả
				</label>
				{categories.map((category) => (
					<label className={styles.filterLabel} key={category._id}>
						<input
							type='checkbox'
							checked={selectedCategories.includes(category.name)}
							onChange={() => handleCategoryChange(category.name)}
						/>
						<span className={styles.customCheckbox}></span>
						{category.name}
					</label>
				))}
			</div>

			<div className={styles.filterSection}>
				<h3 className={styles.filterHeading}>MÀU SẮC SẢN PHẨM</h3>
				<div className={styles.divider}></div>
				<label className={styles.filterLabel}>
					<input
						type='checkbox'
						checked={selectedColors.length === 0}
						onChange={() => {
							setSelectedColors([]);
							const query = {...router.query};
							delete query.colors;
							router.push({pathname: router.pathname, query}, undefined, {shallow: true});
						}}
					/>
					<span className={styles.customCheckbox}></span>
					Tất cả
				</label>

				{colors.map((color) => (
					<label className={styles.filterLabel} key={color._id}>
						<input
							type='checkbox'
							checked={selectedColors.includes(color.name)}
							onChange={() => handleColorChange(color.name)}
						/>
						<span className={styles.customCheckbox}></span>
						{color.name}
					</label>
				))}
			</div>
		</div>
	);
};

export default FilterProduct;
