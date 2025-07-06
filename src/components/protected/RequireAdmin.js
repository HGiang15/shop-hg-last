import {useEffect} from 'react';
import {useRouter} from 'next/router';
import {ROUTES} from '@/constants/config';
import {useAuth} from '@/redux/context/AuthContext';

export default function RequireAdmin({children}) {
	const router = useRouter();
	const {infoUser, isAdmin, loading} = useAuth();

	useEffect(() => {
		if (!loading) {
			if (!infoUser || infoUser.role === undefined) {
				router.push(ROUTES.Login);
			} else if (!isAdmin) {
				router.push(ROUTES.Home);
			}
		}
	}, [loading, infoUser, isAdmin]);

	return <>{children}</>;
}
