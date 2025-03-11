import React from 'react';
import styles from './MainDashboard.module.scss';

const MainDashboard = () => {
	const orderStats = [
		{title: 'Tổng số đơn hàng', value: 0, icon: '\u{1F4C8}'},
		{title: 'Đơn hàng thành công', value: 0, icon: '\u{1F4C9}'},
		{title: 'Đơn hàng bị hủy', value: 0, icon: '\u{1F6AB}'},
	];

	const revenueStats = [
		{title: 'Tổng doanh thu', value: 0, icon: '\u{1F4B8}'},
		{title: 'Doanh thu trong ngày', value: 0, icon: '\u{1F4B0}'},
		{title: 'Doanh thu trong tháng', value: 0, icon: '\u{1F4B3}'},
		{title: 'Doanh thu trong năm', value: 0, icon: '\u{1F4B5}'},
	];

	return (
		<div className={styles.container}>
			<h2 className={styles.title}>Thống kê đơn hàng</h2>

			<div className={styles.statsGrid}>
				{orderStats.map((stat, index) => (
					<div key={index} className={styles.card}>
						<div className={styles.icon}>{stat.icon}</div>
						<p className={styles.text}>{stat.title}</p>
						<h3 className={styles.value}>{stat.value}</h3>
					</div>
				))}
			</div>

			<h2 className={styles.title}>Thống kê doanh thu</h2>

			<div className={styles.statsGrid}>
				{revenueStats.map((stat, index) => (
					<div key={index} className={styles.card}>
						<div className={styles.icon} style={{color: stat.color}}>
							{stat.icon}
						</div>
						<p>{stat.title}</p>
						<h3>{stat.value}</h3>
					</div>
				))}
			</div>
		</div>
	);
};

export default MainDashboard;
