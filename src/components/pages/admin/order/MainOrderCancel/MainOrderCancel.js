import React, {useState, useEffect} from 'react';
import styles from './MainOrderCancel.module.scss';
import Image from 'next/image';
import Table from '@/components/common/Table/Table';
import Pagination from '@/components/common/Pagination/Pagination';
import {ROUTES} from '@/constants/config';
import {getAllOrders, deleteOrder} from '@/services/orderService';
import LayoutPages from '@/components/layouts/LayoutPages/LayoutPages';
import images from '@/constants/static/images';
import IconCustom from '@/components/common/IconCustom/IconCustom';
import icons from '@/constants/static/icons';
import ConfirmDeleteModal from '../../order/ConfirmDeleteModal/ConfirmDeleteModal';
import {toast} from 'react-toastify';
import {useRouter} from 'next/router';
import useDebounce from '@/hooks/useDebounce';
import FilterAdmin from '@/components/common/FilterAdmin/FilterAdmin';

const MainOrderCancel = () => {
	const router = useRouter();
	const [orders, setOrders] = useState([]);
	const [currentPage, setCurrentPage] = useState(1);
	const [ordersPerPage, setOrdersPerPage] = useState(5);
	const [totalPages, setTotalPages] = useState(1);
	const [totalItems, setTotalItems] = useState(0);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [selectedOrder, setSelectedOrder] = useState(null);
	const [selectedOrderName, setSelectedOrderName] = useState('');

	const [searchTerm, setSearchTerm] = useState('');
	const [sortOption, setSortOption] = useState('newest');
	const [startDate, setStartDate] = useState('');
	const [endDate, setEndDate] = useState('');

	const debouncedSearchTerm = useDebounce(searchTerm, 600);

	useEffect(() => {
		const fetchOrders = async () => {
			try {
				const data = await getAllOrders(
					currentPage,
					ordersPerPage,
					'cancelled',
					debouncedSearchTerm,
					sortOption,
					startDate,
					endDate
				);
				setOrders(data.orders);
				setTotalPages(data.totalPages);
				setTotalItems(data.totalItems);
			} catch (err) {
				console.error(err);
				toast.error('Lỗi khi tải danh sách đơn hàng đã hủy!');
			}
		};

		fetchOrders();
	}, [currentPage, ordersPerPage, debouncedSearchTerm, sortOption, startDate, endDate]);

	// Xóa đơn hàng
	const handleConfirmDelete = async () => {
		try {
			await deleteOrder(selectedOrder);
			setIsModalOpen(false);
			setSelectedOrder(null);

			const data = await getAllOrders(currentPage, ordersPerPage, 'cancelled', debouncedSearchTerm, sortOption, startDate, endDate);
			setOrders(data.orders);
			setTotalPages(data.totalPages);
			setTotalItems(data.totalItems);

			toast.success('Xóa đơn hàng thành công!');
		} catch (error) {
			console.error('Lỗi khi xóa đơn hàng:', error);
			toast.error(error.message || 'Xóa đơn hàng thất bại. Vui lòng thử lại.');
		}
	};
	const handlePageChange = (page) => {
		setCurrentPage(page);
	};

	const handleLimitChange = (limit) => {
		setOrdersPerPage(limit);
		setCurrentPage(1);
	};

	return (
		<>
			<LayoutPages
				listPages={[
					{title: 'Chờ xác nhận', path: ROUTES.AdminOrder},
					{title: 'Đang giao hàng', path: ROUTES.AdminOrderConfirm},
					{title: 'Giao thành công', path: ROUTES.AdminOrderSuccess},
					{title: 'Đơn hàng hủy', path: ROUTES.AdminOrderCancel},
				]}
			>
				<div className={styles.container}>
					<div className={styles.header}>
						<FilterAdmin
							searchTerm={searchTerm}
							setSearchTerm={setSearchTerm}
							sortOption={sortOption}
							setSortOption={setSortOption}
							startDate={startDate}
							setStartDate={setStartDate}
							endDate={endDate}
							setEndDate={setEndDate}
							setCurrentPage={setCurrentPage}
							sortOptions={[
								{value: 'newest', label: 'Mới nhất'},
								{value: 'oldest', label: 'Cũ nhất'},
							]}
							isAdmin={true}
							showDateFilter={true}
							placeholderSearch='Tìm kiếm theo mã đơn hàng'
						/>
					</div>
					{orders.length === 0 ? (
						<div className={styles.noProducts}>
							<Image src={images.boxEmpty} alt='Không có đơn hàng' width={180} height={180} priority />
							<h4>DỮ LIỆU TRỐNG</h4>
							<p>Hiện tại không có đơn hàng nào.</p>
						</div>
					) : (
						<>
							<div className={styles.tableWrapper}>
								<Table
									users={orders.map((order, index) => {
										const finalAmount = order.finalAmount ?? 0;
										return {
											index: index + 1,
											_id: order._id,
											name: order.userId?.name ?? 'Không rõ',
											type: order.shippingAddress?.name ?? 'Không rõ',
											color: order.shippingAddress?.phone ?? 'Không rõ',
											quantity: order.items?.reduce((sum, item) => sum + item.quantity, 0) ?? 0,
											price: finalAmount.toLocaleString('vi-VN', {
												style: 'currency',
												currency: 'VND',
											}),
											createdAt: order.createdAt ? new Date(order.createdAt).toLocaleString('vi-VN') : '',
											updatedAt: order.updatedAt ? new Date(order.updatedAt).toLocaleString('vi-VN') : '',
											product: order,
										};
									})}
									headers={[
										{key: 'index', label: 'STT'},
										{key: '_id', label: 'Mã đơn hàng'},
										{key: 'name', label: 'Người dùng'},
										{key: 'type', label: 'Người nhận'},
										{key: 'color', label: 'Số điện thoại'},
										{key: 'quantity', label: 'Số lượng'},
										{key: 'price', label: 'Tổng tiền đơn hàng'},
										{key: 'createdAt', label: 'Ngày đặt hàng'},
										{key: 'updatedAt', label: 'Ngày cập nhật'},
									]}
									renderActions={(order) => (
										<>
											<IconCustom
												icon={<Image src={icons.trash} alt='Cancel' width={20} height={20} />}
												iconFilter='invert(17%) sepia(100%) saturate(7480%) hue-rotate(1deg) brightness(90%) contrast(105%)'
												backgroundColor='#FFD6D6'
												tooltip='Xóa đơn hàng'
												onClick={() => {
													setSelectedOrder(order._id);
													setSelectedOrderName(order.product?.items?.[0]?.name);
													setIsModalOpen(true);
												}}
											/>

											<IconCustom
												icon={<Image src={icons.eye} alt='Detail' width={20} height={20} />}
												iconFilter='brightness(0) '
												backgroundColor='#FFF200'
												tooltip='Xem chi tiết'
												onClick={() => {
													router.push(`${ROUTES.AdminOrder}/${order._id}`);
												}}
											/>
										</>
									)}
								/>
							</div>

							<Pagination
								currentPage={currentPage}
								totalPages={totalPages}
								totalItems={totalItems}
								onPageChange={handlePageChange}
								limit={ordersPerPage}
								onLimitChange={handleLimitChange}
							/>

							<ConfirmDeleteModal
								isOpen={isModalOpen}
								onClose={() => setIsModalOpen(false)}
								onConfirm={handleConfirmDelete}
								name={selectedOrderName}
							/>
						</>
					)}
				</div>
			</LayoutPages>
		</>
	);
};

export default MainOrderCancel;
