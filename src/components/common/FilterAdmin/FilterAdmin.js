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
	onDeleteMany = null,
	isAdmin = false,
	startDate,
	setStartDate,
	endDate,
	setEndDate,
	showDateFilter = false,
	placeholderSearch = 'Tìm kiếm...',
}) => {
	const handleSearchChange = (e) => {
		setSearchTerm(e.target.value);
		setCurrentPage(1);
	};

	const handleSortChange = (e) => {
		setSortOption(e.target.value);
		setCurrentPage(1);
	};

	const handleStartDateChange = (e) => {
		setStartDate(e.target.value);
		setCurrentPage(1);
	};

	const handleEndDateChange = (e) => {
		setEndDate(e.target.value);
		setCurrentPage(1);
	};

	return (
		<div className={styles.filterWrapper}>
			<input
				type='text'
				placeholder={placeholderSearch}
				value={searchTerm}
				onChange={handleSearchChange}
				className={styles.searchInput}
			/>

			{/* Sort Options */}
			{sortOptions.length > 0 && (
				<select value={sortOption} onChange={handleSortChange} className={styles.sortSelect}>
					{sortOptions.map((option) => (
						<option key={option.value} value={option.value}>
							{option.label}
						</option>
					))}
				</select>
			)}

			{/* Custom Filters (if any, from `filters` prop) */}
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

			{showDateFilter && (
				<div className={styles.dateFilterGroup}>
					<input type='date' value={startDate} onChange={handleStartDateChange} className={styles.dateInput} title='Từ ngày' />
					<input
						type='date'
						value={endDate}
						onChange={handleEndDateChange}
						className={styles.dateInput}
						min={startDate}
						title='Đến ngày'
					/>
				</div>
			)}

			{isAdmin && onDeleteMany && (
				<select
					onChange={(e) => {
						if (e.target.value === 'deleteMany') {
							if (selectedProducts.length === 0) {
								toast.warn('Vui lòng chọn ít nhất 1 cái để xoá!');
							} else {
								onDeleteMany();
							}
						}
						e.target.value = '';
					}}
					defaultValue=''
					className={styles.sortSelect}
				>
					<option value=''>Hành động</option>
					<option value='deleteMany'>Xoá nhiều ({selectedProducts.length})</option>
				</select>
			)}
		</div>
	);
};

export default FilterAdmin;
