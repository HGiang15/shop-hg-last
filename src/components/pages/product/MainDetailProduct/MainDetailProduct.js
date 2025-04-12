import React, {useState} from 'react';
import Image from 'next/image';
import images from '@/constants/static/images';
import icons from '@/constants/static/icons';
import styles from './MainDetailProduct.module.scss';
import Breadcrumb from '@/components/common/Breadcrumb/Breadcrumb';
import Button from '@/components/common/Button/Button';
import {ROUTES} from '@/constants/config';

const MainDetailProduct = ({breadcrumbItems = {titles: [], listHref: []}}) => {
	const initialReviews = [
		{id: 1, name: 'Nguyễn Văn A', rating: 5, comment: 'Sản phẩm rất đẹp, chất lượng tốt!'},
		{id: 2, name: 'Trần Thị B', rating: 4, comment: 'Áo hơi rộng so với size M, nhưng chất lượng ok!'},
		{id: 3, name: 'Lê Văn C', rating: 3, comment: 'Giao hàng hơi chậm, nhưng áo đẹp.'},
	];

	const [isModalOpen, setIsModalOpen] = useState(false);

	const [selectedSize, setSelectedSize] = useState('M');
	const [quantity, setQuantity] = useState(1);
	const [isLoading, setIsLoading] = useState(false);
	const [reviews, setReviews] = useState(initialReviews);
	const [newReview, setNewReview] = useState({name: '', rating: 5, comment: ''});

	console.log(images);

	const productImages = [images.product1, images.product2, images.product3, images.product4, images.product5];
	const [mainImage, setMainImage] = useState(productImages[0]);

	const handleSizeChange = (size) => setSelectedSize(size);

	const handleQuantityChange = (type) => {
		setQuantity((prev) => (type === 'increase' ? Math.min(prev + 1, 10) : Math.max(prev - 1, 1)));
	};

	const averageRating = reviews.length > 0 ? reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length : 0;

	const handleAddReview = (e) => {
		e.preventDefault();
		if (newReview.name && newReview.comment) {
			const newEntry = {id: Date.now(), ...newReview};
			setReviews([...reviews, newEntry]);
			setNewReview({name: '', rating: 5, comment: ''});
		}
	};

	return (
		<div className={styles.container}>
			{isLoading ? <p>Đang tải...</p> : <Breadcrumb titles={breadcrumbItems.titles} listHref={breadcrumbItems.listHref} />}

			<div className={styles.main}>
				<div className={styles.imageGallery}>
					<Image
						src={mainImage}
						alt='MU Home Kit'
						width={600}
						height={600}
						className={styles.mainImage}
						onClick={() => setIsModalOpen(true)}
					/>

					<div className={styles.thumbnailContainer}>
						{productImages.map((img, index) => (
							<Image
								key={index}
								src={img}
								alt={`Thumbnail ${index + 1}`}
								width={80}
								height={80}
								className={`${styles.thumbnail} ${mainImage === img ? styles.active : ''}`}
								onClick={() => setMainImage(img)}
							/>
						))}
					</div>

					{isModalOpen && (
						<div className={styles.modal} onClick={() => setIsModalOpen(false)}>
							<div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
								<Image src={mainImage} alt='Zoomed Image' width={650} height={650} className={styles.zoomedImage} />
							</div>
						</div>
					)}
				</div>

				{/* Thông tin sản phẩm */}
				<div className={styles.productInfo}>
					<h1 className={styles.productTitle}>MU Home 24-25 bản player full bộ</h1>
					<p className={styles.productId}>ID0201031505</p>

					<div className={styles.colorSelect}>
						<span>Màu: </span> <span className={styles.redDot}></span> Đỏ
					</div>

					<p className={styles.productPrice}>
						<span className={styles.labelPrice}>Giá: </span>300.000 VNĐ
					</p>

					<div className={styles.sizeSelect}>
						<p>Lựa chọn kích cỡ:</p>
						{['S', 'M', 'L', 'XL'].map((size) => (
							<button
								key={size}
								className={`${styles.sizeButton} ${selectedSize === size ? styles.active : ''}`}
								onClick={() => handleSizeChange(size)}
							>
								{size}
							</button>
						))}
					</div>

					<div className={styles.quantitySelect}>
						<p>Số lượng:</p>
						<button onClick={() => handleQuantityChange('decrease')}>-</button>
						<span>{quantity}</span>
						<button onClick={() => handleQuantityChange('increase')}>+</button>
					</div>

					<div className={styles.buttonGroup}>
						<Button className={styles.addToCart}>Thêm giỏ hàng</Button>
						<Button href={ROUTES.Order} className={styles.buyNow}>
							Thanh toán ngay
						</Button>
					</div>

					<div className={styles.additionalDescription}>
						<h3>Chính sách & Ưu đãi</h3>
						<ul>
							<li>
								<Image src={icons.rotate} alt='Đổi trả' width={22} height={22} className={styles.iconDesc} />
								Hỗ trợ đổi size hoặc trả hàng trong vòng 7 ngày nếu sản phẩm lỗi hoặc không vừa.
							</li>
							<li>
								<Image src={icons.medalStar} alt='Bảo hành' width={22} height={22} className={styles.iconDesc} />
								Cam kết bảo hành sản phẩm 6 tháng đối với lỗi do nhà sản xuất.
							</li>
							<li>
								<Image src={icons.change} alt='Quà tặng' width={22} height={22} className={styles.iconDesc} />
								Mua ngay hôm nay để nhận tặng kèm 1 đôi tất thể thao miễn phí!
							</li>
							<li>
								<Image src={icons.shipper} alt='Giao hàng' width={22} height={22} className={styles.iconDesc} />
								Nhận hàng trong vòng 2-3 ngày đối với khu vực nội thành.
							</li>
							<li>
								<Image src={icons.global} alt='Miễn phí vận chuyển' width={22} height={22} className={styles.iconDesc} />
								Đơn hàng từ 500.000 VNĐ trở lên được miễn phí ship toàn quốc.
							</li>
						</ul>
					</div>

					<div className={styles.productDescription}>
						<h3>Mô tả sản phẩm</h3>
						<ul>
							<li>
								Thiết kế hiện đại, phong cách thể thao: Áo đấu chính thức mùa giải 2024-2025 với kiểu dáng ôm sát body, phù
								hợp cho các hoạt động thể thao và dạo phố.
							</li>
							<li>
								Chất liệu cao cấp: 95% Polyester + 5% Spandex, thấm hút mồ hôi tốt, thoáng khí, co giãn nhẹ giúp bạn thoải
								mái khi vận động.
							</li>
							<li>
								Công nghệ in ấn tiên tiến: Logo CLB và nhà tài trợ được in ép nhiệt hoặc thêu tỉ mỉ, bền màu theo thời gian.
							</li>
							<li>Màu sắc ấn tượng: Màu đỏ chủ đạo kết hợp các họa tiết tinh tế tạo nên phong cách mạnh mẽ, cuốn hút.</li>
							<li>Nhiều size phù hợp: Đầy đủ size từ S đến XL, phù hợp với nhiều dáng người.</li>
							<li>Dễ dàng phối đồ: Kết hợp cùng quần short, quần jean hay jogger để tạo phong cách trẻ trung, năng động.</li>
						</ul>
					</div>
				</div>
			</div>

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
						value={newReview.name}
						onChange={(e) => setNewReview({...newReview, name: e.target.value})}
						required
					/>
					<select value={newReview.rating} onChange={(e) => setNewReview({...newReview, rating: Number(e.target.value)})}>
						<option value='5'>⭐ 5 - Rất tốt</option>
						<option value='4'>⭐ 4 - Tốt</option>
						<option value='3'>⭐ 3 - Bình thường</option>
						<option value='2'>⭐ 2 - Không tốt</option>
						<option value='1'>⭐ 1 - Tệ</option>
					</select>
					<textarea
						placeholder='Nhận xét của bạn'
						value={newReview.comment}
						onChange={(e) => setNewReview({...newReview, comment: e.target.value})}
						required
					/>
					<button type='submit'>Gửi đánh giá</button>
				</form>
			</div>
		</div>
	);
};

export default MainDetailProduct;
