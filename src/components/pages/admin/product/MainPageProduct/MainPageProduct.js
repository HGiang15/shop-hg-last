import React from 'react';
import styles from './MainPageProduct.module.scss';
import Image from 'next/image';
import IconCustom from '@/components/common/IconCustom/IconCustom';
import Table from '@/components/common/Table/Table';
import icons from '@/constants/static/icons';
import Pagination from '@/components/common/Pagination/Pagination';
import {useState} from 'react';
import Button from '@/components/common/Button/Button';
import {ROUTES} from '@/constants/config';
import {useRouter} from 'next/router';
import {connect} from 'react-redux';
import {setActiveMenu} from '@/redux/actions/menuTabActions';

const users = [
	{
		index: 1,
		id: 'MUVN01',
		name: 'Áo MU Home 2024-2025',
		type: 'Áo CLB',
		color: 'Màu đỏ',
		price: '699.000 VNĐ',
		quantity: 1,
	},
	{
		index: 2,
		id: 'MUVN01',
		name: 'Áo MU Home 2024-2025',
		type: 'Áo CLB',
		color: 'Màu đỏ',
		price: '699.000 VNĐ',
		quantity: 1,
	},
];

const MainPageProduct = ({setActiveMenu}) => {
	const router = useRouter();

	const [currentPage, setCurrentPage] = useState(1);
	const usersPerPage = 3;
	const totalPages = Math.ceil(users.length / usersPerPage);
	const indexOfLastUser = currentPage * usersPerPage;
	const indexOfFirstUser = indexOfLastUser - usersPerPage;
	const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);

	const handlePageChange = (pageNumber) => {
		setCurrentPage(pageNumber);
	};

	const handleFormCreateProductClick = () => {
		setActiveMenu(ROUTES.AdminProduct); // Dispatch action khi chuyển đến trang con
		router.push(ROUTES.AdminProductCreate);
	};

	return (
		<div className={styles.container}>
			<div className={styles.header}>
				<h2>Quản lý sản phẩm</h2>
				<Button className={styles.addButton} onClick={handleFormCreateProductClick}>
					Thêm mới sản phẩm
				</Button>
			</div>

			<div className={styles.tableWrapper}>
				<Table
					users={currentUsers}
					headers={[
						{key: 'index', label: 'STT'},
						{key: 'id', label: 'Mã sản phẩm'},
						{key: 'name', label: 'Tên sản phẩm'},
						{key: 'type', label: 'Loại sản phẩm'},
						{key: 'color', label: 'Màu sản phẩm'},
						{key: 'price', label: 'Giá (VNĐ)'},
						{key: 'quantity', label: 'Số lượng đã bán'},
					]}
					renderActions={(user) => (
						<>
							<IconCustom
								icon={<Image src={icons.edit} alt='Edit' width={20} height={20} />}
								iconFilter='invert(38%) sepia(93%) saturate(1382%) hue-rotate(189deg) brightness(89%) contrast(105%)'
								backgroundColor='#dce7ff'
								tooltip='Chỉnh sửa sản phẩm'
							/>
							<IconCustom
								icon={<Image src={icons.eye} alt='Edit' width={20} height={20} />}
								iconFilter='brightness(0) '
								backgroundColor='#FFF200'
								tooltip='Chi tiết sản phẩm'
							/>
							<IconCustom
								icon={<Image src={icons.trash} alt='Xóa sản phẩm' width={20} height={20} />}
								iconFilter='invert(17%) sepia(100%) saturate(7480%) hue-rotate(1deg) brightness(90%) contrast(105%)'
								backgroundColor='#FFD6D6'
								tooltip='Xóa sản phẩm'
							/>
						</>
					)}
				/>
			</div>

			<Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} totalItems={users.length} />
		</div>
	);
};

const mapDispatchToProps = (dispatch) => ({
	setActiveMenu: (menuPath) => dispatch(setActiveMenu(menuPath)), // Dispatch action để cập nhật state
});

export default connect(null, mapDispatchToProps)(MainPageProduct);
