import {API_URL} from '@/constants/config';
import axios from 'axios';

export const registerUser = async (userData) => {
	try {
		const response = await axios.post(`${API_URL}user/register`, userData);
		return response.data;
	} catch (error) {
		throw error.response?.data?.message || 'Đăng ký thất bại';
	}
};
