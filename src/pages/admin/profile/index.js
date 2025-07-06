import Head from 'next/head';
import {Fragment} from 'react';
import LayoutAdmin from '@/components/layouts/LayoutAdmin/LayoutAdmin';
import MainPageProfileAdmin from '@/components/pages/admin/profile/MainPageProfileAdmin';

export default function Page() {
	return (
		<Fragment>
			<Head>
				<title>Thông tin tài khoản</title>
				<meta name='description' content='Thông tin tài khoản' />
				<meta name='viewport' content='width=device-width, initial-scale=1' />
				<link rel='icon' href='/favicon.ico' />
			</Head>
			<Fragment>
				<MainPageProfileAdmin />
			</Fragment>
		</Fragment>
	);
}

Page.getLayout = function (page) {
	return <LayoutAdmin title='Thông tin tài khoản'>{page}</LayoutAdmin>;
};
