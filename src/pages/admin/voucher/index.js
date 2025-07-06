import Head from 'next/head';
import {Fragment} from 'react';
import LayoutAdmin from '@/components/layouts/LayoutAdmin/LayoutAdmin';
import MainPageVoucher from '@/components/pages/admin/voucher/MainPageVoucher/MainPageVoucher';

export default function Page() {
	return (
		<Fragment>
			<Head>
				<title>Quản lý voucher</title>
				<meta name='description' content='Quản lý voucher' />
				<meta name='viewport' content='width=device-width, initial-scale=1' />
				<link rel='icon' href='/favicon.ico' />
			</Head>
			<Fragment>
				<MainPageVoucher />
			</Fragment>
		</Fragment>
	);
}

Page.getLayout = function (page) {
	return <LayoutAdmin title='Quản lý voucher'>{page}</LayoutAdmin>;
};
