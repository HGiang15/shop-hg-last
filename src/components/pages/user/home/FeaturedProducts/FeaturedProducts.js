import React from 'react';
import Image from 'next/image';
import styles from './FeaturedProducts.module.scss';
import images from '@/constants/static/images';
import Link from 'next/link';
import {ROUTES} from '@/constants/config';

const products = [
	{
		id: 'SP_0001',
		name: 'MU home 24-25 bản player full bộ',
		price: '399.999 VNĐ',
		image: images.product1,
	},
	{
		id: 'SP_0002',
		name: 'Tuyển Anh home Euro 2024 bản player full bộ',
		price: '499.999 VNĐ',
		image: images.product8,
	},
	{
		id: 'SP_0003',
		name: 'Chelsea home 24-25 bản player full bộ',
		price: '599.999 VNĐ',
		image: images.product4,
	},
	{
		id: 'SP_0004',
		name: 'Mancity home 24-25 bản player full bộ',
		price: '449.999 VNĐ',
		image: images.product6,
	},
];

const FeaturedProducts = () => {
	return (
		<div className={styles.container}>
			<h2 className={styles.featuredTitle}>Sản phẩm nổi bật</h2>

			<div className={styles.productGrid}>
				{products.map((product) => (
					<Link href={ROUTES.Product} key={product.id} className={styles.productCard}>
						<div className={styles.imageWrapper}>
							<Image src={product.image} alt={product.name} width={300} height={400} className={styles.productImage} />
						</div>
						<div className={styles.productInfo}>
							<p className={styles.productId}>
								<strong>Mã sản phẩm:</strong> {product.id}
							</p>
							<p className={styles.productName}>{product.name}</p>
							<p className={styles.productPrice}>{product.price}</p>
						</div>
					</Link>
				))}
			</div>
		</div>
	);
};

export default FeaturedProducts;
