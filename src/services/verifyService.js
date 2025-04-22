import {API_URL} from '@/constants/config';
import axios from 'axios';

export const verifyOTP = async (userId, otp) => {
	try {
		const response = await axios.post(`${API_URL}user/verifyOTP`, {userId, otp});
		return response.data;
	} catch (error) {
		throw error.response?.data?.message || 'Xác thực OTP thất bại';
	}
};
