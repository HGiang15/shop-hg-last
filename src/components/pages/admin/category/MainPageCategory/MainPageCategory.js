import React, {useState, useEffect} from 'react';
import styles from './MainPageCategory.module.scss';
import Table from '@/components/common/Table/Table';
import Pagination from '@/components/common/Pagination/Pagination';
import Button from '@/components/common/Button/Button';
import {useRouter} from 'next/router';
import Image from 'next/image';
import {getAllCategories, deleteCategory, deleteMultipleCategories} from '@/services/categoryService';
import icons from '@/constants/static/icons';
import images from '@/constants/static/images';
import IconCustom from '@/components/common/IconCustom/IconCustom';
import ConfirmDeleteModal from '../ConfirmDeleteModal/ConfirmDeleteModal';
import {toast} from 'react-toastify';
import FormCreateCategory from '../FormCreateCategory/FormCreateCategory';
import ModalWrapper from '@/components/common/ModalWrapper/ModalWrapper';
import FormUpdateCategory from '../FormUpdateCategory/FormUpdateCategory';
import FilterAdmin from '@/components/common/FilterAdmin/FilterAdmin';
import useDebounce from '@/hooks/useDebounce';
import moment from 'moment';
import 'moment/locale/vi';
import {ROUTES} from '@/constants/config';
import {connect} from 'react-redux';
import {setActiveMenu} from '@/redux/actions/menuTabActions';

