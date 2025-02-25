import React from 'react';
import styles from './BannerIntroduce.module.scss';

const BannerIntroduce = () => {
	return (
		<div className={styles.banner}>
			<div className={styles.overlay}>
				<div className={styles.content}>
					<h1>Chào mừng đến với HG Shop</h1>
					<p>Khám phá những bộ sưu tập thời trang mới nhất với phong cách hiện đại, sang trọng và đẳng cấp.</p>
					<div className={styles.buttons}>
						<button className={styles.primaryBtn}>Khám phá ngay</button>
						<button className={styles.secondaryBtn}>Xem thêm</button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default BannerIntroduce;
