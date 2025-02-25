import React from 'react';
import Image from 'next/image';
import styles from './HeroSection.module.scss';
import heroImage from '../../../../../../public/static/images/background.jpg';

const HeroSection = () => {
	return (
		<section className={styles.hero}>
			<div className={styles.heroContent}>
				<h1>Thời trang đẳng cấp, phong cách độc đáo</h1>
				<p>Khám phá bộ sưu tập mới nhất, nơi phong cách và cá tính hòa quyện.</p>
				<a href="/shop" className={styles.ctaButton}>Mua ngay</a>
			</div>
			<div className={styles.heroImage}>
				<Image src={heroImage} alt="Hero Banner" width={600} height={400} className={styles.image} />
			</div>
		</section>
	);
};

export default HeroSection;
