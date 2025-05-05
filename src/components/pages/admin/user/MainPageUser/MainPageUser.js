import React, {useState, useEffect} from 'react';
import styles from './MainPageUser.module.scss';
import Image from 'next/image';
import IconCustom from '@/components/common/IconCustom/IconCustom';
import Table from '@/components/common/Table/Table';
import icons from '@/constants/static/icons';
import Pagination from '@/components/common/Pagination/Pagination';
import Button from '@/components/common/Button/Button';
import {toast} from 'react-toastify';
import {getListUser, updateUserRole, updateUserStatus} from '@/services/authService';
import ConfirmModalStatus from '../ConfirmModalStatus/ConfirmModalStatus';
import ConfirmModalRole from '../ConfirmModalRole/ConfirmModalRole';
import FormUpdateUser from '../FormUpdateUser/FormUpdateUser';
import ModalWrapper from '@/components/common/ModalWrapper/ModalWrapper';

const MainPageUser = () => {
	const [users, setUsers] = useState([]);
	const [currentPage, setCurrentPage] = useState(1);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState('');

	const [selectedUser, setSelectedUser] = useState(null);
	const [isConfirmLockUnlockOpen, setIsConfirmLockUnlockOpen] = useState(false);

	const [selectedRoleUser, setSelectedRoleUser] = useState(null);
	const [changeRoleModalOpen, setChangeRoleModalOpen] = useState(false);
	const [showUpdateForm, setShowUpdateForm] = useState(false); // Update
	const [editUserId, setEditUserId] = useState(null); // Update

	// Constants
	const usersPerPage = 4;
	const totalPages = Math.ceil(users.length / usersPerPage);
	const indexOfLastUser = currentPage * usersPerPage;
	const indexOfFirstUser = indexOfLastUser - usersPerPage;
	const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);

	// Fetch Users
	const fetchUsers = async () => {
		try {
			setLoading(true);
			const data = await getListUser();
			console.log('Dữ liệu người dùng:', data);
			setUsers(data);
		} catch (error) {
			console.error('Lỗi lấy danh sách người dùng:', error);
			setError('Không thể tải danh sách người dùng');
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchUsers();
	}, []);

	// Handle Pagination
	const handlePageChange = (pageNumber) => {
		setCurrentPage(pageNumber);
	};

	// Handle Lock/Unlock
	const handleLockUnlockClick = (user) => {
		setSelectedUser(user);
		setIsConfirmLockUnlockOpen(true);
		setSelectedRoleUser(null);
		setChangeRoleModalOpen(false);
	};

	const handleConfirmLockUnlock = async () => {
		if (selectedUser) {
			await handleToggleStatus(selectedUser.id, selectedUser.status);
			toast.success('Cập nhật trạng thái thành công!');
			setIsConfirmLockUnlockOpen(false);
			setSelectedUser(null);
		}
	};

	const handleToggleStatus = async (userId, currentStatus) => {
		try {
			const newStatus = currentStatus === 'Đang hoạt động' ? 0 : 1;
			await updateUserStatus(userId, newStatus);
			await fetchUsers();
		} catch (error) {
			console.error('Lỗi cập nhật trạng thái người dùng:', error);
		}
	};

	// Handle Change Role
	const handleChangeRoleClick = (user) => {
		setSelectedRoleUser(user);
		setChangeRoleModalOpen(true);
		setSelectedUser(null);
		setIsConfirmLockUnlockOpen(false);
	};

	const handleConfirmChangeRole = async () => {
		if (selectedRoleUser) {
			let currentRole = selectedRoleUser.role;
			if (currentRole === 0) currentRole = 'Quản trị';
			else if (currentRole === 1) currentRole = 'Người dùng';

			const newRole = currentRole === 'Quản trị' ? 'Người dùng' : 'Quản trị';
			await handleUpdateUserRole(selectedRoleUser.id, newRole);
			toast.success('Cập nhật quyền thành công!');
			setChangeRoleModalOpen(false);
			setSelectedRoleUser(null);
		}
	};

	const handleUpdateUserRole = async (userId, newRole) => {
		try {
			await updateUserRole(userId, newRole);
			await fetchUsers();
		} catch (error) {
			console.error('Lỗi thay đổi quyền người dùng:', error);
		}
	};

	// Utilities
	const getRoleLabel = (role) => {
		if (role === 0 || role === 'Quản trị') return 'Quản trị viên';
		if (role === 1 || role === 'Người dùng') return 'Người dùng';
		return '';
	};

	const handleEditClick = (id) => {
		console.log('EDIT ID:', id);
		setEditUserId(id);
		setShowUpdateForm(true);
	};

	return (
		<div className={styles.container}>
			{loading ? (
				<p>Đang tải dữ liệu...</p>
			) : error ? (
				<p style={{color: 'red'}}>{error}</p>
			) : (
				<>
					<div className={styles.tableWrapper}>
						<Table
							users={currentUsers.map((user, idx) => ({
								...user,
								index: indexOfFirstUser + idx + 1,
								roleLabel: getRoleLabel(user.role),
							}))}
							headers={[
								{key: 'index', label: 'STT'},
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
										onClick={() => handleEditClick(user.id)}
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
										onClick={() => handleLockUnlockClick(user)}
									/>
									<IconCustom
										icon={<Image src={icons.changeRole} alt='Change Role' width={20} height={20} />}
										iconFilter='invert(24%) sepia(87%) saturate(2360%) hue-rotate(270deg) brightness(85%) contrast(96%)'
										backgroundColor='linear-gradient(135deg, rgba(156, 39, 176, 0.2), rgba(255, 255, 255, 0.5))'
										tooltip='Thay đổi quyền người dùng'
										onClick={() => handleChangeRoleClick(user)}
									/>
								</>
							)}
							roleStyle={{background: '#ffe4e6', color: '#ff2d2d', padding: '5px 10px', borderRadius: '4px'}}
							statusStyle={{background: '#e4ffe5', color: '#19cd21', padding: '5px 10px', borderRadius: '4px'}}
						/>
					</div>

					<Pagination
						currentPage={currentPage}
						totalPages={totalPages}
						onPageChange={handlePageChange}
						totalItems={users.length}
					/>

					<ConfirmModalStatus
						isOpen={isConfirmLockUnlockOpen}
						onClose={() => setIsConfirmLockUnlockOpen(false)}
						onConfirm={handleConfirmLockUnlock}
						name={selectedUser?.name}
						currentStatus={selectedUser?.status}
					/>

					<ConfirmModalRole
						isOpen={changeRoleModalOpen}
						onClose={() => setChangeRoleModalOpen(false)}
						onConfirm={handleConfirmChangeRole}
						name={selectedRoleUser?.name}
						currentRole={selectedRoleUser?.role}
					/>

					{showUpdateForm && (
						<ModalWrapper onClose={() => setShowUpdateForm(false)}>
							<FormUpdateUser
								userId={editUserId}
								onCancel={() => setShowUpdateForm(false)}
								onSuccess={() => {
									setShowUpdateForm(false);
									fetchUsers();
								}}
							/>
						</ModalWrapper>
					)}
				</>
			)}
		</div>
	);
};

export default MainPageUser;
