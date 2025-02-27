import MainForgotPassword from '@/components/pages/auth/MainForgotPassword/MainForgotPassword';
import Head from 'next/head';
import {Fragment} from 'react';

export default function Page() {
	return (
		<Fragment>
			<Head>
				<title>Quên mật khẩu</title>
				<meta name='description' content='Quên mật khẩu' />
				<meta name='viewport' content='width=device-width, initial-scale=1' />
				<link rel='icon' href='/favicon.ico' />
			</Head>
			<Fragment>
				<MainForgotPassword />
			</Fragment>
		</Fragment>
	);
}
