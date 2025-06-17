import {useEffect} from 'react';
import {useRouter} from 'next/router';
import {useAuth} from '@/redux/context/AuthContext';
import {ROUTES} from '@/constants/config';

export default function RequiredLogout({children}) {
	const router = useRouter();
	const {isLogin, infoUser, loading, isAdmin, isUser} = useAuth();

	useEffect(() => {
		if (isLogin && !loading) {
			if (isUser) {
				router.replace(ROUTES.Home);
			} else if (isAdmin) {
				router.replace(ROUTES.AdminDashboard);
			}
		}
	}, [isLogin, loading, infoUser, isAdmin, isUser]);

	if (!isLogin && !loading) return <>{children}</>;

	return <div className='loading-page'></div>;
}
