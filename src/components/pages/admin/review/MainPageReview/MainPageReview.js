import React, {useState, useEffect} from 'react';
import styles from './MainPageReview.module.scss';
import Table from '@/components/common/Table/Table';
import Pagination from '@/components/common/Pagination/Pagination';
import ModalWrapper from '@/components/common/ModalWrapper/ModalWrapper';
import ConfirmDeleteModal from '../ConfirmDeleteModal/ConfirmDeleteModal';
import IconCustom from '@/components/common/IconCustom/IconCustom';
import Image from 'next/image';
import icons from '@/constants/static/icons';
import {getAllReviewsForAdmin, deleteReview, deleteMultipleReviews} from '@/services/reviewService';
import {toast} from 'react-toastify';
import useDebounce from '@/hooks/useDebounce';
import FilterAdmin from '@/components/common/FilterAdmin/FilterAdmin';
import MainDetailReview from '../MainDetailReview/MainDetailReview';
import {setActiveMenu} from '@/redux/actions/menuTabActions';
import {ROUTES} from '@/constants/config';
import {connect} from 'react-redux';

const MainPageReview = ({setActiveMenu}) => {
	const [reviews, setReviews] = useState([]);
	const [currentPage, setCurrentPage] = useState(1);
	const [limit, setLimit] = useState(5);
	const [totalPages, setTotalPages] = useState(1);
	const [totalItems, setTotalItems] = useState(0);
	const [searchTerm, setSearchTerm] = useState('');
	const [sortOption, setSortOption] = useState('');
	const [selectedRating, setSelectedRating] = useState('');
	const [selectedReviews, setSelectedReviews] = useState([]);
	const [deleteMode, setDeleteMode] = useState('single'); // 'single' | 'multiple'
	const debouncedSearchTerm = useDebounce(searchTerm, 500);

	const [showUpdateForm, setShowUpdateForm] = useState(false);
	const [editReviewId, setEditReviewId] = useState(null);
	const [selectedReviewId, setSelectedReviewId] = useState(null);
	const [isModalOpen, setIsModalOpen] = useState(false);

	useEffect(() => {
		setActiveMenu(ROUTES.AdminReview);
	}, []);

	const fetchReviews = async () => {
		try {
			const data = await getAllReviewsForAdmin(currentPage, limit, debouncedSearchTerm, selectedRating, sortOption);
			setReviews(data.reviews || []);
			setTotalPages(data.totalPages || 1);
			setTotalItems(data.total || 0);
		} catch (error) {
			toast.error(error.message || 'Lỗi lấy danh sách đánh giá');
		}
	};

	useEffect(() => {
		fetchReviews();
	}, [currentPage, limit, debouncedSearchTerm, selectedRating, sortOption]);

	// Xóa review
	const handleDelete = async () => {
		try {
			await deleteReview(selectedReviewId);
			toast.success('Xóa đánh giá thành công');
			fetchReviews();
		} catch (error) {
			toast.error(error.message || 'Xóa thất bại');
		} finally {
			setIsModalOpen(false);
		}
	};

	const handleEditReview = (reviewId) => {
		setEditReviewId(reviewId);
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
						{value: '', label: 'Sắp xếp'},
						{value: 'newest', label: 'Mới nhất'},
						{value: 'oldest', label: 'Cũ nhất'},
					]}
					filters={[
						{
							name: 'rating',
							value: selectedRating,
							onChange: setSelectedRating,
							options: [
								{value: '', label: 'Tất cả đánh giá'},
								{value: '5', label: '5 sao'},
								{value: '4', label: '4 sao'},
								{value: '3', label: '3 sao'},
								{value: '2', label: '2 sao'},
								{value: '1', label: '1 sao'},
							],
						},
					]}
					selectedProducts={selectedReviews}
					onDeleteMany={() => {
						if (!selectedReviews || selectedReviews.length === 0) {
							toast.warn('Vui lòng chọn ít nhất một đánh giá để xoá!');
							return;
						}
						setDeleteMode('multiple');
						setSelectedReviewId(null);
						setIsModalOpen(true);
					}}
					isAdmin={true}
				/>
			</div>

			{reviews.length === 0 ? (
				<div className={styles.noProducts}>
					<p>Không có đánh giá phù hợp.</p>
				</div>
			) : (
				<>
					<Table
						users={reviews.map((review, index) => ({
							index: (currentPage - 1) * limit + index + 1,
							_id: review._id,
							name: review.user?.name || review.name,
							email: review.user?.email,
							productName: review.product?.name,
							rating: review.rating,
							comment: review.comment,
							createdAt: review.createdAt,
						}))}
						headers={[
							{
								key: 'checkbox',
								label: (
									<input
										type='checkbox'
										checked={selectedReviews.length === reviews.length && reviews.length > 0}
										onChange={(e) => {
											if (e.target.checked) {
												setSelectedReviews(reviews.map((r) => r._id));
											} else {
												setSelectedReviews([]);
											}
										}}
									/>
								),
							},
							{key: 'index', label: 'STT'},
							{key: 'name', label: 'Tên người dùng'},
							{key: 'email', label: 'Email'},
							{key: 'productName', label: 'Sản phẩm'},
							{key: 'rating', label: 'Đánh giá sao'},
							{key: 'comment', label: 'Bình luận'},
							{
								key: 'createdAt',
								label: 'Thời gian tạo',
								render: (review) =>
									new Date(review.createdAt).toLocaleString('vi-VN', {
										hour: '2-digit',
										minute: '2-digit',
										second: '2-digit',
										day: '2-digit',
										month: '2-digit',
										year: 'numeric',
									}),
							},
						]}
						renderCheckbox={(review) => (
							<input
								type='checkbox'
								checked={selectedReviews.includes(review._id)}
								onChange={(e) => {
									if (e.target.checked) {
										setSelectedReviews((prev) => [...prev, review._id]);
									} else {
										setSelectedReviews((prev) => prev.filter((id) => id !== review._id));
									}
								}}
							/>
						)}
						renderActions={(review) => (
							<>
								<IconCustom
									icon={<Image src={icons.eye} alt='Edit' width={20} height={20} />}
									iconFilter='brightness(0) '
									backgroundColor='#FFF200'
									tooltip='Chi tiết đánh giá'
									onClick={() => handleEditReview(review._id)}
								/>
								<IconCustom
									icon={<Image src={icons.trash} alt='Delete' width={20} height={20} />}
									iconFilter='invert(66%) sepia(35%) saturate(5412%) hue-rotate(338deg) brightness(98%) contrast(90%)'
									backgroundColor='#ffe4e4'
									tooltip='Xóa đánh giá'
									onClick={() => {
										setSelectedReviewId(review._id);
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
						onPageChange={(page) => setCurrentPage(page)}
						onLimitChange={(newLimit) => {
							setLimit(newLimit);
							setCurrentPage(1);
						}}
					/>
				</>
			)}

			{showUpdateForm && (
				<ModalWrapper onClose={() => setShowUpdateForm(false)}>
					<MainDetailReview
						reviewId={editReviewId}
						onCancel={() => setShowUpdateForm(false)}
						onSuccess={() => {
							setShowUpdateForm(false);
							fetchReviews();
						}}
					/>
				</ModalWrapper>
			)}

			<ConfirmDeleteModal
				isOpen={isModalOpen}
				onClose={() => setIsModalOpen(false)}
				onConfirm={async () => {
					try {
						if (deleteMode === 'single' && selectedReviewId) {
							await deleteReview(selectedReviewId);
							toast.success('Xóa đánh giá thành công');
						} else if (deleteMode === 'multiple') {
							await deleteMultipleReviews(selectedReviews);
							toast.success('Xóa nhiều đánh giá thành công');
						}
						setIsModalOpen(false);
						setSelectedReviews([]);
						fetchReviews();
					} catch (error) {
						toast.error(error.message || 'Xóa đánh giá thất bại');
					}
				}}
				reviewName={reviews.find((s) => s._id === selectedReviewId)?.name}
			/>
		</div>
	);
};

// export default MainPageReview;

const mapDispatchToProps = (dispatch) => ({
	setActiveMenu: (menuPath) => dispatch(setActiveMenu(menuPath)),
});

export default connect(null, mapDispatchToProps)(MainPageReview);
