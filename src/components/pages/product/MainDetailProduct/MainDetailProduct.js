import React, {useState, useEffect} from 'react';
import Image from 'next/image';
import {useRouter} from 'next/router';
import styles from './MainDetailProduct.module.scss';
import Breadcrumb from '@/components/common/Breadcrumb/Breadcrumb';
import Button from '@/components/common/Button/Button';
import {ROUTES} from '@/constants/config';
import {getProductById} from '@/services/productService';
import images from '@/constants/static/images';
import {addToCart, getAllCart} from '@/services/cartService';
import {toast} from 'react-toastify';
import {createReview, deleteReview, getReviewsByProductId} from '@/services/reviewService';
import {getCurrentUserIdFromToken} from '@/utils/auth';
import ConfirmDeleteReview from '../ConfirmDeleteReview/ConfirmDeleteReview';
import FormUpdateReview from '../FormUpdateReview/FormUpdateReview';

const ProductDetailPage = () => {
	const router = useRouter();
	const {id} = router.query;
	const [currentUserId, setCurrentUserId] = useState(null);
	const [product, setProduct] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [mainImage, setMainImage] = useState(null);
	const [selectedSize, setSelectedSize] = useState(null);
	const [quantity, setQuantity] = useState(1);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [categoryName, setCategoryName] = useState('');
	const [selectedColor, setSelectedColor] = useState('');
	const [colors, setColors] = useState([]);
	const [sizes, setSizes] = useState([]);
	const [currentPage, setCurrentPage] = useState(1);
	const [totalPages, setTotalPages] = useState(1);
	const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
	const [reviewToDelete, setReviewToDelete] = useState(null);
	const [editingReview, setEditingReview] = useState(null);
	const [reviews, setReviews] = useState([]);
	const [newReview, setNewReview] = useState({rating: 5, comment: ''});
	const [idxActiveImage, setIdxActiveImage] = useState(0);

	useEffect(() => {
		const idFromToken = getCurrentUserIdFromToken();
		setCurrentUserId(idFromToken);
	}, []);

	// Detail Product
	useEffect(() => {
		if (id) {
			const fetchProductDetails = async () => {
				setLoading(true);
				setError(null);
				try {
					const data = await getProductById(id);
					setProduct(data);
					setMainImage(data?.images?.[0]);

					if (data.category && data.category.length > 0) {
						setCategoryName(data.category[0].name);
					}

					if (data.colors && data.colors.length > 0) {
						setColors(data.colors);
						setSelectedColor(data.colors[0]);
					}

					if (data.sizes && data.sizes.length > 0) {
						setSizes(data.sizes);
						setSelectedSize(data.sizes[0]);
					}

					setLoading(false);
				} catch (err) {
					setError(err.message || 'Không thể tải thông tin sản phẩm.');
					setLoading(false);
				}
			};

			fetchProductDetails();
		}
	}, [id]);

	// All Review ProductId
	useEffect(() => {
		if (product?._id) {
			const fetchReviews = async () => {
				try {
					const {reviews, totalPages} = await getReviewsByProductId(product._id, currentPage);
					setReviews(reviews);
					setTotalPages(totalPages);
				} catch (err) {
					console.error('Lỗi khi tải đánh giá:', err);
				}
			};
			fetchReviews();
		}
	}, [product?._id, currentPage]);

	const averageRating = reviews.length > 0 ? reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length : 0;

	// Thêm vào giỏ hàng
	const handleAddToCart = async () => {
		if (!selectedSize) {
			toast.warn('Vui lòng chọn kích thước!');
			return;
		}

		const payload = {
			productId: product._id,
			color: product.colors?.[0] || 'Không xác định',
			image: product.images?.[0],
			sizeId: selectedSize,
			quantity: quantity,
		};

		try {
			await addToCart(payload);

			const updatedCart = await getAllCart();
			localStorage.setItem('cart', JSON.stringify(updatedCart.items || []));
			if (typeof window !== 'undefined') {
				window.dispatchEvent(new Event('storage'));
			}

			toast.success('Đã thêm vào giỏ hàng!');
		} catch (err) {
			console.error(err);
			toast.error('Không thể thêm vào giỏ hàng.');
		}
	};

	// Thanh toán ngay
	const handleBuyNow = () => {
		if (!selectedSize) {
			toast.warn('Vui lòng chọn kích thước!');
			return;
		}

		const buyNowItem = {
			productId: product._id,
			name: product.name,
			color: product.colors?.[0]?.name,
			image: product.images?.[0],
			sizeId: selectedSize,
			sizeName: product.quantityBySize?.find((s) => s.sizeId === selectedSize)?.name,
			quantity: quantity,
			price: product.price,
		};

		localStorage.setItem('buyNow', JSON.stringify([buyNowItem]));
		router.push(ROUTES.Order);
	};

	// Thêm Review
	const handleAddReview = async (e) => {
		e.preventDefault();

		const token = localStorage.getItem('token');
		if (!token) {
			toast.warning('Vui lòng đăng nhập để gửi đánh giá.');
			return;
		}

		const reviewPayload = {
			productId: product._id,
			rating: newReview.rating,
			comment: newReview.comment,
		};

		try {
			await createReview(reviewPayload);
			toast.success('Cảm ơn bạn đã đánh giá. Chúc bạn một ngày mới tốt lành!');
			setCurrentPage(1);
			const {reviews, totalPages} = await getReviewsByProductId(product._id, 1);
			setReviews(reviews);
			setTotalPages(totalPages);
			setNewReview({rating: 5, comment: ''});
		} catch (err) {
			toast.error(err.response?.data?.message || 'Không thể gửi đánh giá.');
		}
	};

	const handleSizeChange = (sizeId) => {
		setSelectedSize(sizeId);
	};

	const handleQuantityChange = (type) => {
		setQuantity((prev) => (type === 'increase' ? Math.min(prev + 1, 10) : Math.max(prev - 1, 1)));
	};

	const handleDeleteClick = (reviewId) => {
		setReviewToDelete(reviewId);
		setIsDeleteModalOpen(true);
	};

	const handleCloseModal = () => {
		setIsDeleteModalOpen(false);
		setReviewToDelete(null);
	};

	const handleEdit = (review) => {
		setEditingReview(review);
	};

	const handleCancelEdit = () => {
		setEditingReview(null);
	};

	// Xóa review
	const handleConfirmDelete = async () => {
		try {
			await deleteReview(reviewToDelete);
			toast.success('Xóa đánh giá thành công!');
			const {reviews, totalPages} = await getReviewsByProductId(product._id, currentPage);
			setReviews(reviews);
			setTotalPages(totalPages);
		} catch (error) {
			toast.error(error.message || 'Không thể xóa đánh giá.');
		} finally {
			handleCloseModal();
		}
	};

	if (loading) {
		return <p>Đang tải thông tin sản phẩm...</p>;
	}

	if (error) {
		return <p>Lỗi: {error}</p>;
	}

	if (!product) {
		return <p>Không tìm thấy sản phẩm.</p>;
	}

	const breadcrumbItems = {
		titles: ['Trang chủ', 'Danh sách sản phẩm', categoryName, product.name],
		listHref: [ROUTES.Home, ROUTES.Product, `/product/${product._id}`, `/product/${product._id}`],
	};

	return (
		<div className={styles.container}>
			<Breadcrumb titles={breadcrumbItems.titles} listHref={breadcrumbItems.listHref} />

			<div className={styles.main}>
				<div className={styles.imageGallery}>
					<Image
						src={mainImage}
						alt={product.name}
						width={600}
						height={600}
						className={styles.mainImage}
						onClick={() => setMainImage(mainImage)}
						onError={(e) => {
							e.target.onerror = null;
							e.target.src = images.placeholder;
						}}
					/>

					{product.images && product.images.length > 1 && (
						<div className={styles.thumbnailContainer}>
							{product.images.map((img, index) => (
								<Image
									key={index}
									src={img}
									alt={`Thumbnail ${index + 1}`}
									width={80}
									height={80}
									className={`${styles.thumbnail} ${index === idxActiveImage ? styles.active : ''}`}
									onClick={() => {
										setIdxActiveImage(index);
										setMainImage(img);
									}}
									onError={(e) => {
										e.target.onerror = null;
										e.target.src = images.placeholder;
									}}
								/>
							))}
						</div>
					)}

					{isModalOpen && (
						<div className={styles.modal} onClick={() => setIsModalOpen(false)}>
							<div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
								<Image src={mainImage} alt='Zoomed Image' width={650} height={650} className={styles.zoomedImage} />
							</div>
						</div>
					)}
				</div>

				<div className={styles.productInfo}>
					<h1 className={styles.productTitle}>{product.name}</h1>
					<p className={styles.productId}>{product.code}</p>

					<div className={styles.colorSelect}>
						<span>Màu: </span>
						{product.colors?.[0] && (
							<>
								<span className={styles.colorDot} style={{backgroundColor: product.colors[0].colorCode || '#000'}}></span>
								<span>{product.colors[0].name}</span>
							</>
						)}
					</div>

					<p className={styles.productPrice}>
						<span className={styles.labelPrice}>Giá: </span>
						{product.price?.toLocaleString('vi-VN', {style: 'currency', currency: 'VND'})}
					</p>

					{product.quantityBySize && product.quantityBySize.length > 0 && (
						<div className={styles.sizeSelect}>
							<p>Lựa chọn kích cỡ:</p>
							{product.quantityBySize.map((sizeObj) => (
								<button
									key={sizeObj._id}
									className={`${styles.sizeButton} ${selectedSize === sizeObj.sizeId ? styles.active : ''}`}
									onClick={() => handleSizeChange(sizeObj.sizeId)}
									disabled={sizeObj.quantity <= 0}
								>
									{sizeObj.name} ({sizeObj.quantity})
								</button>
							))}
						</div>
					)}

					<div className={styles.quantitySelect}>
						<p>Số lượng:</p>
						<button onClick={() => handleQuantityChange('decrease')}>-</button>
						<span>{quantity}</span>
						<button onClick={() => handleQuantityChange('increase')}>+</button>
					</div>

					<div className={styles.buttonGroup}>
						<Button className={styles.addToCart} onClick={handleAddToCart}>
							Thêm giỏ hàng
						</Button>
						<Button className={styles.buyNow} onClick={handleBuyNow}>
							Thanh toán ngay
						</Button>
					</div>

					{product.description && (
						<div className={styles.additionalDescription}>
							<h3>Mô tả ngắn</h3>
							<p>{product.description}</p>
						</div>
					)}

					{product.detailDescription && (
						<div className={styles.productDescription}>
							<h3>Mô tả chi tiết</h3>
							<div dangerouslySetInnerHTML={{__html: product.detailDescription}} />
						</div>
					)}
				</div>
			</div>

			{/* Review */}
			<div className={styles.reviewSection}>
				<h3>Đánh giá sản phẩm</h3>
				<p>
					⭐ Trung bình: {averageRating.toFixed(1)} / 5 ({reviews.length} đánh giá)
				</p>

				<div className={styles.reviewList}>
					{reviews.map((review) => (
						<div key={review.id} className={styles.reviewItem}>
							<p className={styles.reviewName}>
								<strong>{review.name}</strong>
							</p>
							<p className={styles.reviewRating}>⭐ {review.rating} / 5</p>
							<p className={styles.reviewComment}>{review.comment}</p>
							{currentUserId === review.userId && (
								<div className={styles.reviewActions}>
									<span className={styles.actionEdit} onClick={() => handleEdit(review)}>
										Sửa
									</span>
									<span className={styles.actionDelete} onClick={() => handleDeleteClick(review._id)}>
										Xóa
									</span>
								</div>
							)}
						</div>
					))}
				</div>

				<form className={styles.reviewForm} onSubmit={handleAddReview}>
					<select value={newReview.rating} onChange={(e) => setNewReview({...newReview, rating: Number(e.target.value)})}>
						<option value='5'>⭐ 5 - Rất tốt</option>
						<option value='4'>⭐ 4 - Tốt</option>
						<option value='3'>⭐ 3 - Bình thường</option>
						<option value='2'>⭐ 2 - Không tốt</option>
						<option value='1'>⭐ 1 - Tệ</option>
					</select>
					<textarea
						placeholder='Đánh giá của bạn'
						value={newReview.comment}
						onChange={(e) => setNewReview({...newReview, comment: e.target.value})}
						required
					/>
					<Button type='submit'>Gửi đánh giá</Button>
				</form>
			</div>

			{/* <div className={styles.pagination}>
				{Array.from({length: totalPages}, (_, i) => (
					<button key={i} className={i + 1 === currentPage ? styles.activePage : ''} onClick={() => setCurrentPage(i + 1)}>
						{i + 1}
					</button>
				))}
			</div> */}

			{editingReview && (
				<FormUpdateReview
					review={editingReview}
					productId={product._id}
					onCancel={handleCancelEdit}
					onUpdated={(newReviews, totalPages) => {
						setReviews(newReviews);
						setTotalPages(totalPages);
						setCurrentPage(1);
					}}
				/>
			)}

			<ConfirmDeleteReview isOpen={isDeleteModalOpen} onClose={handleCloseModal} onConfirm={handleConfirmDelete} />
		</div>
	);
};

export default ProductDetailPage;
