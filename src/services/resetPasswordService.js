import axios from 'axios';

const API_URL = 'http://localhost:3003/api/user';

export const resetPassword = async (email, otp, newPassword) => {
	try {
		const response = await axios.post(`${API_URL}/resetPassword`, {email, otp, newPassword});
		return response.data;
	} catch (error) {
		throw error.response?.data?.message || 'Đặt lại mật khẩu thất bại';
	}
};
