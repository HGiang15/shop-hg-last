import React, {useState, useEffect} from 'react';
import Image from 'next/image';
import styles from './FeaturedProducts.module.scss';
import Link from 'next/link';
import {ROUTES} from '@/constants/config';
import {getFeaturedProducts} from '@/services/productService';

const FeaturedProducts = () => {
	const [featuredProducts, setFeaturedProducts] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		const fetchFeaturedProducts = async () => {
			try {
				const data = await getFeaturedProducts();
				setFeaturedProducts(data);
				setLoading(false);
			} catch (err) {
				setError(err.message || 'Đã có lỗi xảy ra khi tải sản phẩm nổi bật.');
				setLoading(false);
			}
		};

		fetchFeaturedProducts();
	}, []);

	if (loading) {
		return <div>Đang tải sản phẩm nổi bật...</div>;
	}

	if (error) {
		return <div>Lỗi khi tải sản phẩm nổi bật: {error}</div>;
	}

	return (
		<div className={styles.container}>
			<h2 className={styles.featuredTitle}>Sản phẩm nổi bật</h2>

			<div className={styles.productGrid}>
				{featuredProducts.map((product) => (
					<Link href={`${ROUTES.Product}/${product._id}`} key={product._id} className={styles.productCard}>
						<div className={styles.imageWrapper}>
							{product.images && product.images[0] ? (
								<Image
									src={product.images[0]}
									alt={product.name}
									width={300}
									height={400}
									className={styles.productImage}
									onError={() => console.error('Lỗi tải ảnh')}
								/>
							) : (
								<div className={styles.placeholderImage}>Không có ảnh</div>
							)}
						</div>
						<div className={styles.productInfo}>
							<p className={styles.productId}>
								<strong>Mã sản phẩm:</strong> {product.code}
							</p>
							<p className={styles.productName}>{product.name}</p>
							<p className={styles.productPrice}>
								{product.price.toLocaleString('vi-VN', {style: 'currency', currency: 'VND'})}
							</p>
						</div>
					</Link>
				))}
			</div>
		</div>
	);
};

export default FeaturedProducts;
