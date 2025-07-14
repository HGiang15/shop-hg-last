import React, {useState, useEffect} from 'react';
import styles from './MainPageUser.module.scss';
import Image from 'next/image';
import IconCustom from '@/components/common/IconCustom/IconCustom';
import Table from '@/components/common/Table/Table';
import icons from '@/constants/static/icons';
import Pagination from '@/components/common/Pagination/Pagination';
import {toast} from 'react-toastify';
import {deleteUserByAdmin, getListUser, updateUserRole, updateUserStatus} from '@/services/authService';
import ConfirmModalStatus from '../ConfirmModalStatus/ConfirmModalStatus';
import ConfirmModalRole from '../ConfirmModalRole/ConfirmModalRole';
import FormUpdateUser from '../FormUpdateUser/FormUpdateUser';
import FormCreateUser from '../FormCreateUser/FormCreateUser';
import ModalWrapper from '@/components/common/ModalWrapper/ModalWrapper';
import images from '@/constants/static/images';
import useDebounce from '@/hooks/useDebounce';
import FilterAdmin from '@/components/common/FilterAdmin/FilterAdmin';
import Button from '@/components/common/Button/Button';
import moment from 'moment';
import ConfirmDeleteModal from '../ConfirmDeleteModal/ConfirmDeleteModal';
import {setActiveMenu} from '@/redux/actions/menuTabActions';
import {ROUTES} from '@/constants/config';
import {connect} from 'react-redux';

