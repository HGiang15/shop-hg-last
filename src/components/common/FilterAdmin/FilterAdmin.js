import React from 'react';
import styles from './FilterAdmin.module.scss';

const FilterAdmin = ({searchTerm, setSearchTerm, sortOption, setSortOption, sortOptions = [], setCurrentPage, filters = []}) => {
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
		</div>
	);
};

export default FilterAdmin;
