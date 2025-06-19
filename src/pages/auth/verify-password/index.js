import MainVerify from '@/components/pages/auth/MainVerify/MainVerify';
import RequiredLogout from '@/components/protected/RequiredLogout';
import Head from 'next/head';
import {Fragment} from 'react';

export default function Page() {
	return (
		<Fragment>
			<Head>
				<title>Mã xác nhận</title>
				<meta name='description' content='Mã xác nhận' />
				<meta name='viewport' content='width=device-width, initial-scale=1' />
				<link rel='icon' href='/favicon.ico' />
			</Head>
			<RequiredLogout>
				<MainVerify />
			</RequiredLogout>
		</Fragment>
	);
}
