import React from 'react';
import styles from './FilterAdmin.module.scss';
import {toast} from 'react-toastify';

const FilterAdmin = ({
	searchTerm,
	setSearchTerm,
	sortOption,
	setSortOption,
	sortOptions = [],
	setCurrentPage,
	filters = [],
	selectedProducts = [],
	onDeleteMany = () => {},
	isAdmin = false,
}) => {
	return (
		<div className={styles.filterWrapper}>
			<input
				type='text'
				placeholder='Tìm kiếm theo tên...'
				value={searchTerm}
				onChange={(e) => {
					setSearchTerm(e.target.value);
					setCurrentPage(1);
				}}
				className={styles.searchInput}
			/>

			{sortOptions.length > 0 && (
				<select
					value={sortOption}
					onChange={(e) => {
						setSortOption(e.target.value);
						setCurrentPage(1);
					}}
					className={styles.sortSelect}
				>
					{sortOptions.map((option) => (
						<option key={option.value} value={option.value}>
							{option.label}
						</option>
					))}
				</select>
			)}

			{filters.map((filter) => (
				<select
					key={filter.name}
					value={filter.value}
					onChange={(e) => {
						filter.onChange(e.target.value);
						setCurrentPage(1);
					}}
					className={styles.sortSelect}
				>
					{filter.options.map((option) => (
						<option key={option.value} value={option.value}>
							{option.label}
						</option>
					))}
				</select>
			))}

			{/* Luôn hiển thị hành động, không phụ thuộc vào selectedProducts */}
			{isAdmin && (
				<select
					onChange={(e) => {
						if (e.target.value === 'deleteMany') {
							if (selectedProducts.length === 0) {
								toast.warn('Vui lòng chọn ít nhất 1 cái để xoá!');
							} else {
								onDeleteMany();
							}
						}
						e.target.value = ''; // reset dropdown
					}}
					defaultValue=''
					className={styles.sortSelect}
				>
					<option value=''>Hành động</option>
					<option value='deleteMany'>Xoá nhiều</option>
				</select>
			)}
		</div>
	);
};

export default FilterAdmin;
