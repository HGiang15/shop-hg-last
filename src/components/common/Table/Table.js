import React from 'react';
import styles from './Table.module.scss';

function Table({users, headers, renderActions, roleStyle, statusStyle}) {
	return (
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
				{users.map((user) => (
					<tr key={user.id}>
						{headers.map((header) => (
							<td key={header.key}>
								{header.key === 'role' ? (
									<span style={roleStyle}>{user[header.key]}</span>
								) : header.key === 'status' ? (
									<span style={statusStyle}>{user[header.key]}</span>
								) : (
									user[header.key]
								)}
							</td>
						))}
						<td className={styles.actions}>{renderActions(user)}</td>
					</tr>
				))}
			</tbody>
		</table>
	);
}

export default Table;
