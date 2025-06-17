import Head from 'next/head';
import {Fragment} from 'react';
import MainRegister from '@/components/pages/auth/MainRegister';
import RequiredLogout from '@/components/protected/RequiredLogout';

export default function Page() {
	return (
		<Fragment>
			<Head>
				<title>Đăng ký</title>
				<meta name='description' content='Đăng ký' />
				<meta name='viewport' content='width=device-width, initial-scale=1' />
				<link rel='icon' href='/favicon.ico' />
			</Head>
			<RequiredLogout>
				<MainRegister />
			</RequiredLogout>
		</Fragment>
	);
}
