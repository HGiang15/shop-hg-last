import React from 'react';
import styles from './Policy.module.scss';
import Link from 'next/link';

const Policy = () => {
	return (
		<div className={styles.container}>
			<h1 className={styles.title}>Chính sách Bảo mật Thông tin</h1>
			<p className={styles.lastUpdated}>Cập nhật lần cuối: 18/06/2025</p>

			<div className={styles.section}>
				<p>
					Chào mừng bạn đến với TCSPorts! Chúng tôi hiểu rằng sự riêng tư và bảo mật thông tin cá nhân là vô cùng quan trọng. Vì
					vậy, bằng chính sách này, chúng tôi cam kết bảo vệ thông tin cá nhân của bạn với trách nhiệm cao nhất.
				</p>
				<p>
					Vui lòng đọc kỹ Chính sách Bảo mật dưới đây để hiểu rõ hơn về những cam kết mà chúng tôi thực hiện nhằm tôn trọng và bảo
					vệ quyền lợi của người truy cập.
				</p>
			</div>

			<div className={styles.section}>
				<h2 className={styles.sectionTitle}>1. Mục đích và Phạm vi Thu thập Thông tin</h2>
				<p>TCSPorts thu thập thông tin của bạn chủ yếu để hỗ trợ, quản lý và nâng cao chất lượng dịch vụ, bao gồm:</p>
				<ul className={styles.list}>
					<li className={styles.listItem}>
						<strong>Thông tin cá nhân:</strong> Họ và tên, địa chỉ email, số điện thoại, địa chỉ giao hàng. Chúng tôi thu thập
						khi bạn đăng ký tài khoản hoặc đặt hàng.
					</li>
					<li className={styles.listItem}>
						<strong>Thông tin giao dịch:</strong> Chi tiết đơn hàng, sản phẩm đã mua, phương thức thanh toán, lịch sử giao dịch.
					</li>
				</ul>
			</div>

			<div className={styles.section}>
				<h2 className={styles.sectionTitle}>2. Phạm vi Sử dụng Thông tin</h2>
				<p>Thông tin của bạn được TCSPorts sử dụng cho các mục đích sau:</p>
				<ul className={styles.list}>
					<li className={styles.listItem}>Xử lý đơn hàng: Liên hệ xác nhận đơn hàng, thực hiện giao hàng và thanh toán.</li>
					<li className={styles.listItem}>
						Chăm sóc khách hàng: Gửi thông báo về đơn hàng, hỗ trợ khi bạn có thắc mắc hoặc yêu cầu qua trang page sau:
						<Link
							target='blank'
							className={styles.nav__link}
							href='https://www.facebook.com/profile.php?id=61567661477939&locale=vi_VN'
						>
							Nhấn vào đây
						</Link>
					</li>
					<li className={styles.listItem}>Cá nhân hóa trải nghiệm: Gợi ý các sản phẩm thể thao phù hợp với sở thích của bạn.</li>
					<li className={styles.listItem}>
						Marketing và quảng bá (khi có sự đồng ý của bạn): Hiển thị các voucher khuyến mãi thì thanh toán đơn hàng, thông tin
						về sản phẩm mới qua email. Bạn có thể hủy đăng ký nhận tin bất cứ lúc nào.
					</li>
					<li className={styles.listItem}>An ninh: Ngăn chặn các hoạt động giả mạo, phá hoại tài khoản của khách hàng.</li>
				</ul>
			</div>

			<div className={styles.section}>
				<h2 className={styles.sectionTitle}>3. Chia sẻ Thông tin Khách hàng</h2>
				<p>
					TCSPorts cam kết không bán, cho thuê hoặc chia sẻ thông tin cá nhân của bạn cho bất kỳ bên thứ ba nào vì mục đích thương
					mại. Chúng tôi chỉ chia sẻ thông tin trong các trường hợp thật sự cần thiết sau:
				</p>
				<ul className={styles.list}>
					<li className={styles.listItem}>
						<strong>Đối tác vận chuyển:</strong> Cung cấp tên, địa chỉ, số điện thoại của bạn cho các đơn vị vận chuyển (ví dụ:
						Giao Hàng Nhanh, Viettel Post...) để giao sản phẩm.
					</li>
					<li className={styles.listItem}>
						<strong>Cổng thanh toán:</strong> Đối với thanh toán trực tuyến (ví dụ: VNPay), thông tin thẻ của bạn sẽ được xử lý
						bởi đối tác cổng thanh toán theo tiêu chuẩn bảo mật quốc tế. TCSPorts không lưu trữ bất kỳ thông tin nhạy cảm nào về
						thẻ của bạn.
					</li>
					<li className={styles.listItem}>
						<strong>Yêu cầu pháp lý:</strong> Khi có yêu cầu từ các cơ quan nhà nước có thẩm quyền.
					</li>
				</ul>
			</div>

			<div className={styles.section}>
				<h2 className={styles.sectionTitle}>4. Quyền của Khách hàng</h2>
				<p>Bạn có toàn quyền đối với thông tin cá nhân của mình:</p>
				<ul className={styles.list}>
					<li className={styles.listItem}>
						Truy cập và chỉnh sửa thông tin cá nhân của mình bất cứ lúc nào trong mục &quot;Tài khoản của tôi&quot;.
					</li>
					<li className={styles.listItem}>Yêu cầu chúng tôi xóa dữ liệu cá nhân của bạn khỏi hệ thống.</li>
					<li className={styles.listItem}>Từ chối nhận các thông tin marketing, quảng cáo.</li>
				</ul>
			</div>

			<div className={styles.section}>
				<h2 className={styles.sectionTitle}>5. Thông tin Liên hệ</h2>
				<p>Nếu bạn có bất kỳ câu hỏi hoặc góp ý nào về chính sách bảo mật của chúng tôi, vui lòng liên hệ qua:</p>
				<div className={styles.contactInfo}>
					<p>
						<strong>Website Bán Quần Áo Thể Thao TCSPorts</strong>
					</p>
					<Link
						target='blank'
						className={styles.nav__link}
						href='https://www.facebook.com/profile.php?id=61567661477939&locale=vi_VN'
					>
						Trang page cửa hàng
					</Link>
					<p>
						<strong>Email:</strong> gianghoang150503@gmail.com
					</p>
					<p>
						<strong>Hotline:</strong> 0398162589
					</p>
					<p>
						<strong>Địa chỉ:</strong> 167 Tây Sơn, Trung Liệt, Đống Đa, Hà Nội.
					</p>
				</div>
			</div>
		</div>
	);
};

export default Policy;
