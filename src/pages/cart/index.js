import LayoutUser from '@/components/layouts/LayoutUser/LayoutUser';
import MainPageCart from '@/components/pages/user/cart/MainPageCart/MainPageCart';
import {ROUTES} from '@/constants/config';
import Head from 'next/head';
import {Fragment} from 'react';

export default function Page() {
	return (
		<Fragment>
			<Head>
				<title>Giỏ hàng của bạn</title>
				<meta name='description' content='Giỏ hàng của bạn' />
				<meta name='viewport' content='width=device-width, initial-scale=1' />
				<link rel='icon' href='/favicon.ico' />
			</Head>
			<Fragment>
				<MainPageCart
					breadcrumbItems={{
						titles: ['Trang chủ', 'Sản phẩm', 'Giỏ hàng của bạn'],
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
