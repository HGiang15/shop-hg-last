import React, {useEffect, useState} from 'react';
import styles from './MainDashboard.module.scss';
import {getDashboardStats, getRevenueChart, getRevenueByDay, getRevenueByYear} from '@/services/orderService';
import {BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer} from 'recharts';

const MainDashboard = () => {
	const [orderStats, setOrderStats] = useState([]);
	const [revenueStats, setRevenueStats] = useState([]);

	const [revenueChartData, setRevenueChartData] = useState([]);
	const [revenueByDay, setRevenueByDay] = useState([]);
	const [revenueByYear, setRevenueByYear] = useState([]);

	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

	useEffect(() => {
		const fetchAllData = async () => {
			setLoading(true);
			try {
				const data = await getDashboardStats();
				setOrderStats([
					{title: 'Tổng số đơn hàng', value: data.orderStats.totalOrders, icon: '\u{1F4C8}'},
					{title: 'Đơn hàng thành công', value: data.orderStats.successOrders, icon: '\u{1F4C9}'},
					{title: 'Đơn hàng bị hủy', value: data.orderStats.cancelledOrders, icon: '\u{1F6AB}'},
				]);
				setRevenueStats([
					{
						title: 'Tổng doanh thu',
						value: data.revenueStats.totalRevenue.toLocaleString('vi-VN', {style: 'currency', currency: 'VND'}),
						icon: '\u{1F4B8}',
					},
					{
						title: 'Doanh thu trong ngày',
						value: data.revenueStats.dailyRevenue.toLocaleString('vi-VN', {style: 'currency', currency: 'VND'}),
						icon: '\u{1F4B0}',
					},
					{
						title: 'Doanh thu trong tháng',
						value: data.revenueStats.monthlyRevenue.toLocaleString('vi-VN', {style: 'currency', currency: 'VND'}),
						icon: '\u{1F4B3}',
					},
					{
						title: 'Doanh thu trong năm',
						value: data.revenueStats.yearlyRevenue.toLocaleString('vi-VN', {style: 'currency', currency: 'VND'}),
						icon: '\u{1F4B5}',
					},
				]);

				// Biểu đồ doanh thu theo tháng
				const monthData = await getRevenueChart();
				setRevenueChartData(
					monthData.map((item) => ({
						...item,
						month: `Tháng ${item.month}`,
					}))
				);

				// Biểu đồ doanh thu theo ngày trong năm
				const dayData = await getRevenueByDay();
				setRevenueByDay(dayData);

				// Biểu đồ doanh thu theo năm
				const yearData = await getRevenueByYear();
				setRevenueByYear(
					yearData.map((item) => ({
						...item,
						year: `${item.year}`,
					}))
				);

				setError(null);
			} catch (err) {
				setError(err.message || 'Lỗi lấy dữ liệu');
			} finally {
				setLoading(false);
			}
		};

		fetchAllData();
	}, []);

	if (loading) return <p>Đang tải dữ liệu...</p>;
	if (error) return <p style={{color: 'red'}}>{error}</p>;

	return (
		<div className={styles.container}>
			<h2 className={styles.title}>Thống kê đơn hàng</h2>
			<div className={styles.statsGrid}>
				{orderStats.map((stat, i) => (
					<div key={i} className={styles.card}>
						<div className={styles.icon}>{stat.icon}</div>
						<p className={styles.text}>{stat.title}</p>
						<h3 className={styles.value}>{stat.value}</h3>
					</div>
				))}
			</div>

			<h2 className={styles.title}>Thống kê doanh thu</h2>
			<div className={styles.statsGrid}>
				{revenueStats.map((stat, i) => (
					<div key={i} className={styles.card}>
						<div className={styles.icon}>{stat.icon}</div>
						<p>{stat.title}</p>
						<h3>{stat.value}</h3>
					</div>
				))}
			</div>

			<h2 className={styles.title}>Biểu đồ doanh thu theo tháng trong năm hiện tại</h2>
			<div className={styles.chartContainer}>
				<ResponsiveContainer width='100%' height={300}>
					<BarChart data={revenueChartData}>
						<CartesianGrid strokeDasharray='3 3' />
						<XAxis dataKey='month' />
						<YAxis />
						<Tooltip formatter={(value) => value.toLocaleString('vi-VN', {style: 'currency', currency: 'VND'})} />
						<Bar dataKey='revenue' fill='#8884d8' />
					</BarChart>
				</ResponsiveContainer>
			</div>

			<h2 className={styles.title}>Biểu đồ doanh thu theo ngày trong tháng hiện tại</h2>
			<div className={styles.chartContainer}>
				<ResponsiveContainer width='100%' height={300}>
					<BarChart data={revenueByDay}>
						<CartesianGrid strokeDasharray='3 3' />
						<XAxis dataKey='day' />
						<YAxis />
						<Tooltip formatter={(value) => value.toLocaleString('vi-VN', {style: 'currency', currency: 'VND'})} />
						<Bar dataKey='revenue' fill='#82ca9d' />
					</BarChart>
				</ResponsiveContainer>
			</div>

			<h2 className={styles.title}>Biểu đồ doanh thu 5 năm gần nhất</h2>
			<div className={styles.chartContainer}>
				<ResponsiveContainer width='100%' height={300}>
					<BarChart data={revenueByYear}>
						<CartesianGrid strokeDasharray='3 3' />
						<XAxis dataKey='year' />
						<YAxis />
						<Tooltip formatter={(value) => value.toLocaleString('vi-VN', {style: 'currency', currency: 'VND'})} />
						<Bar dataKey='revenue' fill='#ffc658' />
					</BarChart>
				</ResponsiveContainer>
			</div>
		</div>
	);
};

export default MainDashboard;
