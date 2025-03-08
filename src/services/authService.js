import axios from 'axios';

export const loginUser = async (email, password) => {
	try {
		const response = await axios.post('http://localhost:3003/user/login', {email, password});
		return response.data;
	} catch (error) {
		throw error.response?.data || {message: 'Đăng nhập thất bại'};
	}
};
