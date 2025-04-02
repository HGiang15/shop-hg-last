import {useEffect} from 'react';
import {useRouter} from 'next/router';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';

const LoadingBar = () => {
	const router = useRouter();

	useEffect(() => {
		NProgress.configure({
			showSpinner: false,
			trickleSpeed: 200,
			easing: 'ease',
			speed: 800,
		});
		const handleStart = () => NProgress.start();
		const handleComplete = () => NProgress.done();

		router.events.on('routeChangeStart', handleStart);
		router.events.on('routeChangeComplete', handleComplete);
		router.events.on('routeChangeError', handleComplete);

		return () => {
			router.events.off('routeChangeStart', handleStart);
			router.events.off('routeChangeComplete', handleComplete);
			router.events.off('routeChangeError', handleComplete);
		};
	}, [router]);

	return null;
};

export default LoadingBar;
