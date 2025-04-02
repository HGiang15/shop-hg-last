import Head from 'next/head';
import LayoutUser from '@/components/layouts/LayoutUser/LayoutUser';
import {Fragment} from 'react';
import MainDetailProduct from '@/components/pages/product/MainDetailProduct/MainDetailProduct';
import {ROUTES} from '@/constants/config';

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
				<MainDetailProduct
					breadcrumbItems={{
						titles: ['Trang chủ', 'Sản phẩm', 'Áo đấu CLB'],
						listHref: [ROUTES.Home, ROUTES.Product],
					}}
				/>
			</Fragment>
		</Fragment>
	);
}

Page.getLayout = function (page) {
	return <LayoutUser>{page}</LayoutUser>;
};
