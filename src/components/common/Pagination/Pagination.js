import React from 'react';
import styles from './Pagination.module.scss';

function Pagination({currentPage, totalPages, onPageChange, totalItems, onLimitChange, limit}) {
	const pages = [];
	for (let i = 1; i <= totalPages; i++) {
		pages.push(
			<button key={i} onClick={() => onPageChange(i)} className={`${styles.pageButton} ${currentPage === i ? styles.active : ''}`}>
				{i}
			</button>
		);
	}

	return (
		<div className={styles.pagination}>
			<div className={styles.pageNumbers}>{pages}</div>
			<div className={styles.limitSelect}>
				<label htmlFor='limitSelect'>Hiển thị mỗi trang:</label>

				<select onChange={(e) => onLimitChange(Number(e.target.value))} value={limit}>
					{![5, 8, 10, 20, 30].includes(limit) && <option value={limit}>{limit}</option>}
					<option value={5}>5</option>
					<option value={8}>8</option>
					<option value={10}>10</option>
					<option value={20}>20</option>
					<option value={30}>30</option>
				</select>
			</div>
			<div className={styles.totalItems}>
				Hiển thị {(currentPage - 1) * limit + 1}–{Math.min(currentPage * limit, totalItems)} trong tổng số {totalItems} kết quả
			</div>
		</div>
	);
}

export default Pagination;
