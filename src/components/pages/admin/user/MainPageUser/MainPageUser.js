import React from 'react';
import styles from './MainPageUser.module.scss';
import Image from 'next/image';
import lock from '../../../../../../public/static/icons/lock.svg';
import unlock from '../../../../../../public/static/icons/unlock.svg';
import edit from '../../../../../../public/static/icons/edit.svg';
import changeRole from '../../../../../../public/static/icons/change_role.svg';

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

const MainPageUser = () => {
	return (
		<div className={styles.container}>
			<div className={styles.header}>
				<h2>Quản lý người dùng</h2>
				<button className={styles.addButton}>Thêm mới người dùng</button>
			</div>

			<table className={styles.userTable}>
				<thead>
					<tr>
						<th>STT</th>
						<th>Họ tên</th>
						<th>Số điện thoại</th>
						<th>Email</th>
						<th>Quyền</th>
						<th>Trạng thái</th>
						<th>Hành động</th>
					</tr>
				</thead>
				<tbody>
					{users.map((user, index) => (
						<tr key={user.id}>
							<td>{index + 1}</td>
							<td>{user.name}</td>
							<td>{user.phone}</td>
							<td>{user.email}</td>
							<td>
								<span className={user.role === 'Quản trị' ? styles.adminRole : styles.userRole}>{user.role}</span>
							</td>
							<td>
								<span className={styles.activeStatus}>{user.status}</span>
							</td>
							<td>
								<button className={styles.editBtn}>
									<Image src={edit} alt='Edit' width={20} height={20} />
								</button>
								<button className={styles.lockBtn}>
									<Image
										src={user.status === 'Đang hoạt động' ? lock : unlock}
										alt='Lock/Unlock'
										width={20}
										height={20}
									/>
								</button>
								<button className={styles.resetBtn}>
									<Image src={changeRole} alt='Reset' width={20} height={20} />
								</button>
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
};

export default MainPageUser;
