import LayoutUser from '@/components/layouts/LayoutUser/LayoutUser';
import VNPayReturnPage from '@/components/pages/user/payment/VNPayReturn/VNPayReturn';
import Head from 'next/head';
import {Fragment} from 'react';

export default function Page() {
	return (
		<Fragment>
			<Head>
				<title>VN PAY RETURN</title>
				<meta name='description' content='VN PAY RETURN' />
				<meta name='viewport' content='width=device-width, initial-scale=1' />
				<link rel='icon' href='/favicon.ico' />
			</Head>
			<Fragment>
				<VNPayReturnPage />
			</Fragment>
		</Fragment>
	);
}

Page.getLayout = function getLayout(page) {
	return <LayoutUser>{page}</LayoutUser>;
};
