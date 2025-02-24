import React from 'react';
import styles from './Footer.module.scss';
import Image from 'next/image';
import logo from '../../../../../../public/static/icons/logo.png';

function Footer() {
	return (
		<footer className={styles.footer}>
			<div className={styles.container}>
				{/* Column left */}
				<div className={styles.left}>
					<Image className={styles.logo_home} src={logo} alt='Logo' />
					<p>
						Chào mừng bạn đến với <strong>HG Shop</strong>, nơi hội tụ những xu hướng thời trang mới nhất! Chúng tôi cung cấp đa
						dạng các sản phẩm quần áo phong cách, chất lượng cao, phù hợp cho mọi lứa tuổi và dịp đặc biệt.
					</p>
					<p>© 2025 2151160496 K63 HTTT1</p>
				</div>

				{/* Column right */}
				<div className={styles.right}>
					<div className={styles.column}>
						<h3>Sản phẩm</h3>
						<a href='#'>Quần áo nam</a>
						<a href='#'>Quần áo nữ</a>
						<a href='#'>Giày thể thao</a>
					</div>

					<div className={styles.column}>
						<h3>Về chúng tôi</h3>
						<a href='#'>Giới thiệu</a>
						<a href='#'>Chính sách bảo mật</a>
						<a href='#'>Điều khoản sử dụng</a>
					</div>

					<div className={styles.column}>
						<h3>Hỗ trợ khách hàng</h3>
						<a href='#'>Hướng dẫn mua hàng</a>
						<a href='#'>Phương thức thanh toán</a>
						<a href='#'>Chính sách đổi trả</a>
					</div>

					<div className={styles.column}>
						<h3>Liên hệ</h3>
						<a href='#'>Email: gianghoang150503@gmail.com</a>
						<a href='#'>Hotline: 1900 9999</a>
						<a href='#'>Fanpage Facebook</a>
					</div>
				</div>
			</div>
		</footer>
	);
}

export default Footer;
