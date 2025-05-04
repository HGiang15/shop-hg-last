import React from 'react';
import styles from './Table.module.scss';

function Table({users, headers, renderActions, roleStyle, statusStyle}) {
	return (
		<div className={styles.tableWrapper}>
			<table className={styles.table}>
				<thead>
					<tr>
						{headers.map((header) => (
							<th key={header.key}>{header.label}</th>
						))}
						<th>Hành động</th>
					</tr>
				</thead>
				<tbody>
					{users.map((user, index) => (
						<tr key={`${user.id}-${index}`}>
							{headers.map((header) => (
								<td key={header.key}>
									{header.render ? (
										header.render(user) // render nếu là color
									) : header.key === 'role' ? (
										<span style={roleStyle}>{user[header.key]}</span>
									) : header.key === 'status' ? (
										<span style={statusStyle}>{user[header.key]}</span>
									) : (
										user[header.key]
									)}
								</td>
							))}

							<td>
								<div className={styles.actions}>{renderActions(user)}</div>
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
}

export default Table;
