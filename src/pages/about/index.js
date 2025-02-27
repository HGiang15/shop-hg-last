import LayoutUser from '@/components/layouts/LayoutUser/LayoutUser';
import About from '@/components/pages/user/about/About';
import Head from 'next/head';
import {Fragment} from 'react';

export default function Page() {
	return (
		<Fragment>
			<Head>
				<title>Về chúng tôi</title>
				<meta name='description' content='Về chúng tôi' />
				<meta name='viewport' content='width=device-width, initial-scale=1' />
				<link rel='icon' href='/favicon.ico' />
			</Head>
			<Fragment>
				<About />
			</Fragment>
		</Fragment>
	);
}

Page.getLayout = function getLayout(page) {
	return <LayoutUser>{page}</LayoutUser>
  };
