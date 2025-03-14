import React from 'react';
import Image from 'next/image';
import styles from './Table.module.scss';

const Table = ({columns, data, actions}) => {
	return (
		<table className={styles.userTable}>
			<thead>
				<tr>
					{columns.map((col, index) => (
						<th key={index}>{col.label}</th>
					))}
					{actions && <th>Hành động</th>}
				</tr>
			</thead>
			<tbody>
				{data.map((row, index) => (
					<tr key={row.id}>
						{columns.map((col, i) => (
							<td key={i}>
								{col.key === 'role' ? (
									<span className={row.role === 'Quản trị' ? styles.adminRole : styles.userRole}>{row.role}</span>
								) : col.key === 'status' ? (
									<span className={styles.activeStatus}>{row.status}</span>
								) : (
									row[col.key]
								)}
							</td>
						))}
						{actions && (
							<td>
								{actions(row).map((action, i) => (
									<button key={i} className={styles.actionBtn}>
										<Image src={action.icon} alt={action.label} width={40} height={40} />
									</button>
								))}
							</td>
						)}
					</tr>
				))}
			</tbody>
		</table>
	);
};

export default Table;
