import React, {useEffect, useState} from 'react';
import styles from './MainPageVoucher.module.scss';
import Table from '@/components/common/Table/Table';
import Pagination from '@/components/common/Pagination/Pagination';
import Button from '@/components/common/Button/Button';
import Image from 'next/image';
import icons from '@/constants/static/icons';
import images from '@/constants/static/images';
import IconCustom from '@/components/common/IconCustom/IconCustom';
import ConfirmDeleteModal from '../ConfirmDeleteModal/ConfirmDeleteModal';
import {toast} from 'react-toastify';
import FormCreateVoucher from '../FormCreateVoucher/FormCreateVoucher';
import FormUpdateVoucher from '../FormUpdateVoucher/FormUpdateVoucher';
import ModalWrapper from '@/components/common/ModalWrapper/ModalWrapper';
import FilterAdmin from '@/components/common/FilterAdmin/FilterAdmin';
import {deleteMultipleVouchers, deleteVoucher, getAllVouchers} from '@/services/voucherService';
import moment from 'moment';
import 'moment/locale/vi';
import {setActiveMenu} from '@/redux/actions/menuTabActions';
import {ROUTES} from '@/constants/config';
import {connect} from 'react-redux';

const MainPageVoucher = ({setActiveMenu}) => {
	const [vouchers, setVouchers] = useState([]);
	const [loading, setLoading] = useState(true);
	const [currentPage, setCurrentPage] = useState(1);
	const [limit, setLimit] = useState(5);
	const [totalPages, setTotalPages] = useState(1);
	const [totalItems, setTotalItems] = useState(0);
	const [showForm, setShowForm] = useState(false);
	const [showUpdateForm, setShowUpdateForm] = useState(false);
	const [editVoucherId, setEditVoucherId] = useState(null);
	const [selectedVoucherId, setSelectedVoucherId] = useState(null);
	const [selectedVouchers, setSelectedVouchers] = useState([]);
	const [deleteMode, setDeleteMode] = useState('single');
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [searchTerm, setSearchTerm] = useState('');
	const [sortOption, setSortOption] = useState('newest');
	const [discountType, setDiscountType] = useState('');

	useEffect(() => {
		setActiveMenu(ROUTES.AdminVoucher);
	}, []);

	const fetchVouchers = async () => {
		setLoading(true);
		try {
			const res = await getAllVouchers(currentPage, limit, sortOption, searchTerm, discountType);

			setVouchers(res.vouchers || []);
			setTotalItems(res.total || 0);
			setTotalPages(res.totalPages || 1);
			setSelectedVouchers([]);
		} catch (error) {
			toast.error(error.message || 'Lỗi khi tải voucher');
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchVouchers();
	}, [currentPage, limit, sortOption, searchTerm, discountType]);

	const handleEditVoucher = (id) => {
		setEditVoucherId(id);
		setShowUpdateForm(true);
	};

	const handleConfirmDeleteManyVouchers = () => {
		if (!selectedVouchers || selectedVouchers.length === 0) {
			toast.warn('Vui lòng chọn ít nhất một voucher để xóa!');
			return;
		}
		setDeleteMode('multiple');
		setIsModalOpen(true);
	};

	return (
		<div className={styles.container}>
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
					]}
					filters={[
						{
							name: 'discountType',
							value: discountType,
							onChange: setDiscountType,
							options: [
								{value: '', label: 'Tất cả loại giảm giá'},
								{value: 'percent', label: 'Giảm theo phần trăm'},
								{value: 'fixed', label: 'Giảm theo số tiền'},
							],
						},
					]}
					selectedProducts={selectedVouchers}
					onDeleteMany={handleConfirmDeleteManyVouchers}
					isAdmin={true}
				/>

				<Button className={styles.addButton} onClick={() => setShowForm(true)}>
					Thêm mới voucher
				</Button>
			</div>

			{loading ? (
				<p>Đang tải dữ liệu...</p>
			) : vouchers.length === 0 ? (
				<div className={styles.noCategories}>
					<Image src={images.boxEmpty} alt='Không có voucher' width={180} height={180} priority />
					<h4>DỮ LIỆU TRỐNG</h4>
					<p>Hiện tại không có voucher nào!</p>
					<Button className={styles.btnNoProduct} onClick={() => setShowForm(true)}>
						Thêm mới voucher
					</Button>
				</div>
			) : (
				<>
					<Table
						users={vouchers.map((voucher, index) => ({
							index: (currentPage - 1) * limit + index + 1,
							...voucher,
						}))}
						headers={[
							{
								key: 'checkbox',
								label: (
									<input
										type='checkbox'
										checked={selectedVouchers.length === vouchers.length && vouchers.length > 0}
										onChange={(e) => {
											if (e.target.checked) {
												setSelectedVouchers(vouchers.map((v) => v._id)); // tick hết
											} else {
												setSelectedVouchers([]);
											}
										}}
									/>
								),
							},
							{key: 'index', label: 'STT'},
							{key: 'code', label: 'Mã voucher'},
							{
								key: 'discountValue',
								label: 'Giảm giá',
								render: (voucher) =>
									voucher.discountType === 'percent'
										? `${voucher.discountValue}%`
										: `${voucher.discountValue.toLocaleString('vi-VN')}₫`,
							},
							{
								key: 'minOrderValue',
								label: 'Đơn tối thiểu',
								render: (voucher) => `${voucher.minOrderValue?.toLocaleString('vi-VN')}₫`,
							},
							{
								key: 'maxDiscount',
								label: 'Giảm tối đa',
								render: (voucher) =>
									voucher.discountType === 'percent' ? `${voucher.maxDiscount?.toLocaleString('vi-VN') || 0}₫` : '—',
							},
							{
								key: 'quantity',
								label: 'Số lượng',
							},
							{
								key: 'showAt',
								label: 'Hiển thị lúc',
								render: (voucher) => moment(voucher.showAt).format('HH:mm:ss DD/MM/YYYY'),
							},
							{
								key: 'duration',
								label: 'Thời gian áp dụng',
								render: (voucher) =>
									`${moment(voucher.startDate).format('HH:mm:ss DD/MM/YYYY')} - ${moment(voucher.endDate).format(
										'HH:mm:ss DD/MM/YYYY'
									)}`,
							},
							{
								key: 'isActive',
								label: 'Trạng thái',
								render: (voucher) => (
									<span style={{color: voucher.isActive ? 'green' : 'red', fontWeight: 500}}>
										{voucher.isActive ? 'Đang hoạt động' : 'Tạm dừng'}
									</span>
								),
							},
							{
								key: 'createdAt',
								label: 'Thời gian tạo',
								render: (voucher) => {
									const date = voucher.createdAt;
									return date ? moment(date).format('HH:mm:ss DD/MM/YYYY') : 'Không xác định';
								},
							},
						]}
						renderCheckbox={(voucher) => (
							<input
								type='checkbox'
								checked={selectedVouchers.includes(voucher._id)}
								onChange={(e) => {
									if (e.target.checked) {
										setSelectedVouchers((prev) => [...prev, voucher._id]);
									} else {
										setSelectedVouchers((prev) => prev.filter((id) => id !== voucher._id));
									}
								}}
							/>
						)}
						renderActions={(voucher) => (
							<>
								<IconCustom
									icon={<Image src={icons.edit} alt='Edit' width={20} height={20} />}
									iconFilter='invert(38%) sepia(93%) saturate(1382%) hue-rotate(189deg) brightness(89%) contrast(105%)'
									backgroundColor='#dce7ff'
									tooltip='Chỉnh sửa voucher'
									onClick={() => handleEditVoucher(voucher._id)}
								/>

								<IconCustom
									icon={<Image src={icons.trash} alt='Delete' width={20} height={20} />}
									iconFilter='invert(17%) sepia(100%) saturate(7480%) hue-rotate(1deg) brightness(90%) contrast(105%)'
									backgroundColor='#FFD6D6'
									tooltip='Xóa voucher'
									onClick={() => {
										setSelectedVoucherId(voucher._id);
										setIsModalOpen(true);
										setDeleteMode('single');
									}}
								/>
							</>
						)}
					/>

					<Pagination
						currentPage={currentPage}
						totalPages={totalPages}
						totalItems={totalItems}
						limit={limit}
						onPageChange={(page) => setCurrentPage(page)}
						onLimitChange={(newLimit) => {
							setLimit(newLimit);
							setCurrentPage(1);
						}}
					/>
				</>
			)}

			{showForm && (
				<ModalWrapper onClose={() => setShowForm(false)}>
					<FormCreateVoucher
						onCancel={() => setShowForm(false)}
						onSuccess={() => {
							setShowForm(false);
							fetchVouchers();
						}}
					/>
				</ModalWrapper>
			)}

			{showUpdateForm && (
				<ModalWrapper onClose={() => setShowUpdateForm(false)}>
					<FormUpdateVoucher
						voucherId={editVoucherId}
						onCancel={() => setShowUpdateForm(false)}
						onSuccess={() => {
							setShowUpdateForm(false);
							fetchVouchers();
						}}
					/>
				</ModalWrapper>
			)}

			<ConfirmDeleteModal
				isOpen={isModalOpen}
				onClose={() => setIsModalOpen(false)}
				onConfirm={async () => {
					try {
						if (deleteMode === 'single' && selectedVoucherId) {
							await deleteVoucher(selectedVoucherId);
							toast.success('Xóa voucher thành công');
						} else if (deleteMode === 'multiple') {
							await deleteMultipleVouchers(selectedVouchers);
							toast.success('Xóa nhiều voucher thành công');
						}
						setIsModalOpen(false);
						fetchVouchers();
					} catch (error) {
						toast.error(error.message || 'Xóa voucher thất bại');
					}
				}}
				voucherName={vouchers.find((v) => v._id === selectedVoucherId)?.code}
			/>
		</div>
	);
};

// export default MainPageVoucher;
const mapDispatchToProps = (dispatch) => ({
	setActiveMenu: (menuPath) => dispatch(setActiveMenu(menuPath)),
});

export default connect(null, mapDispatchToProps)(MainPageVoucher);