const MainPageCategory = ({setActiveMenu}) => {
	const router = useRouter();
	const [categories, setCategories] = useState([]);
	const [currentPage, setCurrentPage] = useState(1);
	const [showForm, setShowForm] = useState(false);
	const [showUpdateForm, setShowUpdateForm] = useState(false);
	const [editCategoryId, setEditCategoryId] = useState(null);

	const [selectedCategoryId, setSelectedCategoryId] = useState(null);
	const [selectedCategories, setSelectedCategories] = useState([]);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [deleteMode, setDeleteMode] = useState('single');

	const [limit, setLimit] = useState(5);
	const [totalPages, setTotalPages] = useState(1);
	const [totalItems, setTotalItems] = useState(0);
	const [sortOption, setSortOption] = useState('newest');
	const [searchTerm, setSearchTerm] = useState('');
	const debounce = useDebounce(searchTerm, 600);

	useEffect(() => {
		setActiveMenu(ROUTES.AdminCategory);
	}, []);

	const fetchCategories = async (page = currentPage, customLimit = limit, sort = sortOption, search = debounce) => {
		try {
			const data = await getAllCategories(page, customLimit, sort, search);
			setCategories(data.categories);
			setCurrentPage(data.currentPage);
			setTotalPages(data.totalPages);
			setTotalItems(data.totalItems);
			setSelectedCategories([]);
		} catch (error) {
			toast.error('Lỗi lấy danh sách danh mục');
		}
	};

	useEffect(() => {
		fetchCategories();
	}, [currentPage, limit, sortOption, debounce]);

	const handleEditCategory = (id) => {
		setEditCategoryId(id);
		setShowUpdateForm(true);
	};

	const handleConfirmDeleteMany = () => {
		if (selectedCategories.length === 0) {
			toast.warn('Vui lòng chọn ít nhất một danh mục để xóa!');
			return;
		}
		setDeleteMode('multiple');
		setIsModalOpen(true);
	};

	const isAllSelected = selectedCategories.length === categories.length && categories.length > 0;

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
					selectedProducts={selectedCategories}
					onDeleteMany={handleConfirmDeleteMany}
					isAdmin={true}
				/>
				<Button className={styles.addButton} onClick={() => setShowForm(true)}>
					Thêm mới danh mục
				</Button>
			</div>

			{categories.length === 0 ? (
				<div className={styles.noCategories}>
					<Image src={images.boxEmpty} alt='Không có danh mục' width={180} height={180} priority />
					<h4>DỮ LIỆU TRỐNG</h4>
					<p>Hiện tại không có danh mục nào!</p>
					<Button className={styles.btnNoProduct} onClick={() => setShowForm(true)}>
						Thêm mới danh mục
					</Button>
				</div>
			) : (
				<>
					<Table
						users={categories.map((category, index) => ({
							index: (currentPage - 1) * limit + index + 1,
							_id: category._id,
							name: category.name,
							createdAt: category.createdAt,
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
												setSelectedCategories(categories.map((c) => c._id));
											} else {
												setSelectedCategories([]);
											}
										}}
									/>
								),
							},
							{key: 'index', label: 'STT'},
							{key: 'name', label: 'Tên danh mục'},
							{
								key: 'createdAt',
								label: 'Thời gian tạo',
								render: (category) =>
									category.createdAt
										? moment(category.createdAt).locale('vi').format('HH:mm:ss - DD/MM/YYYY')
										: 'Không xác định',
							},
						]}
						renderCheckbox={(category) => (
							<input
								type='checkbox'
								checked={selectedCategories.includes(category._id)}
								onChange={(e) => {
									if (e.target.checked) {
										setSelectedCategories((prev) => [...prev, category._id]);
									} else {
										setSelectedCategories((prev) => prev.filter((id) => id !== category._id));
									}
								}}
							/>
						)}
						renderActions={(category) => (
							<>
								<IconCustom
									icon={<Image src={icons.edit} alt='Edit' width={20} height={20} />}
									iconFilter='invert(38%) sepia(93%) saturate(1382%) hue-rotate(189deg) brightness(89%) contrast(105%)'
									backgroundColor='#dce7ff'
									tooltip='Chỉnh sửa danh mục'
									onClick={() => handleEditCategory(category._id)}
								/>
								<IconCustom
									icon={<Image src={icons.trash} alt='Delete' width={20} height={20} />}
									iconFilter='invert(17%) sepia(100%) saturate(7480%) hue-rotate(1deg) brightness(90%) contrast(105%)'
									backgroundColor='#FFD6D6'
									tooltip='Xóa danh mục'
									onClick={() => {
										setDeleteMode('single');
										setSelectedCategoryId(category._id);
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
							fetchCategories(page, limit);
						}}
						onLimitChange={(newLimit) => {
							setLimit(newLimit);
							setCurrentPage(1);
							fetchCategories(1, newLimit);
						}}
					/>
				</>
			)}

			{showForm && (
				<ModalWrapper onClose={() => setShowForm(false)}>
					<FormCreateCategory onCancel={() => setShowForm(false)} onSuccess={fetchCategories} />
				</ModalWrapper>
			)}

			{showUpdateForm && (
				<ModalWrapper onClose={() => setShowUpdateForm(false)}>
					<FormUpdateCategory
						categoryId={editCategoryId}
						onCancel={() => setShowUpdateForm(false)}
						onSuccess={() => {
							setShowUpdateForm(false);
							fetchCategories();
						}}
					/>
				</ModalWrapper>
			)}

			<ConfirmDeleteModal
				isOpen={isModalOpen}
				onClose={() => setIsModalOpen(false)}
				onConfirm={async () => {
					try {
						if (deleteMode === 'single') {
							await deleteCategory(selectedCategoryId);
							toast.success('Xóa danh mục thành công');
						} else if (deleteMode === 'multiple') {
							await deleteMultipleCategories(selectedCategories);
							toast.success('Xóa nhiều danh mục thành công');
						}
						setIsModalOpen(false);
						await fetchCategories();
					} catch (err) {
						toast.error(err.message || 'Xóa danh mục thất bại');
					}
				}}
				categoryName={
					deleteMode === 'single'
						? categories.find((c) => c._id === selectedCategoryId)?.name
						: `này (${selectedCategories.length} danh mục)`
				}
			/>
		</div>
	);
};

// export default MainPageCategory;

const mapDispatchToProps = (dispatch) => ({
	setActiveMenu: (menuPath) => dispatch(setActiveMenu(menuPath)),
});

export default connect(null, mapDispatchToProps)(MainPageCategory);
