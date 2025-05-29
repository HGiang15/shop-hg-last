import {jwtDecode} from 'jwt-decode';

export const getCurrentUserIdFromToken = () => {
	const token = localStorage.getItem('token');
	if (!token) return null;

	try {
		const decoded = jwtDecode(token);
		return decoded._id || decoded.id; // tuỳ theo BE bạn dùng _id hay id
	} catch (error) {
		console.error('Lỗi giải mã token:', error);
		return null;
	}
};
