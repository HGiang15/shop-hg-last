import React, {useState, useEffect} from 'react';
import {getReviewById, updateReview} from '@/services/reviewService';
import {getProductById} from '@/services/productService';
import styles from './MainDetailReview.module.scss';
import Button from '@/components/common/Button/Button';
import moment from 'moment';

const MainDetailReview = ({reviewId, onCancel, onSuccess}) => {
	const [loading, setLoading] = useState(false);
	const [loadingSubmit, setLoadingSubmit] = useState(false);
	const [error, setError] = useState('');

	const [rating, setRating] = useState('');
	const [comment, setComment] = useState('');
	const [reviewInfo, setReviewInfo] = useState(null);
	const [productName, setProductName] = useState('');

	useEffect(() => {
		if (!reviewId) return;

		const fetchData = async () => {
			try {
				setLoading(true);
				const review = await getReviewById(reviewId);
				setRating(review.rating || '');
				setComment(review.comment || '');
				setReviewInfo(review);

				if (review.productId) {
					const product = await getProductById(review.productId);
					setProductName(product.name || '');
				}
			} catch (err) {
				setError(err.message || 'Không tải được chi tiết đánh giá');
			} finally {
				setLoading(false);
			}
		};

		fetchData();
	}, [reviewId]);

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError('');
		setLoadingSubmit(true);

		try {
			await updateReview(reviewId, {rating, comment});
			onSuccess();
		} catch (err) {
			setError(err.message || 'Cập nhật thất bại');
		} finally {
			setLoadingSubmit(false);
		}
	};

	if (loading) return <div>Đang tải dữ liệu...</div>;

	return (
		<form onSubmit={handleSubmit} className={styles.container}>
			{error && <p className={styles.error}>{error}</p>}

			{reviewInfo && (
				<div className={styles.infoBox}>
					<p>
						<strong>Người dùng:</strong> {reviewInfo.name || 'Không rõ'}
					</p>
					<p>
						<strong>Sản phẩm đánh giá:</strong> {productName || 'Không rõ'}
					</p>
					<p>
						<strong>Thời gian đăng:</strong> {moment(reviewInfo.createdAt).format('DD/MM/YYYY HH:mm')}
					</p>
				</div>
			)}

			<div className={styles.field}>
				<label className={styles.label}>Đánh giá sao:</label>
				<select value={rating} onChange={(e) => setRating(e.target.value)} className={styles.select} required>
					{[5, 4, 3, 2, 1].map((r) => (
						<option key={r} value={r}>
							{r} sao ⭐
						</option>
					))}
				</select>
			</div>

			<div className={styles.field}>
				<label className={styles.label}>Bình luận:</label>
				<textarea
					rows={4}
					value={comment}
					onChange={(e) => setComment(e.target.value)}
					className={styles.textarea}
					placeholder='Nhập bình luận...'
					required
				/>
			</div>

			<div className={styles.buttonGroup}>
				<Button type='button' className={`${styles.button} ${styles.cancelButton}`} onClick={onCancel} disabled={loadingSubmit}>
					Hủy
				</Button>
			</div>
		</form>
	);
};

export default MainDetailReview;
