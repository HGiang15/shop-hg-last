import React from 'react';
import styles from './MainPageColor.module.scss';
import Image from 'next/image';
import IconCustom from '@/components/common/IconCustom/IconCustom';
import Table from '@/components/common/Table/Table';
import icons from '@/constants/static/icons';
import Pagination from '@/components/common/Pagination/Pagination';
import {useState} from 'react';

const users = [
	{id: 1, colorCode: 'Test', name: 'Màu đỏ', description: 'Mô tả 1', role: 'Quản trị', status: 'Đang hoạt động'},
	{
		id: 2,
		colorCode: 'Nguyễn Đăng Hoàng Giang',
		name: 'Màu xanh',
		description: 'Mô tả 2',
	},
	{id: 3, colorCode: 'Nguyễn Ngọc Minh', name: 'Màu đen', description: 'Mô tả 3'},
	{id: 5, colorCode: 'ADMIN', name: 'Màu trắng', description: 'admin@gmail.com'},
];

const MainPageColor = () => {
	const [currentPage, setCurrentPage] = useState(1);
	const usersPerPage = 3;
	const totalPages = Math.ceil(users.length / usersPerPage);
	const indexOfLastUser = currentPage * usersPerPage;
	const indexOfFirstUser = indexOfLastUser - usersPerPage;
	const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);

	const handlePageChange = (pageNumber) => {
		setCurrentPage(pageNumber);
	};

	return (
		<div className={styles.container}>
			<div className={styles.header}>
				<h2>Quản lý màu sắc</h2>
				<button className={styles.addButton}>Thêm mới màu sắc</button>
			</div>

			<div className={styles.tableWrapper}>
				<Table
					users={currentUsers}
					headers={[
						{key: 'id', label: 'STT'},
						{key: 'colorCode', label: 'Mã màu'},
						{key: 'name', label: 'Tên màu'},
						{key: 'description', label: 'Mô tả'},
					]}
					renderActions={(user) => (
						<>
							<IconCustom
								icon={<Image src={icons.edit} alt='Edit' width={20} height={20} />}
								iconFilter='invert(38%) sepia(93%) saturate(1382%) hue-rotate(189deg) brightness(89%) contrast(105%)'
								backgroundColor='#dce7ff'
								tooltip='Chỉnh sửa màu sắc'
							/>
							<IconCustom
								icon={<Image src={icons.trash} alt='Change Role' width={20} height={20} />}
								iconFilter='invert(66%) sepia(35%) saturate(5412%) hue-rotate(338deg) brightness(98%) contrast(90%)'
								backgroundColor='#ffe4e4'
								tooltip='Xóa màu sắc'
							/>
						</>
					)}
					roleStyle={{background: '#ffe4e6', color: '#ff2d2d', padding: '5px 10px', borderRadius: '4px'}}
					statusStyle={{background: '#e4ffe5', color: '#19cd21', padding: '5px 10px', borderRadius: '4px'}}
				/>
			</div>

			<Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} totalItems={users.length} />
		</div>
	);
};

export default MainPageColor;
