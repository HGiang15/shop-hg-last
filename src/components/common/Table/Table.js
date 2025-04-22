import React, {useEffect, useRef, useState} from 'react';
import styles from './Table.module.scss';
import {ChromePicker} from 'react-color';

function Table({users, headers, renderActions, roleStyle, statusStyle}) {
	const [selectedColors, setSelectedColors] = useState({});
	const [showColorPickers, setShowColorPickers] = useState({});

	const handleColorChange = (color, id) => {
		setSelectedColors({...selectedColors, [id]: color.hex});
	};

	const handleColorClick = (id) => {
		setShowColorPickers({...showColorPickers, [id]: !showColorPickers[id]});
	};

	const pickerRefs = useRef({});

	useEffect(() => {
		const handleClickOutside = (event) => {
			Object.keys(showColorPickers).forEach((id) => {
				if (showColorPickers[id] && pickerRefs.current[id] && !pickerRefs.current[id].contains(event.target)) {
					setShowColorPickers({...showColorPickers, [id]: false});
				}
			});
		};

		document.addEventListener('mousedown', handleClickOutside);
		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, [showColorPickers]);

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
							{headers.map((header) => {
								if (header.key === 'colorCode') {
									return (
										<td key={header.key}>
											<div className={styles.colorPickerContainer}>
												<div
													className={styles.colorDisplay}
													style={{
														backgroundColor: selectedColors[user.id] || '#ff0000',
													}}
													onClick={() => handleColorClick(user.id)}
												></div>
												{showColorPickers[user.id] && (
													<div
														className={styles.chromePickerWrapper}
														ref={(el) => (pickerRefs.current[user.id] = el)}
													>
														<ChromePicker
															color={selectedColors[user.id] || '#ff0000'}
															onChange={(color) => handleColorChange(color, user.id)}
														/>
													</div>
												)}
												<p className={styles.colorHex}>{selectedColors[user.id] || '#ff0000'}</p>
											</div>
										</td>
									);
								} else {
									return (
										<td key={header.key}>
											{header.key === 'role' ? (
												<span style={roleStyle}>{user[header.key]}</span>
											) : header.key === 'status' ? (
												<span style={statusStyle}>{user[header.key]}</span>
											) : (
												user[header.key]
											)}
										</td>
									);
								}
							})}
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
