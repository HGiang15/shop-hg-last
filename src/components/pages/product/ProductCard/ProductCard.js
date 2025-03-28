import React from 'react';
import Image from 'next/image';
import {useRouter} from 'next/router';
import styles from './ProductCard.module.scss';
import images from '@/constants/static/images';

const products = [
	{
		code: 'VCAFM33',
		name: 'Arsenal home 24-25 bản player full bộ',
		price: '499,000',
		image: images.product1,
	},
	{
		code: 'QN123',
		name: 'Bayern home 24-25 bản player full bộ',
		price: '799,000',
		image: images.product2,
	},
	{
		code: 'AT456',
		name: 'Chelsea home 24-25 bản player full bộ',
		price: '299,000',
		image: images.product3,
	},
	{
		code: 'AK789',
		name: 'Liverpool home 24-25 bản player full bộ',
		price: '999,000',
		image: images.product4,
	},
	{
		code: 'AK789',
		name: 'Mancity home 24-25 bản player full bộ',
		price: '999,000',
		image: images.product5,
	},
	{
		code: 'AK789',
		name: 'MU home 24-25 bản player full bộ',
		price: '999,000',
		image: images.product6,
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
					<Image src={product.image} alt={product.name} className={styles.image} />
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
