import Head from 'next/head';
import {Fragment} from 'react';
import LayoutAdmin from '@/components/layouts/LayoutAdmin/LayoutAdmin';
import FormCreateProduct from '@/components/pages/admin/product/FormCreateProduct/FormCreateProduct';

export default function Page() {
	return (
		<Fragment>
			<Head>
				<title>Thêm mới sản phẩm</title>
				<meta name='description' content='Thêm mới sản phẩm' />
				<meta name='viewport' content='width=device-width, initial-scale=1' />
				<link rel='icon' href='/favicon.ico' />
			</Head>
			<Fragment>
				<FormCreateProduct />
			</Fragment>
		</Fragment>
	);
}

Page.getLayout = function (page) {
	return <LayoutAdmin title='Thêm mới sản phẩm'>{page}</LayoutAdmin>;
};
