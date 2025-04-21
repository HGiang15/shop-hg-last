import axios from 'axios';

const API_URL = 'http://localhost:3003/api/user';

export const loginUser = async (email, password) => {
	try {
		const response = await axios.post(`${API_URL}/login`, {email, password});
		return response.data;
	} catch (error) {
		throw error.response?.data || {message: 'Đăng nhập thất bại'};
	}
};