const MainPageUser = () => {
	const [users, setUsers] = useState([]);
	const [currentPage, setCurrentPage] = useState(1);
	const [totalPages, setTotalPages] = useState(1);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(false);
	const [totalItems, setTotalItems] = useState(0);
	const [limit, setLimit] = useState(5);

	const [selectedUser, setSelectedUser] = useState(null);
	const [isConfirmLockUnlockOpen, setIsConfirmLockUnlockOpen] = useState(false);

	const [selectedRoleUser, setSelectedRoleUser] = useState(null);
	const [changeRoleModalOpen, setChangeRoleModalOpen] = useState(false);
	const [showUpdateForm, setShowUpdateForm] = useState(false); // Update
	const [editUserId, setEditUserId] = useState(null); // Update
	const [showCreateForm, setShowCreateForm] = useState(false); // Create
	const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); // Delete
	const [userToDelete, setUserToDelete] = useState(null); // Delete

	const [searchTerm, setSearchTerm] = useState('');
	const [sortOption, setSortOption] = useState('newest');
	const [filterRole, setFilterRole] = useState('');
	const [filterStatus, setFilterStatus] = useState('');
	const debounce = useDebounce(searchTerm, 600);

	useEffect(() => {
		setActiveMenu(ROUTES.AdminUser);
	}, []);

	const fetchUsers = async (page = currentPage, customLimit = limit) => {
		setLoading(true);
		try {
			const res = await getListUser(page, customLimit, debounce, sortOption, filterRole, filterStatus);
			setUsers(res.data);
			setTotalPages(res.pagination.totalPages);
			setTotalItems(res.pagination.totalItems);
			setCurrentPage(res.pagination.currentPage);
			setError(false);
		} catch (error) {
			toast.error('Lỗi khi lấy danh sách người dùng');
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchUsers(1, limit);
	}, [debounce, sortOption, filterRole, filterStatus, limit]);

	const handlePageChange = (pageNumber) => {
		setCurrentPage(pageNumber);
		fetchUsers(pageNumber, limit);
	};

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
			toast.error('Cập nhật trạng thái người dùng thất bại');
		}
	};

	const handleChangeRoleClick = (user) => {
		setSelectedRoleUser(user);
		setChangeRoleModalOpen(true);
		setSelectedUser(null);
		setIsConfirmLockUnlockOpen(false);
	};

	const handleConfirmChangeRole = async () => {
		if (selectedRoleUser) {
			let currentRole = selectedRoleUser.role;
			// if (currentRole === 0) currentRole = 'Quản trị';
			// else if (currentRole === 1) currentRole = 'Người dùng';

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
			toast.error('Cập nhật vai trò người dùng thất bại');
		}
	};

	// Handle Delete
	const handleDelete = (user) => {
		setUserToDelete(user);
		setIsDeleteModalOpen(true);
	};

	const handleConfirmDelete = async () => {
		if (userToDelete) {
			try {
				await deleteUserByAdmin(userToDelete.id);
				toast.success('Xóa người dùng thành công!');
				setIsDeleteModalOpen(false);
				setUserToDelete(null);
				fetchUsers();
			} catch (error) {
				console.error('Lỗi khi xóa người dùng:', error);
				toast.error(error.message || 'Xóa người dùng thất bại');
			}
		}
	};

	const getRoleLabel = (role) => {
		if (role === 0 || role === 'Quản trị') return 'Quản trị viên';
		if (role === 1 || role === 'Người dùng') return 'Người dùng';
		return '';
	};

	const handleEditClick = (id) => {
		setEditUserId(id);
		setShowUpdateForm(true);
	};

	const handleCreateNewUser = () => {
		setShowCreateForm(true);
	};

	return (
		<div className={styles.container}>
			{loading ? (
				<p>Đang tải dữ liệu...</p>
			) : error ? (
				<p style={{color: 'red'}}>{error}</p>
			) : (
				<>
					<div className={styles.header}>
						<FilterAdmin
							searchTerm={searchTerm}
							setSearchTerm={setSearchTerm}
							sortOption={sortOption}
							setSortOption={setSortOption}
							setCurrentPage={setCurrentPage}
							sortOptions={[
								{value: 'newest', label: 'Mới nhất'},
								{value: 'oldest', label: 'Cũ nhất'},
								{value: 'name_asc', label: 'Tên A-Z'},
								{value: 'name_desc', label: 'Tên Z-A'},
							]}
							filters={[
								{
									name: 'role',
									value: filterRole,
									onChange: setFilterRole,
									options: [
										{value: '', label: 'Tất cả quyền'},
										{value: '0', label: 'Quản trị viên'},
										{value: '1', label: 'Người dùng'},
									],
								},
								{
									name: 'status',
									value: filterStatus,
									onChange: setFilterStatus,
									options: [
										{value: '', label: 'Tất cả trạng thái'},
										{value: '1', label: 'Đang hoạt động'},
										{value: '0', label: 'Không hoạt động'},
									],
								},
							]}
						/>

						<Button className={styles.addButton} onClick={handleCreateNewUser}>
							Thêm mới người dùng
						</Button>
					</div>
					<div className={styles.tableWrapper}>
						{users.length === 0 ? (
							<div className={styles.noProducts}>
								<Image src={images.boxEmpty} alt='Không có người dùng' width={180} height={180} priority />
								<h4>DỮ LIỆU TRỐNG</h4>
								<p>Hiện tại không có người dùng nào phù hợp!</p>
							</div>
						) : (
							<Table
								users={users.map((user, index) => ({
									...user,
									index: (currentPage - 1) * limit + index + 1,
									roleLabel: getRoleLabel(user.role),
									createdAt: moment(user.createdAt).format('DD/MM/YYYY HH:mm'),
								}))}
								headers={[
									{key: 'index', label: 'STT'},
									{key: 'name', label: 'Họ tên'},
									{key: 'phone', label: 'Số điện thoại'},
									{key: 'email', label: 'Email'},
									{key: 'role', label: 'Quyền'},
									{key: 'status', label: 'Trạng thái'},
									{key: 'createdAt', label: 'Thời gian tạo'},
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
										 {' '}
										<IconCustom
											icon={<Image src={icons.trash} alt='Delete' width={20} height={20} />}
											iconFilter='invert(66%) sepia(35%) saturate(5412%) hue-rotate(338deg) brightness(98%) contrast(90%)'
											backgroundColor='#ffe4e4'
											tooltip='Xóa người dùng'
											onClick={() => handleDelete(user)}
										/>
									</>
								)}
								roleStyle={{background: '#ffe4e6', color: '#ff2d2d', padding: '5px 10px', borderRadius: '4px'}}
								statusStyle={{background: '#e4ffe5', color: '#19cd21', padding: '5px 10px', borderRadius: '4px'}}
							/>
						)}
					</div>
					<Pagination
						currentPage={currentPage}
						totalPages={totalPages}
						totalItems={totalItems}
						limit={limit}
						onPageChange={(page) => {
							setCurrentPage(page);
							fetchUsers(page, limit);
						}}
						onLimitChange={(newLimit) => {
							setLimit(newLimit);
							setCurrentPage(1);
							fetchUsers(1, newLimit);
						}}
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
					{showCreateForm && (
						<ModalWrapper onClose={() => setShowCreateForm(false)}>
							<FormCreateUser
								onCancel={() => setShowCreateForm(false)}
								onSuccess={() => {
									setShowCreateForm(false);
									fetchUsers();
									toast.success('Tạo người dùng mới thành công!');
								}}
							/>
						</ModalWrapper>
					)}

					<ConfirmDeleteModal
						isOpen={isDeleteModalOpen}
						onClose={() => setIsDeleteModalOpen(false)}
						onConfirm={handleConfirmDelete}
						userName={userToDelete?.name}
					/>
				</>
			)}
		</div>
	);
};

// export default MainPageUser;

const mapDispatchToProps = (dispatch) => ({
	setActiveMenu: (menuPath) => dispatch(setActiveMenu(menuPath)),
});

export default connect(null, mapDispatchToProps)(MainPageUser);
