import {useEffect, useState, useMemo} from 'react';
import Image from 'next/image';
import {useRouter} from 'next/router';
import styles from './MainDetailProduct.module.scss';
import Breadcrumb from '@/components/common/Breadcrumb/Breadcrumb';
import Button from '@/components/common/Button/Button';
import {ROUTES} from '@/constants/config';
import {getProductById} from '@/services/productService';
import images from '@/constants/static/images';
import {toast} from 'react-toastify';
import {createReview, deleteReview, getReviewsByProductId} from '@/services/reviewService';
import {getCurrentUserIdFromToken} from '@/utils/auth';
import ConfirmDeleteReview from '../ConfirmDeleteReview/ConfirmDeleteReview';
import FormUpdateReview from '../FormUpdateReview/FormUpdateReview';
import useCart from '@/hooks/useCart';

const ProductDetailPage = () => {
	const router = useRouter();
	const {id} = router.query;
	const {addItemToCart} = useCart();

	const [currentUserId, setCurrentUserId] = useState(null);
	const [product, setProduct] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [mainImage, setMainImage] = useState(null);
	const [selectedSize, setSelectedSize] = useState('');
	const [quantity, setQuantity] = useState(1);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [categoryName, setCategoryName] = useState('');
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
				try {
					const data = await getProductById(id);
					setProduct(data);
					setMainImage(data?.images?.[0]);
					if (data.category && data.category.length > 0) {
						setCategoryName(data.category[0].name);
					}
					// Tự động chọn size đầu tiên
					const firstAvailableSize = data.quantityBySize?.find((s) => s.quantity > 0);
					if (firstAvailableSize) {
						setSelectedSize(firstAvailableSize.sizeId);
					}
				} catch (err) {
					setError(err.message || 'Không thể tải thông tin sản phẩm.');
				} finally {
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

	const availableStock = useMemo(() => {
		if (!product || !selectedSize) return 0;
		const sizeInfo = product.quantityBySize.find((s) => s.sizeId === selectedSize);
		return sizeInfo ? sizeInfo.quantity : 0;
	}, [product, selectedSize]);

	const handleAddToCart = async () => {
		if (!selectedSize) {
			toast.warn('Vui lòng chọn kích thước!');
			return;
		}

		const payload = {
			productId: product._id,
			sizeId: selectedSize,
			quantity: quantity,
		};

		try {
			await addItemToCart(payload);
			toast.success('Đã thêm sản phẩm vào giỏ hàng!');
			setQuantity(1);
		} catch (err) {
			console.error('Lỗi khi thêm vào giỏ hàng:', err);
			const errorMessage = err.response?.data?.message || 'Lỗi không xác định, vui lòng thử lại.';
			toast.error(errorMessage);
		}
	};

	// Thanh toán ngay
	const handleBuyNow = () => {
		const selectedSizeObject = product.quantityBySize?.find((s) => s.sizeId === selectedSize);
		const selectedColorObject = product.colors?.[0];
		const token = localStorage.getItem('token');
		if (!token) {
			toast.warning('Vui lòng đăng nhập để thanh toán!');
			router.push(ROUTES.Login);
			return;
		}

		if (!selectedSize) {
			toast.warn('Vui lòng chọn kích thước!');
			return;
		}

		const buyNowItem = {
			productId: product._id,
			sizeId: selectedSizeObject.sizeId,
			quantity: quantity,
			colorId: selectedColorObject?.colorId,

			name: product.name,
			image: product.images?.[0],
			price: product.price,
			sizeName: selectedSizeObject.name,
			colorName: selectedColorObject?.name,
		};

		try {
			sessionStorage.setItem('checkoutItems', JSON.stringify([buyNowItem]));
			router.push(ROUTES.Order);
		} catch (error) {
			console.error('Lỗi khi lưu vào sessionStorage:', error);
			toast.error('Đã có lỗi xảy ra, vui lòng thử lại.');
		}
	};

	// Add Review
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
			const errorMap = {
				REVIEW_MISSING_FIELDS: 'Vui lòng điền đầy đủ thông tin đánh giá.',
				REVIEW_PROFANE_COMMENT: 'Nội dung đánh giá chứa từ ngữ không phù hợp.',
				PRODUCT_NOT_FOUND: 'Sản phẩm không tồn tại.',
				REVIEW_NOT_ELIGIBLE: 'Bạn cần mua thành công sản phẩm này để được đánh giá.',
				REVIEW_SERVER_ERROR: 'Lỗi hệ thống, vui lòng thử lại sau.',
			};

			const errorCode = err.response?.data?.errorCode;
			const message = errorMap[errorCode] || err.message || 'Không thể gửi đánh giá.';
			toast.error(message);
		}
	};

	const handleSizeChange = (sizeId) => {
		setSelectedSize(sizeId);
		setQuantity(1);
	};

	const handleQuantityChange = (type) => {
		if (type === 'increase') {
			if (quantity < availableStock) {
				setQuantity((prev) => prev + 1);
			}
		} else {
			setQuantity((prev) => Math.max(1, prev - 1));
		}
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

					<div className={styles.productMeta}>
						<p className={styles.metaItem}>
							<strong style={{fontSize: '16px'}}>Trạng thái:</strong>{' '}
							<span className={`${styles.status} ${styles[product.status]}`}>
								{product.status === 'active'
									? 'Hoạt động'
									: product.status === 'inactive'
									? 'Sản phẩm đang cập nhật'
									: 'Ngừng bán'}
							</span>
						</p>

						<p className={styles.metaItem}>
							<strong style={{fontSize: '16px'}}>Nổi bật:</strong> {product.isFeatured ? '✅ Sản phẩm nổi bật' : '❌'}
						</p>
					</div>

					<div className={styles.colorSelect}>
						<span>Màu: </span>
						{product.colors?.length > 0 &&
							product.colors.map((color, index) => (
								<span key={color._id} className={styles.colorItem}>
									<span
										className={styles.colorDot}
										style={{backgroundColor: color.colorCode || '#000', marginRight: 4}}
									></span>
									<span>{color.name}</span>
									{index !== product.colors.length - 1 && <span style={{margin: '0 6px'}}>|</span>}
								</span>
							))}
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
									key={sizeObj.sizeId}
									className={`${styles.sizeButton} ${selectedSize === sizeObj.sizeId ? styles.active : ''}`}
									onClick={() => handleSizeChange(sizeObj.sizeId)}
									disabled={sizeObj.quantity <= 0}
								>
									{sizeObj.name}
									{sizeObj.quantity > 0 ? ` (Còn: ${sizeObj.quantity})` : ' (Hết hàng)'}
								</button>
							))}
						</div>
					)}
					<div className={styles.quantitySelect}>
						<p>Số lượng:</p>
						<button onClick={() => handleQuantityChange('decrease')} disabled={quantity <= 1}>
							-
						</button>
						<span>{quantity}</span>
						<button onClick={() => handleQuantityChange('increase')} disabled={quantity >= availableStock}>
							+
						</button>

						{selectedSize && <span className={styles.stockInfo}>(Còn lại: {availableStock} sản phẩm)</span>}
					</div>

					<div className={styles.buttonGroup}>
						<Button
							className={styles.addToCart}
							onClick={handleAddToCart}
							disabled={!selectedSize || availableStock <= 0 || product.status !== 'active'}
						>
							{availableStock <= 0 ? 'Hết hàng' : 'Thêm giỏ hàng'}
						</Button>
						<Button
							className={styles.buyNow}
							onClick={handleBuyNow}
							disabled={product.status !== 'active' || !product.quantityBySize || product.quantityBySize.length === 0}
						>
							Thanh toán ngay
						</Button>
					</div>

					<p className={styles.metaItem}>
						<strong>Đã bán:</strong> {product.totalSold} sản phẩm
					</p>

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
							<div className={styles.reviewHeader}>
								<Image
									src={review.userId?.avatar || '/default-avatar.png'}
									alt={review.userId?.name}
									className={styles.reviewAvatar}
									width={40}
									height={40}
								/>
								<div>
									<p className={styles.reviewName}>
										<strong>{review.userId?.name}</strong>
									</p>
									<p className={styles.reviewRating}>⭐ {review.rating} / 5</p>
								</div>
							</div>
							<p className={styles.reviewComment}>{review.comment}</p>
							{currentUserId === review.userId?._id && (
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
