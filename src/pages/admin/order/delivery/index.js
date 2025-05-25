import Head from 'next/head';
import {Fragment} from 'react';
import LayoutAdmin from '@/components/layouts/LayoutAdmin/LayoutAdmin';
import MainOrderPendingConfirm from '@/components/pages/admin/order/MainOrderPendingConfirm/MainOrderPendingConfirm';
import MainOrderCancel from '@/components/pages/admin/order/MainOrderCancel/MainOrderCancel';
import MainOrderShipping from '@/components/pages/admin/order/MainOrderShipping/MainOrderShipping';

export default function Page() {
	return (
		<Fragment>
			<Head>
				<title>Đơn hàng đang giao</title>
				<meta name='description' content='Đơn hàng đang giao' />
				<meta name='viewport' content='width=device-width, initial-scale=1' />
				<link rel='icon' href='/favicon.ico' />
			</Head>
			<Fragment>
				<MainOrderShipping />
			</Fragment>
		</Fragment>
	);
}

Page.getLayout = function (page) {
	return <LayoutAdmin title='Đơn hàng đang giao'>{page}</LayoutAdmin>;
};
