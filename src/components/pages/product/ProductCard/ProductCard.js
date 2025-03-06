import React from 'react';
import {useRouter} from 'next/router';
import styles from './ProductCard.module.scss';

const products = [
	{
		code: 'VCAFM33',
		name: 'Arsenal home 24-25 bản player full bộ',
		price: '499,000',
		image: '/static/images/products/ao_clb/arsenal_01.webp',
	},
	{
		code: 'QN123',
		name: 'Bayern home 24-25 bản player full bộ',
		price: '799,000',
		image: '/static/images/products/ao_clb/bayern_01.webp',
	},
	{
		code: 'AT456',
		name: 'Chelsea home 24-25 bản player full bộ',
		price: '299,000',
		image: '/static/images/products/ao_clb/chel_01.webp',
	},
	{
		code: 'AK789',
		name: 'Liverpool home 24-25 bản player full bộ',
		price: '999,000',
		image: '/static/images/products/ao_clb/liver_01.webp',
	},
	{
		code: 'AK789',
		name: 'Mancity home 24-25 bản player full bộ',
		price: '999,000',
		image: '/static/images/products/ao_clb/mc_01.jpg',
	},
	{
		code: 'AK789',
		name: 'MU home 24-25 bản player full bộ',
		price: '999,000',
		image: '/static/images/products/ao_clb/mu_01.webp',
	},
];

const ProductCard = () => {
	const router = useRouter();

	const handleClick = (productCode) => {
		router.push(`/products/${productCode}`);
	};

	return (
		<div className={styles.gridContainer}>
			{products.map((product) => (
				<div className={styles.card} key={product.code} onClick={() => handleClick(product.code)}>
					<img src={product.image} alt={product.name} className={styles.image} />
					<div className={styles.info}>
						<p className={styles.productCode}>Mã: {product.code}</p>
						<h3 className={styles.productName}>{product.name}</h3>
						<p className={styles.productPrice}>{product.price}₫</p>
					</div>
				</div>
			))}
		</div>
	);
};

export default ProductCard;
