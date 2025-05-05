import React, {useState, useEffect} from 'react';
import styles from './MainPageCategory.module.scss';
import Table from '@/components/common/Table/Table';
import Pagination from '@/components/common/Pagination/Pagination';
import Button from '@/components/common/Button/Button';
import {ROUTES} from '@/constants/config';
import {useRouter} from 'next/router';
import Image from 'next/image';
import {getAllCategories, deleteCategory} from '@/services/categoryService';
import icons from '@/constants/static/icons';
import images from '@/constants/static/images';
import IconCustom from '@/components/common/IconCustom/IconCustom';
import ConfirmDeleteModal from '../ConfirmDeleteModal/ConfirmDeleteModal';
import {toast} from 'react-toastify';
import FormCreateCategory from '../FormCreateCategory/FormCreateCategory';
import ModalWrapper from '@/components/common/ModalWrapper/ModalWrapper';
import FormUpdateCategory from '../FormUpdateCategory/FormUpdateCategory';

const MainPageCategory = () => {
	const router = useRouter();
	const [categories, setCategories] = useState([]);
	const [currentPage, setCurrentPage] = useState(1);
	const [showForm, setShowForm] = useState(false); // Create
	const [showUpdateForm, setShowUpdateForm] = useState(false); // Update
	const [editCategoryId, setEditCategoryId] = useState(null); // Update
	const [selectedCategoryId, setSelectedCategoryId] = useState(null); // Delete
	const [isModalOpen, setIsModalOpen] = useState(false); // Delete

	const fetchCategories = async () => {
		try {
			const data = await getAllCategories();
			console.log('Categories:', data);
			setCategories(data);
		} catch (error) {
			console.error('Lỗi lấy danh sách danh mục:', error.message);
		}
	};

	useEffect(() => {
		fetchCategories();
	}, []);

	const categoriesPerPage = 5;
	const totalPages = Math.ceil(categories.length / categoriesPerPage);
	const currentCategories = categories.slice((currentPage - 1) * categoriesPerPage, currentPage * categoriesPerPage);

	const handlePageChange = (page) => setCurrentPage(page);

	const handleEditCategory = (id) => {
		setEditCategoryId(id);
		setShowUpdateForm(true);
	};

	return (
		<div className={styles.container}>
			<div className={styles.header}>
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
						users={currentCategories.map((category, index) => ({
							index: (currentPage - 1) * categoriesPerPage + index + 1,
							_id: category._id,
							name: category.name,
							createdAt: category.createdAt,
						}))}
						headers={[
							{key: 'index', label: 'STT'},
							{key: '_id', label: 'Mã danh mục'},
							{key: 'name', label: 'Tên danh mục'},
							{
								key: 'createdAt',
								label: 'Thời gian tạo',
								render: (category) => {
									const date = new Date(category.createdAt);
									return isNaN(date.getTime())
										? 'Không xác định'
										: date.toLocaleString('vi-VN', {
												hour: '2-digit',
												minute: '2-digit',
												second: '2-digit',
												day: '2-digit',
												month: '2-digit',
												year: 'numeric',
										  });
								},
							},
						]}
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
						onPageChange={handlePageChange}
						totalItems={categories.length}
						itemsPerPage={categoriesPerPage}
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
					<FormUpdateCategory categoryId={editCategoryId} onCancel={() => setShowUpdateForm(false)} onSuccess={fetchCategories} />
				</ModalWrapper>
			)}

			<ConfirmDeleteModal
				isOpen={isModalOpen}
				onClose={() => setIsModalOpen(false)}
				onConfirm={async () => {
					try {
						await deleteCategory(selectedCategoryId);
						toast.success('Xóa danh mục thành công');
						const updated = await getAllCategories();
						setCategories(updated);
						setIsModalOpen(false);
					} catch (err) {
						toast.error(err.message || 'Xóa danh mục thất bại');
					}
				}}
				categoryName={categories.find((category) => category._id === selectedCategoryId)?.name}
			/>
		</div>
	);
};

export default MainPageCategory;
