import MainPageProduct from '@/components/pages/product/MainPageProduct/MainPageProduct';
import Head from 'next/head';
import LayoutUser from '@/components/layouts/LayoutUser/LayoutUser';
import {Fragment} from 'react';
import {ROUTES} from '@/constants/config';

export default function Page() {
	return (
		<Fragment>
			<Head>
				<title>Danh sách sản phẩm</title>
				<meta name='description' content='Danh sách sản phẩm' />
				<meta name='viewport' content='width=device-width, initial-scale=1' />
				<link rel='icon' href='/favicon.ico' />
			</Head>

			<MainPageProduct
				breadcrumbItems={{
					titles: ['Trang chủ', 'Sản phẩm'],
					listHref: [ROUTES.Home, ROUTES.Product],
				}}
			/>
		</Fragment>
	);
}

Page.getLayout = function (page) {
	return <LayoutUser>{page}</LayoutUser>;
};
