import React, {useEffect, useState} from 'react';
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
import {getAllSizes, deleteSize} from '@/services/sizeService';
import {toast} from 'react-toastify';
import FormUpdateSize from '../FormUpdateSize/FormUpdateSize';

const MainPageSize = () => {
	const [sizes, setSizes] = useState([]);
	const [currentPage, setCurrentPage] = useState(1);
	const [showForm, setShowForm] = useState(false); // Create
	const [showUpdateForm, setShowUpdateForm] = useState(false); // Update
	const [editSizeId, setEditSizeId] = useState(null); // Update
	const [selectedSizeId, setSelectedSizeId] = useState(null); // Delete
	const [isModalOpen, setIsModalOpen] = useState(false); // Delete
	const [totalPages, setTotalPages] = useState(1);
	const [totalItems, setTotalItems] = useState(0);
	const [limit, setLimit] = useState(5);

	// Get all sizes
	const fetchSizes = async (page = currentPage, customLimit = limit) => {
		try {
			const data = await getAllSizes(page, customLimit);
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
	}, []);

	const handleEditSize = (id) => {
		setEditSizeId(id);
		setShowUpdateForm(true);
	};

	// Delete Size
	const handleDelete = async () => {
		try {
			await deleteSize(selectedSizeId);
			toast.success('Xóa kích cỡ thành công');
			fetchSizes();
		} catch (error) {
			toast.error('Xóa thất bại');
		} finally {
			setIsModalOpen(false);
		}
	};

	return (
		<div className={styles.container}>
			<div className={styles.header}>
				<Button className={styles.addButton} onClick={() => setShowForm(true)}>
					Thêm mới kích cỡ
				</Button>
			</div>

			<Table
				users={sizes.map((size, index) => ({
					index: (currentPage - 1) * limit + index + 1,
					_id: size._id,
					name: size.name,
					description: size.description,
					createdAt: size.createdAt,
				}))}
				headers={[
					{key: 'index', label: 'STT'},
					{key: 'name', label: 'Tên kích cỡ'},
					{key: 'description', label: 'Mô tả'},
					{
						key: 'createdAt',
						label: 'Thời gian tạo',
						render: (size) =>
							new Date(size.createdAt).toLocaleString('vi-VN', {
								hour: '2-digit',
								minute: '2-digit',
								second: '2-digit',
								day: '2-digit',
								month: '2-digit',
								year: 'numeric',
							}),
					},
				]}
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
				onConfirm={handleDelete}
				sizeName={sizes.find((s) => s._id === selectedSizeId)?.name}
			/>
		</div>
	);
};

export default MainPageSize;
