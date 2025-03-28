import React from 'react';
import styles from './About.module.scss';
import images from '@/constants/static/images';
import Image from 'next/image';

const clothingItems = [
	{name: 'Áo CLB', price: '750.000 VND', image: images.product1},
	{name: 'Áo đội tuyển', price: '1.200.000 VND', image: images.product2},
	{name: 'Áo không logo', price: '1.500.000 VND', image: images.product3},
];

const About = () => {
	return (
		<div className={styles.aboutContainer}>
			<h1 className={styles.title}>Về Chúng Tôi</h1>
			<p className={styles.description}>
				Chào mừng bạn đến với thương hiệu thời trang cao cấp! Chúng tôi cam kết mang đến những sản phẩm chất lượng, sang trọng, giúp
				bạn tự tin tỏa sáng mỗi ngày.
			</p>

			<div className={styles.brandHighlights}>
				<div className={styles.highlight}>🔥 Thiết Kế Thời Thượng</div>
				<div className={styles.highlight}>💎 Chất Liệu Cao Cấp</div>
				<div className={styles.highlight}>🚀 Đẳng Cấp & Phong Cách</div>
			</div>

			<div className={styles.clothingGallery}>
				{clothingItems.map((item, index) => (
					<div key={index} className={styles.clothingCard}>
						<Image src={item.image} alt={item.name} className={styles.clothingImage} />
						<div className={styles.clothingInfo}>
							<p className={styles.clothingName}>{item.name}</p>
							<p className={styles.clothingPrice}>{item.price}</p>
						</div>
					</div>
				))}
			</div>
		</div>
	);
};

export default About;
