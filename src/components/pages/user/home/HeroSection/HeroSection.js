import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import styles from './HeroSection.module.scss';
import heroImage from '../../../../../../public/static/images/10.jpg';

const HeroSection = () => {
	return (
		<section className={styles.hero}>
			<div className={styles.heroContent}>
				<h1>Thời trang thể thao đẳng cấp, phong cách độc đáo</h1>
				<p>Khám phá bộ sưu tập mới nhất, nơi phong cách và cá tính hòa quyện.</p>
				<Link href='/shop' className={styles.ctaButton}>
					Mua ngay
				</Link>
			</div>
			<div className={styles.heroImage}>
				<Image src={heroImage} alt='Hero Banner' width={600} height={400} className={styles.image} />
			</div>
		</section>
	);
};

export default HeroSection;
