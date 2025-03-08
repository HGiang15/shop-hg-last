import Head from 'next/head';
import {Fragment} from 'react';
import MainLogin from '@/components/pages/auth/MainLogin';
import {parseCookies} from 'nookies';
import {ROUTES} from '@/constants/config';

export default function LoginPage() {
	return (
		<Fragment>
			<Head>
				<title>Đăng nhập</title>
				<meta name='description' content='Đăng nhập' />
				<meta name='viewport' content='width=device-width, initial-scale=1' />
				<link rel='icon' href='/favicon.ico' />
			</Head>
			<MainLogin />
		</Fragment>
	);
}

// Sử dụng getServerSideProps để kiểm tra token trước khi render trang
// export async function getServerSideProps(context) {
// 	const cookies = parseCookies(context);

// 	// Nếu đã có token, chuyển hướng về trang Home
// 	if (cookies.token) {
// 		return {
// 			redirect: {
// 				destination: ROUTES.Home,
// 				permanent: false,
// 			},
// 		};
// 	}

// 	return {
// 		props: {},
// 	};
// }
