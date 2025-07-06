import Head from 'next/head';
import {Fragment} from 'react';
import LayoutAdmin from '@/components/layouts/LayoutAdmin/LayoutAdmin';
import MainPageCategory from '@/components/pages/admin/category/MainPageCategory/MainPageCategory';

export default function Page() {
	return (
		<Fragment>
			<Head>
				<title>Quản lý danh mục</title>
				<meta name='description' content='Quản lý danh mục' />
				<meta name='viewport' content='width=device-width, initial-scale=1' />
				<link rel='icon' href='/favicon.ico' />
			</Head>
			<Fragment>
				<MainPageCategory />
			</Fragment>
		</Fragment>
	);
}

Page.getLayout = function (page) {
	return <LayoutAdmin title='Quản lý danh mục'>{page}</LayoutAdmin>;
};
