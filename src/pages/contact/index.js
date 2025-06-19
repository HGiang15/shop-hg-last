import LayoutUser from '@/components/layouts/LayoutUser/LayoutUser';
import Contact from '@/components/pages/user/contact/Contact';
import Head from 'next/head';
import {Fragment} from 'react';

export default function Page() {
	return (
		<Fragment>
			<Head>
				<title>Liên hệ</title>
				<meta name='description' content='Liên hệ' />
				<meta name='viewport' content='width=device-width, initial-scale=1' />
				<link rel='icon' href='/favicon.ico' />
			</Head>
			<Fragment>
				<Contact />
			</Fragment>
		</Fragment>
	);
}

Page.getLayout = function getLayout(page) {
	return <LayoutUser>{page}</LayoutUser>;
};
