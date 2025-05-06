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
				<label>Hiển thị: </label>
				<select onChange={(e) => onLimitChange(Number(e.target.value))} value={limit}>
					<option value={8}>8</option>
					<option value={12}>12</option>
					<option value={20}>20</option>
					<option value={30}>30</option>
				</select>
			</div>
			<div className={styles.totalItems}>
				Hiển thị {currentPage} trong tổng số {totalItems} kết quả
			</div>
		</div>
	);
}

export default Pagination;
