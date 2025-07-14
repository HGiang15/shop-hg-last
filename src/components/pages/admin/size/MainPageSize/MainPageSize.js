import React, {useState, useEffect} from 'react';
import styles from './MainPageSize.module.scss';
import Table from '@/components/common/Table/Table';
import Pagination from '@/components/common/Pagination/Pagination';
import ModalWrapper from '@/components/common/ModalWrapper/ModalWrapper';
import FormCreateSize from '../FormCreateSize/FormCreateSize';
import ConfirmDeleteModal from '../ConfirmDeleteModal/ConfirmDeleteModal';
import Button from '@/components/common/Button/Button';
import IconCustom from '@/components/common/IconCustom/IconCustom';
import Image from 'next/image';
import icons from '@/constants/static/icons';
import {getAllSizes, deleteSize, deleteMultipleSizes} from '@/services/sizeService';
import {toast} from 'react-toastify';
import FormUpdateSize from '../FormUpdateSize/FormUpdateSize';
import images from '@/constants/static/images';
import FilterAdmin from '@/components/common/FilterAdmin/FilterAdmin';
import useDebounce from '@/hooks/useDebounce';
import moment from 'moment';
import 'moment/locale/vi';
import {setActiveMenu} from '@/redux/actions/menuTabActions';
import {ROUTES} from '@/constants/config';
import {connect} from 'react-redux';

