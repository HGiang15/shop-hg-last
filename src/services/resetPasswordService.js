import {API_URL} from '@/constants/config';
import axios from 'axios';

export const resetPassword = async (email, otp, newPassword) => {
	try {
		const response = await axios.post(`${API_URL}user/resetPassword`, {email, otp, newPassword});
		return response.data;
	} catch (error) {
		throw error.response?.data?.message || 'Đặt lại mật khẩu thất bại';
	}
};
