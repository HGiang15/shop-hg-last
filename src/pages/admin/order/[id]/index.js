import Head from 'next/head';
import {Fragment} from 'react';
import LayoutAdmin from '@/components/layouts/LayoutAdmin/LayoutAdmin';
import MainOrderDetail from '@/components/pages/admin/order/MainOrderDetail/MainOrderDetail';

export default function Page() {
	return (
		<Fragment>
			<Head>
				<title>Chi tiết đơn hàng</title>
				<meta name='description' content='Chi tiết đơn hàng' />
				<meta name='viewport' content='width=device-width, initial-scale=1' />
				<link rel='icon' href='/favicon.ico' />
			</Head>
			<Fragment>
				<MainOrderDetail />
			</Fragment>
		</Fragment>
	);
}

Page.getLayout = function (page) {
	return <LayoutAdmin title='Chi tiết đơn hàng'>{page}</LayoutAdmin>;
};
