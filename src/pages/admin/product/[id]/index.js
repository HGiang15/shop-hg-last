import Head from 'next/head';
import {Fragment} from 'react';
import LayoutAdmin from '@/components/layouts/LayoutAdmin/LayoutAdmin';
import MainDetailProduct from '@/components/pages/admin/product/MainDetailProduct/MainDetailProduct';

export default function Page() {
	return (
		<Fragment>
			<Head>
				<title>Chi tiết sản phẩm</title>
				<meta name='description' content='Chi tiết sản phẩm' />
				<meta name='viewport' content='width=device-width, initial-scale=1' />
				<link rel='icon' href='/favicon.ico' />
			</Head>
			<Fragment>
				<MainDetailProduct />
			</Fragment>
		</Fragment>
	);
}

Page.getLayout = function (page) {
	return <LayoutAdmin title='Chi tiết sản phẩm'>{page}</LayoutAdmin>;
};
