import React, {useEffect, useState} from 'react';
import styles from './MainPageColor.module.scss';
import Image from 'next/image';
import {toast} from 'react-toastify';
import IconCustom from '@/components/common/IconCustom/IconCustom';
import Table from '@/components/common/Table/Table';
import icons from '@/constants/static/icons';
import Pagination from '@/components/common/Pagination/Pagination';
import {getAllColors, deleteColor} from '@/services/colorService';
import ConfirmDeleteModal from '../ConfirmDeleteModal/ConfirmDeleteModal';
import Button from '@/components/common/Button/Button';
import ModalWrapper from '@/components/common/ModalWrapper/ModalWrapper';
import FormCreateColor from '../FormCreateColor/FormCreateColor';
import FormUpdateColor from '../FormUpdateColor/FormUpdateColor';
import images from '@/constants/static/images';

const MainPageColor = () => {
	const [currentPage, setCurrentPage] = useState(1);
	const [colors, setColors] = useState([]);
	const usersPerPage = 5;
	const [showForm, setShowForm] = useState(false);
	const [isModalOpen, setIsModalOpen] = useState(false); // Create
	const [selectedColorId, setSelectedColorId] = useState(null); // Create
	const [showUpdateForm, setShowUpdateForm] = useState(false); // Update
	const [editColorId, setEditColorId] = useState(null); // Update

	const fetchColors = async () => {
		try {
			const data = await getAllColors();
			setColors(data);
		} catch (error) {
			console.error('Lỗi lấy danh sách màu:', error.message);
		}
	};

	useEffect(() => {
		fetchColors();
	}, []);

	const totalPages = Math.ceil(colors.length / usersPerPage);
	const indexOfLastUser = currentPage * usersPerPage;
	const indexOfFirstUser = indexOfLastUser - usersPerPage;
	const currentUsers = colors.slice(indexOfFirstUser, indexOfLastUser);

	const handlePageChange = (pageNumber) => {
		setCurrentPage(pageNumber);
	};

	const handleEditColor = (id) => {
		setEditColorId(id);
		setShowUpdateForm(true);
	};

	return (
		<div className={styles.container}>
			<div className={styles.header}>
				<h2>Quản lý màu sắc</h2>
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
							users={currentUsers}
							headers={[
								{key: '_id', label: 'ID'},
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
								{key: 'description', label: 'Mô tả'},
							]}
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
											setIsModalOpen(true);
										}}
									/>
								</>
							)}
						/>
					</div>

					{colors.length > 0 && (
						<Pagination
							currentPage={currentPage}
							totalPages={totalPages}
							onPageChange={handlePageChange}
							totalItems={colors.length}
						/>
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
						await deleteColor(selectedColorId);
						toast.success('Xóa màu thành công');
						await fetchColors();
						setIsModalOpen(false);
					} catch (error) {
						toast.error(error.message || 'Xóa màu thất bại');
					}
				}}
				colorName={colors.find((c) => c._id === selectedColorId)?.name}
			/>
		</div>
	);
};

export default MainPageColor;
