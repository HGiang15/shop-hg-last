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

		// Nếu có truyền roles, kiểm tra, nếu không bỏ qua
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

// Cách dùng
// Trang admin, chỉ admin mới được vào:
// export const getServerSideProps = withUserRole([0]);
// Trang user, chỉ user (hoặc admin) mới được vào:
// export const getServerSideProps = withUserRole([1, 0]);
// Trang chỉ cần đăng nhập, không phân biệt role:
// export const getServerSideProps = withUserRole([]);
// export const getServerSideProps = withUserRole();
