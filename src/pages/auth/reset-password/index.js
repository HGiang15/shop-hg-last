import Head from 'next/head';
import {Fragment} from 'react';
import MainResetPassword from '@/components/pages/auth/MainResetPassword/MainResetPassword';

export default function LoginPage() {
	return (
		<Fragment>
			<Head>
				<title>Đặt lại mật khẩu</title>
				<meta name='description' content='Đặt lại mật khẩu' />
				<meta name='viewport' content='width=device-width, initial-scale=1' />
				<link rel='icon' href='/favicon.ico' />
			</Head>
			<MainResetPassword />
		</Fragment>
	);
}
