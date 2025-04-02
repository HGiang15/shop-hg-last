import LayoutProfileUser from '@/components/layouts/LayoutProfileUser/LayoutProfileUser';
import LayoutUser from '@/components/layouts/LayoutUser/LayoutUser';
import Head from 'next/head';
import {Fragment} from 'react';
import {ROUTES} from '@/constants/config';
import MainPageHistoryOrder from '@/components/pages/user/profile/MainPageHistoryOrder/MainPageHistoryOrder';

export default function Page() {
	return (
		<Fragment>
			<Head>
				<title>Thay đổi mật khẩu</title>
				<meta name='description' content='thay đổi mật khẩu' />
				<meta name='viewport' content='width=device-width, initial-scale=1' />
				<link rel='icon' href='/favicon.ico' />
			</Head>
			<LayoutProfileUser
				breadcrumbItems={{
					titles: ['Trang chủ', 'Thông tin cá nhân'],
					listHref: [ROUTES.Home, ROUTES.Profile],
				}}
			>
				<MainPageHistoryOrder />
			</LayoutProfileUser>
		</Fragment>
	);
}

Page.getLayout = function getLayout(page) {
	return <LayoutUser>{page}</LayoutUser>;
};
