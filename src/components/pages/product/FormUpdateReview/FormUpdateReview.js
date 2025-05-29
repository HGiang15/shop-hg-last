import React, {useState} from 'react';
import styles from './FormUpdateReview.module.scss';
import {toast} from 'react-toastify';
import {getReviewsByProductId, updateReview} from '@/services/reviewService';

const FormUpdateReview = ({review, productId, onCancel, onUpdated}) => {
	const [rating, setRating] = useState(review.rating);
	const [comment, setComment] = useState(review.comment);

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			await updateReview(review._id, {rating, comment});
			toast.success('Đã cập nhật đánh giá!');
			const {reviews, totalPages} = await getReviewsByProductId(productId, 1);
			onUpdated(reviews, totalPages);
			onCancel();
		} catch (error) {
			toast.error(error.message || 'Không thể cập nhật đánh giá.');
		}
	};

	return (
		<form className={styles.container} onSubmit={handleSubmit}>
			<h4>Sửa đánh giá</h4>
			<select value={rating} onChange={(e) => setRating(Number(e.target.value))}>
				<option value='5'>⭐ 5 - Rất tốt</option>
				<option value='4'>⭐ 4 - Tốt</option>
				<option value='3'>⭐ 3 - Bình thường</option>
				<option value='2'>⭐ 2 - Không tốt</option>
				<option value='1'>⭐ 1 - Tệ</option>
			</select>
			<textarea value={comment} onChange={(e) => setComment(e.target.value)} placeholder='Nội dung đánh giá' required />
			<div className={styles.actions}>
				<button type='submit'>Cập nhật</button>
				<button type='button' onClick={onCancel}>
					Huỷ
				</button>
			</div>
		</form>
	);
};

export default FormUpdateReview;
