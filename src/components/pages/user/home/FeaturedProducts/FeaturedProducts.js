import React from 'react';
import Image from 'next/image';
import styles from './FeaturedProducts.module.scss';
import product1 from '../../../../../../public/static/images/products/ao_clb/mu_01.webp';
import product2 from '../../../../../../public/static/images/products/ao_doituyen/eng_01.webp';
import product3 from '../../../../../../public/static/images/products/ao_clb/chel_01.webp';
import product4 from '../../../../../../public/static/images/products/ao_clb/mc_01.jpg';

const products = [
	{
		id: 'SP_0001',
		name: 'MU home 24-25 bản player full bộ',
		price: '399.999 VNĐ',
		image: product1,
	},
	{
		id: 'SP_0002',
		name: 'Tuyển Anh home Euro 2024 bản player full bộ',
		price: '499.999 VNĐ',
		image: product2,
	},
	{
		id: 'SP_0003',
		name: 'Chelsea home 24-25 bản player full bộ',
		price: '599.999 VNĐ',
		image: product3,
	},
	{
		id: 'SP_0004',
		name: 'Mancity home 24-25 bản player full bộ',
		price: '449.999 VNĐ',
		image: product4,
	},
];

const FeaturedProducts = () => {
	return (
		<div className={styles.container}>
			<h2 className={styles.featuredTitle}>Sản phẩm nổi bật</h2>

			<div className={styles.productGrid}>
				{products.map((product) => (
					<div key={product.id} className={styles.productCard}>
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
					</div>
				))}
			</div>
		</div>
	);
};

export default FeaturedProducts;
