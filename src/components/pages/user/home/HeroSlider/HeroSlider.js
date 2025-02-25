import React from 'react';
import Slider from 'react-slick';
import Image from 'next/image';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import styles from './HeroSlider.module.scss';

import banner1 from '../../../../../../public/static/images/banner/banner_1.jpg'
import banner2 from '../../../../../../public/static/images/banner/banner_2.jpg';
import banner3 from '../../../../../../public/static/images/banner/banner_3.jpg';
import banner4 from '../../../../../../public/static/images/banner/banner_about.jpg';

import arrowLeft from '../../../../../../public/static/icons/arrow-left.svg';
import arrowRight from '../../../../../../public/static/icons/arrow-right.svg';

const CustomPrevArrow = ({ onClick }) => (
	<div className={`${styles.arrow} ${styles.prev}`} onClick={onClick}>
		<Image src={arrowLeft} alt="Previous" width={40} height={40} />
	</div>
);

const CustomNextArrow = ({ onClick }) => (
	<div className={`${styles.arrow} ${styles.next}`} onClick={onClick}>
		<Image src={arrowRight} alt="Next" width={40} height={40} />
	</div>
);

const HeroSlider = () => {
	const banners = [banner1, banner2, banner3, banner4];

	// Cấu hình Slick Slider
	const settings = {
		dots: true,
		infinite: true,
		speed: 500,
		slidesToShow: 1,
		slidesToScroll: 1,
		autoplay: true,
		autoplaySpeed: 3000,
		arrows: true,
		prevArrow: <CustomPrevArrow />,
		nextArrow: <CustomNextArrow />,
	};

	return (
		<section className={styles.sliderContainer}>
			<Slider {...settings} className={styles.slickSlider}>
				{banners.map((banner, index) => (
					<div key={index} className={styles.slide}>
						<Image src={banner} alt={`Banner ${index + 1}`} layout="fill" objectFit="cover" />
					</div>
				))}
			</Slider>
		</section>
	);
};

export default HeroSlider;
