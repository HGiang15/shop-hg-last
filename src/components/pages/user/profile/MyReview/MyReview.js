import React, {useEffect, useState} from 'react';
import styles from './MyReview.module.scss';
import {deleteReview, getReviewsByUser} from '@/services/reviewService';
import moment from 'moment';
import 'moment/locale/vi';
import FormUpdateReview from '@/components/pages/product/FormUpdateReview/FormUpdateReview';
import ConfirmDeleteReview from '@/components/pages/product/ConfirmDeleteReview/ConfirmDeleteReview';
import {toast} from 'react-toastify';
moment.locale('vi');

const MyReview = () => {
	const [reviews, setReviews] = useState([]);
	const [page, setPage] = useState(1);
	const [hasMore, setHasMore] = useState(true);
	const [loading, setLoading] = useState(true);
	const [loadingMore, setLoadingMore] = useState(false);
	const [editingReview, setEditingReview] = useState(null);
	const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
	const [reviewToDelete, setReviewToDelete] = useState(null);

	const fetchReviews = async (currentPage = 1) => {
		try {
			const limit = 2;
			const res = await getReviewsByUser(currentPage, limit);
			if (currentPage === 1) {
				setReviews(res.reviews);
			} else {
				setReviews((prev) => [...prev, ...res.reviews]);
			}
			setHasMore(currentPage < res.totalPages);
		} catch (err) {
			toast.error(err.message || 'Lỗi khi tải đánh giá');
		} finally {
			setLoading(false);
			setLoadingMore(false);
		}
	};

	useEffect(() => {
		fetchReviews(1);
	}, []);

	const handleLoadMore = () => {
		if (hasMore) {
			setLoadingMore(true);
			const nextPage = page + 1;
			setPage(nextPage);
			fetchReviews(nextPage);
		}
	};

	const handleEdit = (review) => {
		setEditingReview(review);
	};

	const handleCancelEdit = () => {
		setEditingReview(null);
	};

	const handleDeleteClick = (reviewId) => {
		setReviewToDelete(reviewId);
		setIsDeleteModalOpen(true);
	};

	const handleCloseModal = () => {
		setIsDeleteModalOpen(false);
		setReviewToDelete(null);
	};

	const handleConfirmDelete = async () => {
		try {
			await deleteReview(reviewToDelete);
			toast.success('Xóa đánh giá thành công!');
			fetchReviews(1);
			setPage(1);
		} catch (error) {
			toast.error(error.message || 'Không thể xóa đánh giá.');
		} finally {
			handleCloseModal();
		}
	};

	if (loading) return <div className={styles.loading}>Đang tải đánh giá...</div>;
	if (reviews.length === 0) return <div className={styles.empty}>Bạn chưa viết đánh giá nào.</div>;

	return (
		<div className={styles.container}>
			<h2 className={styles.title}>Đánh giá của tôi</h2>
			<div className={styles.reviewList}>
				{reviews.map((review) => (
					<div key={review._id} className={styles.reviewCard}>
						<div className={styles.header}>
							<strong>Sản phẩm:</strong> {review.productId?.name}
						</div>
						<div className={styles.rating}>⭐ {review.rating}/5</div>
						<p className={styles.comment}>{review.comment}</p>
						<div className={styles.date}>
							<span>Gửi lúc: {moment(review.createdAt).format('LLL')}</span>
						</div>

						<div className={styles.actions}>
							<span className={styles.actionEdit} onClick={() => handleEdit(review)}>
								Sửa
							</span>
							<span className={styles.actionDelete} onClick={() => handleDeleteClick(review._id)}>
								Xóa
							</span>
						</div>
					</div>
				))}
			</div>

			{hasMore && (
				<div className={styles.loadMoreWrapper}>
					<button onClick={handleLoadMore} className={styles.loadMoreBtn} disabled={loadingMore}>
						{loadingMore ? 'Đang tải...' : 'Xem thêm'}
					</button>
				</div>
			)}

			{editingReview && (
				<FormUpdateReview
					review={editingReview}
					productId={editingReview.productId?._id}
					onCancel={handleCancelEdit}
					onUpdated={() => {
						fetchReviews(1);
						setEditingReview(null);
						setPage(1);
					}}
				/>
			)}

			<ConfirmDeleteReview isOpen={isDeleteModalOpen} onClose={handleCloseModal} onConfirm={handleConfirmDelete} />
		</div>
	);
};

export default MyReview;
