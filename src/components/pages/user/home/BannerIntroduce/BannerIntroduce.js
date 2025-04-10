import React from 'react';
import styles from './BannerIntroduce.module.scss';
import Button from '@/components/common/Button/Button';
import Link from 'next/link';
import {ROUTES} from '@/constants/config';

const BannerIntroduce = () => {
	return (
		<div className={styles.banner}>
			<div className={styles.overlay}>
				<div className={styles.content}>
					<h1>Chào mừng đến với HG Shop</h1>
					<p>Khám phá những bộ sưu tập thời trang mới nhất với phong cách hiện đại, sang trọng và đẳng cấp.</p>
					<div className={styles.buttons}>
						<Button type='submit' className={styles.primaryBtn}>
							<Link href={ROUTES.Product}>Khám phá ngay</Link>
						</Button>
						<Button type='submit' className={styles.secondaryBtn}>
							<Link href={ROUTES.Product}>Xem thêm</Link>
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default BannerIntroduce;
