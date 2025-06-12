import LayoutProfileUser from '@/components/layouts/LayoutProfileUser/LayoutProfileUser';
import LayoutUser from '@/components/layouts/LayoutUser/LayoutUser';
import Head from 'next/head';
import {Fragment} from 'react';
import {ROUTES} from '@/constants/config';
import TransactionHistory from '@/components/pages/user/profile/TransactionHistory/TransactionHistory';

export default function Page() {
	return (
		<Fragment>
			<Head>
				<title>Lịch sử giao dịch</title>
				<meta name='description' content='Lịch sử giao dịch' />
				<meta name='viewport' content='width=device-width, initial-scale=1' />
				<link rel='icon' href='/favicon.ico' />
			</Head>
			<LayoutProfileUser
				breadcrumbItems={{
					titles: ['Trang chủ', 'Thông tin cá nhân'],
					listHref: [ROUTES.Home, ROUTES.Profile],
				}}
			>
				<TransactionHistory />
			</LayoutProfileUser>
		</Fragment>
	);
}

Page.getLayout = function getLayout(page) {
	return <LayoutUser>{page}</LayoutUser>;
};
