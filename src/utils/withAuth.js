import {parseCookies} from 'nookies';
import jwt from 'jsonwebtoken';
import {ROUTES} from '@/constants/config';

const SECRET_KEY = process.env.JWT_SECRET;

export function withUserRole(allowedRoles = [], getServerSidePropsFn) {
	return async (ctx) => {
		const {token} = parseCookies(ctx);
		console.log('🪝 TOKEN:', token);

		if (!token) {
			return {
				redirect: {
					destination: ROUTES.Login,
					permanent: false,
				},
			};
		}

		let user;
		try {
			user = jwt.verify(token, SECRET_KEY);
			console.log('👤 USER DECODED:', user);
		} catch (err) {
			return {
				redirect: {
					destination: ROUTES.Login,
					permanent: false,
				},
			};
		}

		if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
			return {
				redirect: {
					destination: '/',
					permanent: false,
				},
			};
		}

		if (getServerSidePropsFn) {
			const result = await getServerSidePropsFn(ctx);

			return {
				...result,
				props: {
					...result.props,
					user,
				},
			};
		}

		return {
			props: {user},
		};
	};
}
