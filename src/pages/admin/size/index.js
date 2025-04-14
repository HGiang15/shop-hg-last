import Head from 'next/head';
import {Fragment} from 'react';
import LayoutAdmin from '@/components/layouts/LayoutAdmin/LayoutAdmin';
import MainPageSize from '@/components/pages/admin/size/MainPageSize/MainPageSize';

export default function Page() {
	return (
		<Fragment>
			<Head>
				<title>Quản lý kích cỡ</title>
				<meta name='description' content='Quản lý kích cỡ' />
				<meta name='viewport' content='width=device-width, initial-scale=1' />
				<link rel='icon' href='/favicon.ico' />
			</Head>
			<Fragment>
				<MainPageSize />
			</Fragment>
		</Fragment>
	);
}

Page.getLayout = function (page) {
	return <LayoutAdmin title='Quản lý kích cỡ'>{page}</LayoutAdmin>;
};
