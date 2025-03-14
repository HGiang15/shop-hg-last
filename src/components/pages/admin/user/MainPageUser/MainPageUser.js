import React from 'react';
import styles from './MainPageUser.module.scss';
import lock from '../../../../../../public/static/icons/lock.svg';
import unlock from '../../../../../../public/static/icons/unlock.svg';
import edit from '../../../../../../public/static/icons/edit.svg';
import changeRole from '../../../../../../public/static/icons/change_role.svg';
import Table from '@/components/common/Table/Table';
import Image from 'next/image';

const users = [
	{id: 1, name: 'Tesst', phone: '0398162589', email: 'giang@gmail.com', role: 'Quản trị', status: 'Đang hoạt động'},
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

const columns = [
	{key: 'id', label: 'STT'},
	{key: 'name', label: 'Họ tên'},
	{key: 'phone', label: 'Số điện thoại'},
	{key: 'email', label: 'Email'},
	{key: 'role', label: 'Quyền'},
	{key: 'status', label: 'Trạng thái'},
];

const actions = (user) => [
	{label: 'Edit', icon: edit},
	{label: 'Lock/Unlock', icon: user.status === 'Đang hoạt động' ? lock : unlock},
	{label: 'Change Role', icon: changeRole},
];

const MainPageUser = () => {
	return (
		<div className={styles.container}>
			<div className={styles.header}>
				<h2>Quản lý người dùng</h2>
				<button className={styles.addButton}>Thêm mới người dùng</button>
			</div>

			<Table columns={columns} data={users} actions={actions} />
		</div>
	);
};

export default MainPageUser;
