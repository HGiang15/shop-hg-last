import React from 'react';
import Image from 'next/image';
import product1 from '../../../../../../public/static/images/background.jpg';
import styles from './AboutHome.module.scss';

const AboutHome = () => {
	return (
		<section className={styles.aboutContainer}>
			<div className={styles.aboutContent}>
				<div className={styles.aboutText} data-aos="fade-right">
					<h2>✨ Giới thiệu về <span>HG Shop</span></h2>
					<p>
                        HG Shop là cửa hàng thời trang chuyên cung cấp quần áo phong cách, hiện đại và 
						chất lượng cao. Với sứ mệnh mang đến cho khách hàng những sản phẩm không chỉ đẹp 
						mà còn thoải mái và phù hợp với xu hướng mới nhất, HG Shop luôn cập nhật những mẫu mã
						đa dạng, từ cá tính, năng động đến thanh lịch, tinh tế.
					</p>
					<p>
                    Chúng tôi cam kết mang đến trải nghiệm mua sắm tuyệt vời với dịch vụ tận tâm và 
					sản phẩm chất lượng. Hãy đến với HG Shop để khám phá những bộ trang phục giúp bạn 
					tự tin thể hiện phong cách riêng!
					</p>
					<a href="/about" className={styles.learnMore}>Về chúng tôi</a>
				</div>
				<div className={styles.aboutImage} data-aos="fade-left">
					<Image src={product1} alt='Về chúng tôi' width={500} height={350} className={styles.image} />
				</div>
			</div>
		</section>
	);
};

export default AboutHome;
