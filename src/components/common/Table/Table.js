import React from 'react';
import styles from './Table.module.scss';

function Table({users, headers, renderActions, roleStyle, statusStyle, renderCheckbox}) {
	return (
		<div className={styles.tableWrapper}>
			<table className={styles.table}>
				<thead>
					<tr>
						{renderCheckbox && <th>{headers.find((h) => h.key === 'checkbox')?.label}</th>}

						{headers
							.filter((header) => header.key !== 'checkbox')
							.map((header) => (
								<th key={header.key}>{header.label}</th>
							))}

						<th>Hành động</th>
					</tr>
				</thead>

				<tbody>
					{users.map((user, index) => (
						<tr key={`${user._id || user.id}-${index}`}>
							{renderCheckbox && <td>{renderCheckbox(user)}</td>}

							{headers
								.filter((header) => header.key !== 'checkbox')
								.map((header) => (
									<td key={header.key}>
										{header.render ? (
											header.render(user)
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
