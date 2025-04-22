import {API_URL} from '@/constants/config';
import axios from 'axios';

export const loginUser = async (email, password) => {
	try {
		const response = await axios.post(`${API_URL}user/login`, {email, password});
		return response.data;
	} catch (error) {
		throw error.response?.data || {message: 'Đăng nhập thất bại'};
	}
};
