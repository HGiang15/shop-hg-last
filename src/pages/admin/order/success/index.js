import Head from 'next/head';
import {Fragment} from 'react';
import LayoutAdmin from '@/components/layouts/LayoutAdmin/LayoutAdmin';
import MainOrderPendingConfirm from '@/components/pages/admin/order/MainOrderPendingConfirm/MainOrderPendingConfirm';
import MainOrderCancel from '@/components/pages/admin/order/MainOrderCancel/MainOrderCancel';

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
				<MainOrderCancel />
			</Fragment>
		</Fragment>
	);
}

Page.getLayout = function (page) {
	return <LayoutAdmin title='Đơn hàng giao thành công'>{page}</LayoutAdmin>;
};
