import React from 'react';
import Link from 'next/link';
import styles from './Footer.module.scss';
import Image from 'next/image';
import {ROUTES} from '@/constants/config';
import images from '@/constants/static/images';

function Footer() {
	return (
		<footer className={styles.footer}>
			<div className={styles.container}>
				<div className={styles.left}>
					<Image className={styles.logo_home} src={images.logoFooter} alt='Logo' />
					<p>
						Chào mừng bạn đến với <strong>HG Shop</strong>, nơi hội tụ những xu hướng thời trang mới nhất! Chúng tôi cung cấp đa
						dạng các sản phẩm quần áo phong cách, chất lượng cao, phù hợp cho mọi lứa tuổi và dịp đặc biệt.
					</p>
					<p>© 2025 2151160496 K63 HTTT1</p>
				</div>

				<div className={styles.right}>
					<div className={styles.column}>
						<h3>Sản phẩm</h3>
						<Link href={ROUTES.Product}>Áo CLB</Link>
						<Link href={ROUTES.Product}>Áo đội tuyển</Link>
						<Link href={ROUTES.Product}>Áo không logo</Link>
						<Link href={ROUTES.Product}>Giày thể thao</Link>
					</div>

					<div className={styles.column}>
						<h3>Về chúng tôi</h3>
						<Link href={ROUTES.About}>Giới thiệu</Link>
						<Link href={ROUTES.Product}>Chính sách bảo mật</Link>
						<Link href={ROUTES.Product}>Điều khoản sử dụng</Link>
					</div>

					<div className={styles.column}>
						<h3>Hỗ trợ khách hàng</h3>
						<Link href={ROUTES.Product}>Hướng dẫn mua hàng</Link>
						<Link href={ROUTES.Product}>Phương thức thanh toán</Link>
						<Link href={ROUTES.Product}>Chính sách đổi trả</Link>
					</div>

					<div className={styles.column}>
						<h3>Liên hệ</h3>
						<Link href={ROUTES.Product}>Email: gianghoang150503@gmail.com</Link>
						<Link href={ROUTES.Product}>Hotline: 1900 9999</Link>
						<Link href='https://www.facebook.com/Kensiro03/?locale=vi_VN' target='blank'>
							Fanpage Facebook
						</Link>
					</div>
				</div>
			</div>
		</footer>
	);
}

export default Footer;
