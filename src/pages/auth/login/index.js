import Head from 'next/head';
import {Fragment} from 'react';
import MainLogin from '@/components/pages/auth/MainLogin';
import RequiredLogout from '@/components/protected/RequiredLogout';

export default function LoginPage() {
	return (
		<Fragment>
			<Head>
				<title>Đăng nhập</title>
				<meta name='description' content='Đăng nhập' />
				<meta name='viewport' content='width=device-width, initial-scale=1' />
				<link rel='icon' href='/favicon.ico' />
			</Head>
			<RequiredLogout>
				<MainLogin />
			</RequiredLogout>
		</Fragment>
	);
}
