import React from 'react';
import styles from './MainPageUser.module.scss';
import Image from 'next/image';
import IconCustom from '@/components/common/IconCustom/IconCustom';
import Table from '@/components/common/Table/Table';
import icons from '@/constants/static/icons';
import Pagination from '@/components/common/Pagination/Pagination';
import {useState} from 'react';
import Button from '@/components/common/Button/Button';

const users = [
	{id: 1, name: 'Test', phone: '0398162589', email: 'giang@gmail.com', role: 'Quản trị', status: 'Đang hoạt động'},
	{
		id: 2,
		name: 'Nguyễn Đăng Hoàng Giang',
		phone: '0398162589',
		email: 'gianghoang150503@gmail.com',
		role: 'Quản trị',
		status: 'Đang hoạt động',
	},
	{id: 3, name: 'Nguyễn Ngọc Minh', phone: '0348294842', email: 'minh@gmail.com', role: 'Quản trị', status: 'Đang hoạt động'},
	{id: 5, name: 'ADMIN', phone: '0339940200', email: 'admin@gmail.com', role: 'Quản trị', status: 'Đang hoạt động'},
];

const MainPageUser = () => {
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
				<h2>Quản lý người dùng</h2>
				<Button className={styles.addButton}>Thêm mới người dùng</Button>
			</div>

			<div className={styles.tableWrapper}>
				<Table
					users={currentUsers}
					headers={[
						{key: 'id', label: 'STT'},
						{key: 'name', label: 'Họ tên'},
						{key: 'phone', label: 'Số điện thoại'},
						{key: 'email', label: 'Email'},
						{key: 'role', label: 'Quyền'},
						{key: 'status', label: 'Trạng thái'},
					]}
					renderActions={(user) => (
						<>
							<IconCustom
								icon={<Image src={icons.edit} alt='Edit' width={20} height={20} />}
								iconFilter='invert(38%) sepia(93%) saturate(1382%) hue-rotate(189deg) brightness(89%) contrast(105%)'
								backgroundColor='#dce7ff'
								tooltip='Chỉnh sửa người dùng'
							/>
							<IconCustom
								icon={
									<Image
										src={user.status === 'Đang hoạt động' ? icons.lock : icons.unlock}
										alt='Lock/Unlock'
										width={20}
										height={20}
									/>
								}
								iconFilter='invert(66%) sepia(35%) saturate(5412%) hue-rotate(338deg) brightness(98%) contrast(90%)'
								backgroundColor='#ffe4e4'
								tooltip={user.status === 'Đang hoạt động' ? 'Khóa người dùng' : 'Mở khóa người dùng'}
							/>
							<IconCustom
								icon={<Image src={icons.changeRole} alt='Change Role' width={20} height={20} />}
								iconFilter='invert(24%) sepia(87%) saturate(2360%) hue-rotate(270deg) brightness(85%) contrast(96%)'
								backgroundColor='linear-gradient(135deg, rgba(156, 39, 176, 0.2), rgba(255, 255, 255, 0.5))'
								tooltip='Thay đổi quyền người dùng'
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

export default MainPageUser;
