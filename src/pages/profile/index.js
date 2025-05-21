import LayoutProfileUser from '@/components/layouts/LayoutProfileUser/LayoutProfileUser';
import LayoutUser from '@/components/layouts/LayoutUser/LayoutUser';
import MainPageProfile from '@/components/pages/user/profile/MainPageProfile/MainPageProfile';
import Head from 'next/head';
import {Fragment} from 'react';
import {ROUTES} from '@/constants/config';
import {withUserRole} from '@/utils/withAuth';

export default function Page() {
	return (
		<Fragment>
			<Head>
				<title>Thông tin cá nhân</title>
				<meta name='description' content='Thông tin cá nhân' />
				<meta name='viewport' content='width=device-width, initial-scale=1' />
				<link rel='icon' href='/favicon.ico' />
			</Head>
			<LayoutProfileUser
				breadcrumbItems={{
					titles: ['Trang chủ', 'Thông tin cá nhân'],
					listHref: [ROUTES.Home, ROUTES.Profile],
				}}
			>
				<MainPageProfile />
			</LayoutProfileUser>
		</Fragment>
	);
}

Page.getLayout = function getLayout(page) {
	return <LayoutUser>{page}</LayoutUser>;
};

// export const getServerSideProps = withUserRole([1]);
