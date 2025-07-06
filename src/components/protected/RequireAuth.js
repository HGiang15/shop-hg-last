import {useEffect} from 'react';
import {useRouter} from 'next/router';
import {ROUTES} from '@/constants/config';
import {useAuth} from '@/redux/context/AuthContext';

export default function RequireAuth({children}) {
	const router = useRouter();
	const {isLogin, loading} = useAuth();

	useEffect(() => {
		if (!isLogin && !loading) {
			router.replace(ROUTES.Login);
		}
	}, [isLogin, loading]);

	if (isLogin && !loading) return <>{children}</>;

	return <div className='loading-page'></div>;
}
