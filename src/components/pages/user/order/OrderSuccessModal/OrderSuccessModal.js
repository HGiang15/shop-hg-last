import React from 'react';
import styles from './OrderSuccessModal.module.scss';
import {ROUTES} from '@/constants/config';
import {useRouter} from 'next/router';
import Button from '@/components/common/Button/Button';
import Image from 'next/image';
import icons from '@/constants/static/icons';

const OrderSuccessModal = ({onClose}) => {
	const router = useRouter();

	const handleGoToHistory = () => {
		onClose();
		router.push(ROUTES.HistoryOrder);
	};

	return (
		<div className={styles.overlay}>
			<div className={styles.modal}>
				<Image src={icons.iconTick} alt='Icons' className={styles.icons} width={60} height={60} />
				<h2>Đặt hàng thành công!</h2>
				<p>Cảm ơn bạn đã mua hàng. Bạn có thể xem chi tiết trong lịch sử đơn hàng.</p>
				<div className={styles.actions}>
					<Button onClick={handleGoToHistory}>Xem lịch sử đơn hàng</Button>
				</div>
			</div>
		</div>
	);
};

export default OrderSuccessModal;
