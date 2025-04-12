import LayoutUser from '@/components/layouts/LayoutUser/LayoutUser';
import MainPageOrder from '@/components/pages/user/order/MainPageOrder/MainPageOrder';
import {ROUTES} from '@/constants/config';
import Head from 'next/head';
import {Fragment} from 'react';

export default function Page() {
	return (
		<Fragment>
			<Head>
				<title>Đơn hàng của bạn</title>
				<meta name='description' content='Đơn hàng của bạn' />
				<meta name='viewport' content='width=device-width, initial-scale=1' />
				<link rel='icon' href='/favicon.ico' />
			</Head>
			<Fragment>
				<MainPageOrder
					breadcrumbItems={{
						titles: ['Trang chủ', 'Sản phẩm', 'Đơn hàng của bạn'],
						listHref: [ROUTES.Home, ROUTES.Product],
					}}
				/>
			</Fragment>
		</Fragment>
	);
}

Page.getLayout = function getLayout(page) {
	return <LayoutUser>{page}</LayoutUser>;
};
