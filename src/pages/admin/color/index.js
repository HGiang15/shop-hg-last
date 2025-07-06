import Head from 'next/head';
import {Fragment} from 'react';
import LayoutAdmin from '@/components/layouts/LayoutAdmin/LayoutAdmin';
import MainPageColor from '@/components/pages/admin/color/MainPageColor/MainPageColor';

export default function Page({user}) {
	return (
		<Fragment>
			<Head>
				<title>Quản lý màu sắc</title>
				<meta name='description' content='Quản lý màu sắc' />
				<meta name='viewport' content='width=device-width, initial-scale=1' />
				<link rel='icon' href='/favicon.ico' />
			</Head>
			<Fragment>
				<MainPageColor />
			</Fragment>
		</Fragment>
	);
}

Page.getLayout = function (page) {
	return <LayoutAdmin title='Quản lý màu sắc'>{page}</LayoutAdmin>;
};
