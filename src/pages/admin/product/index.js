import Head from 'next/head';
import {Fragment} from 'react';
import LayoutAdmin from '@/components/layouts/LayoutAdmin/LayoutAdmin';
import MainPageProduct from '@/components/pages/admin/product/MainPageProduct/MainPageProduct';

export default function Page() {
	return (
		<Fragment>
			<Head>
				<title>Quản lý sản phẩm</title>
				<meta name='description' content='Quản lý sản phẩm' />
				<meta name='viewport' content='width=device-width, initial-scale=1' />
				<link rel='icon' href='/favicon.ico' />
			</Head>
			<Fragment>
				<MainPageProduct />
			</Fragment>
		</Fragment>
	);
}

Page.getLayout = function (page) {
	return <LayoutAdmin title='Quản lý sản phẩm'>{page}</LayoutAdmin>;
};
