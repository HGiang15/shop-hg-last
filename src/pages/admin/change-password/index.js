import Head from 'next/head';
import {Fragment} from 'react';
import LayoutAdmin from '@/components/layouts/LayoutAdmin/LayoutAdmin';
import MainPageChangePasswordAdmin from '@/components/pages/admin/change-password/MainPageChangePasswordAdmin';

export default function Page() {
	return (
		<Fragment>
			<Head>
				<title>Thay đổi mật khẩu</title>
				<meta name='description' content='Thay đổi mật khẩu' />
				<meta name='viewport' content='width=device-width, initial-scale=1' />
				<link rel='icon' href='/favicon.ico' />
			</Head>
			<Fragment>
				<MainPageChangePasswordAdmin />
			</Fragment>
		</Fragment>
	);
}

Page.getLayout = function (page) {
	return <LayoutAdmin title='Thay đổi mật khẩu'>{page}</LayoutAdmin>;
};
