import Head from 'next/head';
import {Fragment} from 'react';
import LayoutAdmin from '@/components/layouts/LayoutAdmin/LayoutAdmin';
import MainPageUser from '@/components/pages/admin/user/MainPageUser/MainPageUser';

export default function Page() {
	return (
		<Fragment>
			<Head>
				<title>Quản lý người dùng</title>
				<meta name='description' content='Quản lý người dùng' />
				<meta name='viewport' content='width=device-width, initial-scale=1' />
				<link rel='icon' href='/favicon.ico' />
			</Head>
			<Fragment>
				<MainPageUser />
			</Fragment>
		</Fragment>
	);
}

Page.getLayout = function (page) {
	return <LayoutAdmin title='Quản lý người dùng'>{page}</LayoutAdmin>;
};
