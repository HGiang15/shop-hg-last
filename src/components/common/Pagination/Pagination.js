import React from 'react';
import styles from './Pagination.module.scss';

function Pagination({currentPage, totalPages, onPageChange}) {
	const pages = [];
	for (let i = 1; i <= totalPages; i++) {
		pages.push(
			<button key={i} onClick={() => onPageChange(i)} className={`${styles.pageButton} ${currentPage === i ? styles.active : ''}`}>
				{i}
			</button>
		);
	}

	return <div className={styles.pagination}>{pages}</div>;
}

export default Pagination;
