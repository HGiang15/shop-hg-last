import React, {useState, useEffect} from 'react';
import Image from 'next/image';
import {useRouter} from 'next/router';
import styles from './MainDetailProduct.module.scss';
import Breadcrumb from '@/components/common/Breadcrumb/Breadcrumb';
import Button from '@/components/common/Button/Button';
import {ROUTES} from '@/constants/config';
import {getProductById} from '@/services/productService';
import images from '@/constants/static/images';
import {getCategoryById} from '@/services/categoryService';
import {addToCart, getAllCart} from '@/services/cartService';
import {toast} from 'react-toastify';

const ProductDetailPage = () => {
	const router = useRouter();
	const {id} = router.query;
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

	// State cho đánh giá
	const [reviews, setReviews] = useState([]);
	const [newReview, setNewReview] = useState({name: '', rating: 5, comment: ''});

	const adminBaseUrl = 'http://localhost:3003';

	useEffect(() => {
		if (id) {
			const fetchProductDetails = async () => {
				setLoading(true);
				setError(null);
				try {
					const data = await getProductById(id);
					setProduct(data);
					setMainImage(data?.images?.[0] ? `${adminBaseUrl}/uploads/${data.images[0]}` : images.placeholder);

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

	const handleSizeChange = (sizeId) => {
		setSelectedSize(sizeId);
	};

	const handleQuantityChange = (type) => {
		setQuantity((prev) => (type === 'increase' ? Math.min(prev + 1, 10) : Math.max(prev - 1, 1)));
	};

	const averageRating = reviews.length > 0 ? reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length : 0;

	const handleAddToCart = async () => {
		if (!selectedSize) {
			toast.warn('Vui lòng chọn kích thước!');
			return;
		}

		// const selectedImage = product.images?.[0] || '';
		const selectedImage = product.images?.[0] ? `${adminBaseUrl}/uploads/${product.images[0]}` : images.placeholder;

		const defaultColor = product.colors?.[0] || 'Không xác định';

		const payload = {
			productId: product._id,
			color: defaultColor, // Lấy màu đầu tiên
			image: selectedImage,
			sizeId: selectedSize,
			quantity: quantity,
		};

		try {
			console.log(payload);

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

	const handleAddReview = (e) => {
		e.preventDefault();
		// Gọi API để thêm đánh giá
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
						src={mainImage || images.placeholder}
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
									src={`${adminBaseUrl}/uploads/${img}`}
									alt={`Thumbnail ${index + 1}`}
									width={80}
									height={80}
									className={`${styles.thumbnail} ${mainImage === `${adminBaseUrl}/uploads/${img}` ? styles.active : ''}`}
									onClick={() => setMainImage(`${adminBaseUrl}/uploads/${img}`)}
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
								<Image
									src={mainImage || images.placeholder}
									alt='Zoomed Image'
									width={650}
									height={650}
									className={styles.zoomedImage}
								/>
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
						<Button href={ROUTES.Order} className={styles.buyNow}>
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
						</div>
					))}
				</div>

				<form className={styles.reviewForm} onSubmit={handleAddReview}>
					<input
						type='text'
						placeholder='Tên của bạn'
						// value={newReview.name}
						// onChange={(e) => setNewReview({ ...newReview, name: e.target.value })}
						required
					/>
					<select
					// value={newReview.rating}
					// onChange={(e) => setNewReview({ ...newReview, rating: Number(e.target.value) })}
					>
						<option value='5'>⭐ 5 - Rất tốt</option>
						<option value='4'>⭐ 4 - Tốt</option>
						<option value='3'>⭐ 3 - Bình thường</option>
						<option value='2'>⭐ 2 - Không tốt</option>
						<option value='1'>⭐ 1 - Tệ</option>
					</select>
					<textarea
						placeholder='Nhận xét của bạn'
						// value={newReview.comment}
						// onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
						required
					/>
					<button type='submit'>Gửi đánh giá</button>
				</form>
			</div>
		</div>
	);
};

export default ProductDetailPage;
