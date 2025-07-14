import React, {useEffect, useState} from 'react';
import styles from './MainPageColor.module.scss';
import Image from 'next/image';
import {toast} from 'react-toastify';
import IconCustom from '@/components/common/IconCustom/IconCustom';
import Table from '@/components/common/Table/Table';
import icons from '@/constants/static/icons';
import Pagination from '@/components/common/Pagination/Pagination';
import {getAllColors, deleteColor, deleteMultipleColors} from '@/services/colorService';
import ConfirmDeleteModal from '../ConfirmDeleteModal/ConfirmDeleteModal';
import Button from '@/components/common/Button/Button';
import ModalWrapper from '@/components/common/ModalWrapper/ModalWrapper';
import FormCreateColor from '../FormCreateColor/FormCreateColor';
import FormUpdateColor from '../FormUpdateColor/FormUpdateColor';
import images from '@/constants/static/images';
import useDebounce from '@/hooks/useDebounce';
import FilterAdmin from '@/components/common/FilterAdmin/FilterAdmin';
import moment from 'moment';
import 'moment/locale/vi';
import {setActiveMenu} from '@/redux/actions/menuTabActions';
import {ROUTES} from '@/constants/config';
import {connect} from 'react-redux';

const MainPageColor = ({setActiveMenu}) => {
	const [currentPage, setCurrentPage] = useState(1);
	const [colors, setColors] = useState([]);
	const [showForm, setShowForm] = useState(false); // Create
	const [showUpdateForm, setShowUpdateForm] = useState(false); // Update
	const [editColorId, setEditColorId] = useState(null); // Update
	const [isModalOpen, setIsModalOpen] = useState(false); // Delete
	const [selectedColorId, setSelectedColorId] = useState(null); // Delete
	const [selectedColors, setSelectedColors] = useState([]);
	const [deleteMode, setDeleteMode] = useState('single'); // 'single' | 'multiple'
	const [limit, setLimit] = useState(5); // Default limit
	const [totalItems, setTotalItems] = useState(0);
	const [totalPages, setTotalPages] = useState(1);
	const [sortOption, setSortOption] = useState('newest');
	const [searchTerm, setSearchTerm] = useState('');
	const debounce = useDebounce(searchTerm, 600);

	useEffect(() => {
		setActiveMenu(ROUTES.AdminColor);
	}, []);

	// Get all colors with pagination
	const fetchColors = async () => {
		try {
			const data = await getAllColors(currentPage, limit, sortOption, debounce);
			setColors(data.colors || []);
			setTotalItems(data.totalItems || 0);
			setTotalPages(data.totalPages || 1);
		} catch (error) {
			console.error('Lỗi lấy danh sách màu:', error.message);
		}
	};

	useEffect(() => {
		fetchColors();
	}, [currentPage, limit, sortOption, debounce]);

	const handlePageChange = (pageNumber) => {
		setCurrentPage(pageNumber);
	};

	const handleLimitChange = (newLimit) => {
		setLimit(newLimit);
		setCurrentPage(1);
	};

	const handleEditColor = (id) => {
		setEditColorId(id);
		setShowUpdateForm(true);
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
						{value: 'name_asc', label: 'Tên A-Z'},
						{value: 'name_desc', label: 'Tên Z-A'},
					]}
					selectedProducts={selectedColors}
					onDeleteMany={() => {
						if (!selectedColors || selectedColors.length === 0) {
							toast.warn('Vui lòng chọn ít nhất một màu sắc để xoá!');
							return;
						}
						setDeleteMode('multiple');
						setIsModalOpen(true);
					}}
					isAdmin={true}
				/>
				<Button className={styles.addButton} onClick={() => setShowForm(true)}>
					Thêm mới màu sắc
				</Button>
			</div>

			{colors.length === 0 ? (
				<div className={styles.noProducts}>
					<Image src={images.boxEmpty} alt='Không có màu sắc' width={180} height={180} priority />
					<h4>DỮ LIỆU TRỐNG</h4>
					<p>Hiện tại không có màu sắc nào!</p>
					<Button className={styles.btnNoProduct} onClick={() => setShowForm(true)}>
						Thêm mới màu sắc
					</Button>
				</div>
			) : (
				<>
					<div className={styles.tableWrapper}>
						<Table
							users={colors.map((color, index) => ({
								index: (currentPage - 1) * limit + index + 1,
								_id: color._id,
								code: color.code,
								name: color.name,
								description: color.description,
								createdAt: color.createdAt,
							}))}
							headers={[
								{
									key: 'checkbox',
									label: (
										<input
											type='checkbox'
											checked={selectedColors.length === colors.length && colors.length > 0}
											onChange={(e) => {
												if (e.target.checked) {
													setSelectedColors(colors.map((color) => color._id));
												} else {
													setSelectedColors([]);
												}
											}}
										/>
									),
								},
								{key: 'index', label: 'STT'},
								{
									key: 'code',
									label: 'Mã màu',
									render: (color) => (
										<div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
											<div
												style={{
													width: '20px',
													height: '20px',
													backgroundColor: color.code,
													border: '1px solid #ccc',
													borderRadius: '4px',
												}}
											/>
											<span>{color.code}</span>
										</div>
									),
								},
								{key: 'name', label: 'Tên màu'},
								{
									key: 'description',
									label: 'Mô tả',
									render: (color) => (
										<span className={styles.truncate} title={color.description}>
											{color.description}
										</span>
									),
								},
								{
									key: 'createdAt',
									label: 'Thời gian tạo',
									render: (color) => moment(color.createdAt).locale('vi').format('HH:mm:ss - DD/MM/YYYY'),
								},
							]}
							renderCheckbox={(color) => (
								<input
									type='checkbox'
									checked={selectedColors.includes(color._id)}
									onChange={(e) => {
										if (e.target.checked) {
											setSelectedColors((prev) => [...prev, color._id]);
										} else {
											setSelectedColors((prev) => prev.filter((id) => id !== color._id));
										}
									}}
								/>
							)}
							renderActions={(color) => (
								<>
									<IconCustom
										icon={<Image src={icons.edit} alt='Edit' width={20} height={20} />}
										iconFilter='invert(38%) sepia(93%) saturate(1382%) hue-rotate(189deg) brightness(89%) contrast(105%)'
										backgroundColor='#dce7ff'
										tooltip='Chỉnh sửa màu sắc'
										onClick={() => handleEditColor(color._id)}
									/>
									<IconCustom
										icon={<Image src={icons.trash} alt='Delete' width={20} height={20} />}
										iconFilter='invert(66%) sepia(35%) saturate(5412%) hue-rotate(338deg) brightness(98%) contrast(90%)'
										backgroundColor='#ffe4e4'
										tooltip='Xóa màu sắc'
										onClick={() => {
											setSelectedColorId(color._id);
											setDeleteMode('single');
											setIsModalOpen(true);
										}}
									/>
								</>
							)}
						/>
					</div>

					{colors.length > 0 && (
						<div className={styles.paginationWrapper}>
							<Pagination
								currentPage={currentPage}
								totalPages={totalPages}
								totalItems={totalItems}
								onPageChange={handlePageChange}
								onLimitChange={handleLimitChange}
								limit={limit}
							/>
						</div>
					)}
				</>
			)}

			{showForm && (
				<ModalWrapper onClose={() => setShowForm(false)}>
					<FormCreateColor onCancel={() => setShowForm(false)} onSuccess={fetchColors} />
				</ModalWrapper>
			)}

			{showUpdateForm && (
				<ModalWrapper onClose={() => setShowUpdateForm(false)}>
					<FormUpdateColor
						colorId={editColorId}
						onCancel={() => setShowUpdateForm(false)}
						onSuccess={() => {
							setShowUpdateForm(false);
							fetchColors();
						}}
					/>
				</ModalWrapper>
			)}

			<ConfirmDeleteModal
				isOpen={isModalOpen}
				onClose={() => setIsModalOpen(false)}
				onConfirm={async () => {
					try {
						if (deleteMode === 'single' && selectedColorId) {
							await deleteColor(selectedColorId);
							toast.success('Xóa màu thành công');
						} else if (deleteMode === 'multiple') {
							await deleteMultipleColors(selectedColors);
							toast.success('Xóa nhiều màu thành công');
						}
						await fetchColors();
						setIsModalOpen(false);
						setSelectedColors([]);
					} catch (error) {
						toast.error(error.message || 'Xóa màu thất bại');
					}
				}}
				colorName={colors.find((c) => c._id === selectedColorId)?.name}
			/>
		</div>
	);
};

// export default MainPageColor;

const mapDispatchToProps = (dispatch) => ({
	setActiveMenu: (menuPath) => dispatch(setActiveMenu(menuPath)),
});

export default connect(null, mapDispatchToProps)(MainPageColor);
