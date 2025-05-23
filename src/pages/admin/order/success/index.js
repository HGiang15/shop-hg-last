import Head from 'next/head';
import {Fragment} from 'react';
import LayoutAdmin from '@/components/layouts/LayoutAdmin/LayoutAdmin';
import MainOrderSuccess from '@/components/pages/admin/order/MainOrderSuccess/MainOrderSuccess';

export default function Page() {
	return (
		<Fragment>
			<Head>
				<title>Đơn hàng giao thành công</title>
				<meta name='description' content='Đơn hàng giao thành công' />
				<meta name='viewport' content='width=device-width, initial-scale=1' />
				<link rel='icon' href='/favicon.ico' />
			</Head>
			<Fragment>
				<MainOrderSuccess />
			</Fragment>
		</Fragment>
	);
}

Page.getLayout = function (page) {
	return <LayoutAdmin title='Đơn hàng giao thành công'>{page}</LayoutAdmin>;
};
