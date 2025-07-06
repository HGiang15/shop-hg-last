import Head from 'next/head';
import {Fragment} from 'react';
import LayoutAdmin from '@/components/layouts/LayoutAdmin/LayoutAdmin';
import MainPageReview from '@/components/pages/admin/review/MainPageReview/MainPageReview';

export default function Page() {
	return (
		<Fragment>
			<Head>
				<title>Quản lý đánh giá</title>
				<meta name='description' content='Quản lý đánh giá' />
				<meta name='viewport' content='width=device-width, initial-scale=1' />
				<link rel='icon' href='/favicon.ico' />
			</Head>
			<Fragment>
				<MainPageReview />
			</Fragment>
		</Fragment>
	);
}

Page.getLayout = function (page) {
	return <LayoutAdmin title='Quản lý đánh giá'>{page}</LayoutAdmin>;
};
