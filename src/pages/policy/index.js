import LayoutUser from '@/components/layouts/LayoutUser/LayoutUser';
import Policy from '@/components/pages/user/policy/Policy';
import Head from 'next/head';
import {Fragment} from 'react';

export default function Page() {
	return (
		<Fragment>
			<Head>
				<title>Chính sách bảo mật</title>
				<meta name='description' content='Chính sách bảo mật' />
				<meta name='viewport' content='width=device-width, initial-scale=1' />
				<link rel='icon' href='/favicon.ico' />
			</Head>
			<Fragment>
				<Policy />
			</Fragment>
		</Fragment>
	);
}

Page.getLayout = function getLayout(page) {
	return <LayoutUser>{page}</LayoutUser>;
};
