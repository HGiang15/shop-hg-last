import React from 'react';
import Image from 'next/image';
import Slider from 'react-slick';
import {ArrowLeft2, ArrowRight2} from 'iconsax-react';

import styles from './BannerHome.module.scss';
import banner1 from '../../../../../../public/static/images/banner_1.jpg';
import banner2 from '../../../../../../public/static/images/banner_2.jpg';
import banner3 from '../../../../../../public/static/images/banner_3.jpg';
import banner4 from '../../../../../../public/static/images/banner_about.jpg';
import banner5 from '../../../../../../public/static/images/banner_full.jpg';
import arrowRight from '../../../../../../public/static/images/arrow-right.svg';
import arrowLeft from '../../../../../../public/static/images/arrow-left.svg';

function SampleNextArrow(props) {
	const {onClick} = props;
	return (
		<div className={`${styles.arrow} ${styles.next}`} onClick={onClick}>
			<Image src={arrowRight} alt='Next' width={32} height={32} />
		</div>
	);
}

function SamplePrevArrow(props) {
	const {onClick} = props;
	return (
		<div className={`${styles.arrow} ${styles.prev}`} onClick={onClick}>
			<Image src={arrowLeft} alt='Previous' width={32} height={32} />
		</div>
	);
}

function BannerHome() {
	const banners = [banner1, banner2, banner3, banner4, banner5];

	const settings = {
		dots: true,
		infinite: true,
		speed: 500,
		slidesToShow: 1,
		slidesToScroll: 1,
		autoplay: true,
		autoplaySpeed: 3000,
		nextArrow: <SampleNextArrow />,
		prevArrow: <SamplePrevArrow />,
	};

	return (
		<div className={styles.container}>
			<Slider {...settings}>
				{banners.map((banner, index) => (
					<div key={index} className={styles.item}>
						<Image src={banner} alt={`Banner ${index + 1}`} layout="fill" objectFit="cover" className={styles.image} />
					</div>
				))}
			</Slider>

			{/* Section */}
			<section className={styles.section}>
				<div className={styles.sectionItem}>
					<h4>MIỄN PHÍ giao hàng</h4>
					<p>FREESHIP đơn hàng từ 500K</p>
				</div>

				<div className={styles.line}></div>

				<div className={styles.sectionItem}>
					<h4>Thanh toán COD</h4>
					<p>Thanh toán khi nhận hàng</p>
				</div>

				<div className={styles.line}></div>

				<div className={styles.sectionItem}>
					<h4>Đặt hàng nhanh chóng</h4>
					<p>Linh hoạt, bảo mật</p>
				</div>
			</section>
		</div>
	);
}

export default BannerHome;
