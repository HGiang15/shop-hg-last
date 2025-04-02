import LayoutProfileUser from '@/components/layouts/LayoutProfileUser/LayoutProfileUser';
import LayoutUser from '@/components/layouts/LayoutUser/LayoutUser';
import Head from 'next/head';
import {Fragment} from 'react';
import {ROUTES} from '@/constants/config';
import MainPageAddress from '@/components/pages/user/profile/MainPageAddress/MainPageAddress';

export default function Page() {
	return (
		<Fragment>
			<Head>
				<title>Sổ địa chỉ</title>
				<meta name='description' content='Sổ địa chỉ' />
				<meta name='viewport' content='width=device-width, initial-scale=1' />
				<link rel='icon' href='/favicon.ico' />
			</Head>
			<LayoutProfileUser
				breadcrumbItems={{
					titles: ['Trang chủ', 'Thông tin cá nhân'],
					listHref: [ROUTES.Home, ROUTES.Profile],
				}}
			>
				<MainPageAddress />
			</LayoutProfileUser>
		</Fragment>
	);
}

Page.getLayout = function getLayout(page) {
	return <LayoutUser>{page}</LayoutUser>;
};
