import Head from 'next/head';
import {Fragment} from 'react';
import LayoutAdmin from '@/components/layouts/LayoutAdmin/LayoutAdmin';
import MainPageContact from '@/components/pages/admin/contact/MainPageContact/MainPageContact';

export default function Page() {
	return (
		<Fragment>
			<Head>
				<title>Quản lý liên hệ</title>
				<meta name='description' content='Quản lý liên hệ' />
				<meta name='viewport' content='width=device-width, initial-scale=1' />
				<link rel='icon' href='/favicon.ico' />
			</Head>
			<Fragment>
				<MainPageContact />
			</Fragment>
		</Fragment>
	);
}

Page.getLayout = function (page) {
	return <LayoutAdmin title='Quản lý liên hệ'>{page}</LayoutAdmin>;
};
