// import Head from 'next/head';
// import {Fragment} from 'react';
// import LayoutAdmin from '@/components/layouts/LayoutAdmin/LayoutAdmin';
// import MainDashboard from '@/components/pages/admin/dashboard/MainDashboard';

// export default function Page() {
// 	return (
// 		<Fragment>
// 			<Head>
// 				<title>Dashboard</title>
// 				<meta name='description' content='Dashboard' />
// 				<meta name='viewport' content='width=device-width, initial-scale=1' />
// 				<link rel='icon' href='/favicon.ico' />
// 			</Head>
// 			<Fragment>
// 				<MainDashboard />
// 			</Fragment>
// 		</Fragment>
// 	);
// }

// Page.getLayout = function (page) {
// 	return <LayoutAdmin title='Báo cáo thống kê'>{page}</LayoutAdmin>;
// };

import Head from 'next/head';
import {Fragment} from 'react';
import LayoutAdmin from '@/components/layouts/LayoutAdmin/LayoutAdmin';
import MainDashboard from '@/components/pages/admin/dashboard/MainDashboard';

export default function Page({user}) {
	return (
		<Fragment>
			<Head>
				<title>Dashboard</title>
				<meta name='description' content='Dashboard' />
				<meta name='viewport' content='width=device-width, initial-scale=1' />
				<link rel='icon' href='/favicon.ico' />
			</Head>
			<Fragment>
				<MainDashboard />
			</Fragment>
		</Fragment>
	);
}

Page.getLayout = function (page) {
	return <LayoutAdmin title='Báo cáo thống kê'>{page}</LayoutAdmin>;
};
