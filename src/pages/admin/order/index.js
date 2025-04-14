import Head from 'next/head';
import {Fragment} from 'react';
import LayoutAdmin from '@/components/layouts/LayoutAdmin/LayoutAdmin';
import MainOrderPendingConfirm from '@/components/pages/admin/order/MainOrderPendingConfirm/MainOrderPendingConfirm';

export default function Page() {
	return (
		<Fragment>
			<Head>
				<title>Đơn hàng chờ xác nhận</title>
				<meta name='description' content='Đơn hàng chờ xác nhận' />
				<meta name='viewport' content='width=device-width, initial-scale=1' />
				<link rel='icon' href='/favicon.ico' />
			</Head>
			<Fragment>
				<MainOrderPendingConfirm />
			</Fragment>
		</Fragment>
	);
}

Page.getLayout = function (page) {
	return <LayoutAdmin title='Đơn hàng chờ xác nhận'>{page}</LayoutAdmin>;
};
