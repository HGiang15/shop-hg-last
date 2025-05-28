import {useEffect, useState} from 'react';
import {useRouter} from 'next/router';
import styles from './VNPayReturn.module.scss';
import {ROUTES} from '@/constants/config';

const VNPayReturnPage = () => {
	const router = useRouter();
	const {vnp_ResponseCode} = router.query;
	const [status, setStatus] = useState(null);

	useEffect(() => {
		if (Object.keys(router.query).length > 0) {
			if (vnp_ResponseCode === '00') {
				setStatus('success');
			} else {
				setStatus('fail');
			}
		}
	}, [router.query]);

	const handleGoToOrders = () => {
		router.push(ROUTES.HistoryOrder);
	};

	return (
		<div className={styles.container}>
			<div className={styles.card}>
				<h1>Kết quả thanh toán</h1>
				{status === 'success' && <p className={styles.success}>Thanh toán thành công. Cảm ơn bạn!</p>}
				{status === 'fail' && (
					<p className={styles.fail}>
						Thanh toán thất bại. Tuy nhiên, đơn hàng của bạn đã được tạo và sẽ được thanh toán khi giao hàng.
					</p>
				)}

				<button className={styles.button} onClick={handleGoToOrders}>
					Xem đơn hàng
				</button>
			</div>
		</div>
	);
};

export default VNPayReturnPage;
