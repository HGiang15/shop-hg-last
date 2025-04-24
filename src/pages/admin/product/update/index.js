import Head from 'next/head';
import {Fragment} from 'react';
import LayoutAdmin from '@/components/layouts/LayoutAdmin/LayoutAdmin';
import FormUpdateProduct from '@/components/pages/admin/product/FormUpdateProduct/FormUpdateProduct'; // Đảm bảo đường dẫn này đúng

function Page({}) {
	return (
		<Fragment>
			<Head>
				<title>Chỉnh sửa sản phẩm</title>
				<meta name='description' content='Chỉnh sửa sản phẩm' />
				<meta name='viewport' content='width=device-width, initial-scale=1' />
				<link rel='icon' href='/favicon.ico' />
			</Head>
			<Fragment>
				<FormUpdateProduct />
			</Fragment>
		</Fragment>
	);
}

Page.getLayout = function (page) {
	return <LayoutAdmin title='Chỉnh sửa sản phẩm'>{page}</LayoutAdmin>;
};

export default Page;
