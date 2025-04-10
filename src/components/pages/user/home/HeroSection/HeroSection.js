import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import styles from './HeroSection.module.scss';
import images from '@/constants/static/images';
import {ROUTES} from '@/constants/config';
import Button from '@/components/common/Button/Button';

const HeroSection = () => {
	return (
		<section className={styles.hero}>
			<div className={styles.heroContent}>
				<h1>Thời trang thể thao đẳng cấp, phong cách độc đáo</h1>
				<p>Khám phá bộ sưu tập mới nhất, nơi phong cách và cá tính hòa quyện.</p>
				<Link href={ROUTES.Product} className={styles.groupBtn}>
					<Button className={styles.ctaButton}>Mua ngay</Button>
				</Link>
			</div>
			<div className={styles.heroImage}>
				<Image src={images.hero_bg} alt='Hero Banner' width={600} height={400} className={styles.image} />
			</div>
		</section>
	);
};

export default HeroSection;