const MainPageSize = ({setActiveMenu}) => {
	const [sizes, setSizes] = useState([]);
	const [currentPage, setCurrentPage] = useState(1);
	const [showForm, setShowForm] = useState(false);
	const [showUpdateForm, setShowUpdateForm] = useState(false);
	const [editSizeId, setEditSizeId] = useState(null);
	const [selectedSizeId, setSelectedSizeId] = useState(null);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [limit, setLimit] = useState(5);
	const [totalPages, setTotalPages] = useState(1);
	const [totalItems, setTotalItems] = useState(0);
	const [sortOption, setSortOption] = useState('newest');
	const [searchTerm, setSearchTerm] = useState('');
	const debounce = useDebounce(searchTerm, 600);

	const [selectedSizes, setSelectedSizes] = useState([]);
	const [deleteMode, setDeleteMode] = useState('single'); // 'single' | 'multiple'

	useEffect(() => {
		setActiveMenu(ROUTES.AdminSize);
	}, []);

	const fetchSizes = async (page = currentPage, customLimit = limit, sort = sortOption, search = debounce) => {
		try {
			const data = await getAllSizes(page, customLimit, sort, search);
			setSizes(data.sizes);
			setCurrentPage(data.currentPage);
			setTotalPages(data.totalPages);
			setTotalItems(data.totalItems);
		} catch (error) {
			toast.error('Lỗi lấy danh sách kích cỡ');
		}
	};

	useEffect(() => {
		fetchSizes();
	}, [currentPage, limit, sortOption, debounce]);

	const handleEditSize = (id) => {
		setEditSizeId(id);
		setShowUpdateForm(true);
	};

	const handleDelete = async () => {
		try {
			await deleteSize(selectedSizeId);
			toast.success('Xóa kích cỡ thành công');
			fetchSizes();
		} catch (error) {
			toast.error(error.message || 'Xóa thất bại');
		} finally {
			setIsModalOpen(false);
		}
	};

	const handleConfirmDeleteMany = () => {
		if (selectedSizes.length === 0) {
			toast.warn('Vui lòng chọn ít nhất một kích cỡ để xoá!');
			return;
		}
		setDeleteMode('multiple');
		setSelectedSizeId(null);
		setIsModalOpen(true);
	};

	const isAllSelected = selectedSizes.length === sizes.length && sizes.length > 0;

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
					selectedProducts={selectedSizes}
					onDeleteMany={handleConfirmDeleteMany}
					isAdmin={true}
				/>
				<Button className={styles.addButton} onClick={() => setShowForm(true)}>
					Thêm mới kích cỡ
				</Button>
			</div>

			{sizes.length === 0 ? (
				<div className={styles.noProducts}>
					<Image src={images.boxEmpty} alt='Không có kích cỡ' width={180} height={180} priority />
					<h4>DỮ LIỆU TRỐNG</h4>
					<p>Hiện tại không có kích cỡ nào!</p>
					<Button className={styles.btnNoProduct} onClick={() => setShowForm(true)}>
						Thêm mới kích cỡ
					</Button>
				</div>
			) : (
				<>
					<Table
						users={sizes.map((size, index) => ({
							index: (currentPage - 1) * limit + index + 1,
							_id: size._id,
							name: size.name,
							description: size.description,
							createdAt: size.createdAt,
						}))}
						headers={[
							{
								key: 'checkbox',
								label: (
									<input
										type='checkbox'
										checked={isAllSelected}
										onChange={(e) => {
											if (e.target.checked) {
												setSelectedSizes(sizes.map((s) => s._id));
											} else {
												setSelectedSizes([]);
											}
										}}
									/>
								),
							},
							{key: 'index', label: 'STT'},
							{key: 'name', label: 'Tên kích cỡ'},
							{key: 'description', label: 'Mô tả'},
							{
								key: 'createdAt',
								label: 'Thời gian tạo',
								render: (size) => moment(size.createdAt).locale('vi').format('HH:mm:ss DD/MM/YYYY'),
							},
						]}
						renderCheckbox={(size) => (
							<input
								type='checkbox'
								checked={selectedSizes.includes(size._id)}
								onChange={(e) => {
									if (e.target.checked) {
										setSelectedSizes((prev) => [...prev, size._id]);
									} else {
										setSelectedSizes((prev) => prev.filter((id) => id !== size._id));
									}
								}}
							/>
						)}
						renderActions={(size) => (
							<>
								<IconCustom
									icon={<Image src={icons.edit} alt='Edit' width={20} height={20} />}
									iconFilter='invert(38%) sepia(93%) saturate(1382%) hue-rotate(189deg) brightness(89%) contrast(105%)'
									backgroundColor='#dce7ff'
									tooltip='Chỉnh sửa kích cỡ'
									onClick={() => handleEditSize(size._id)}
								/>
								<IconCustom
									icon={<Image src={icons.trash} alt='Delete' width={20} height={20} />}
									iconFilter='invert(66%) sepia(35%) saturate(5412%) hue-rotate(338deg) brightness(98%) contrast(90%)'
									backgroundColor='#ffe4e4'
									tooltip='Xóa kích cỡ'
									onClick={() => {
										setSelectedSizeId(size._id);
										setDeleteMode('single');
										setIsModalOpen(true);
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
						onPageChange={(page) => {
							setCurrentPage(page);
							fetchSizes(page, limit);
						}}
						onLimitChange={(newLimit) => {
							setLimit(newLimit);
							setCurrentPage(1);
							fetchSizes(1, newLimit);
						}}
					/>
				</>
			)}

			{showForm && (
				<ModalWrapper onClose={() => setShowForm(false)}>
					<FormCreateSize
						onCancel={() => setShowForm(false)}
						onSuccess={() => {
							setShowForm(false);
							fetchSizes();
						}}
					/>
				</ModalWrapper>
			)}

			{showUpdateForm && (
				<ModalWrapper onClose={() => setShowUpdateForm(false)}>
					<FormUpdateSize
						sizeId={editSizeId}
						onCancel={() => setShowUpdateForm(false)}
						onSuccess={() => {
							setShowUpdateForm(false);
							fetchSizes();
						}}
					/>
				</ModalWrapper>
			)}

			<ConfirmDeleteModal
				isOpen={isModalOpen}
				onClose={() => setIsModalOpen(false)}
				onConfirm={async () => {
					try {
						if (deleteMode === 'single' && selectedSizeId) {
							await deleteSize(selectedSizeId);
							toast.success('Xóa kích cỡ thành công');
						} else if (deleteMode === 'multiple') {
							await deleteMultipleSizes(selectedSizes);
							toast.success('Xóa nhiều kích cỡ thành công');
						}
						fetchSizes();
					} catch (error) {
						toast.error(error.message || 'Xoá thất bại');
					} finally {
						setIsModalOpen(false);
					}
				}}
				sizeName={sizes.find((s) => s._id === selectedSizeId)?.name}
			/>
		</div>
	);
};

// export default MainPageSize;

const mapDispatchToProps = (dispatch) => ({
	setActiveMenu: (menuPath) => dispatch(setActiveMenu(menuPath)),
});

export default connect(null, mapDispatchToProps)(MainPageSize);
