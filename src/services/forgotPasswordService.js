import axios from 'axios';

const API_URL = 'http://localhost:3003/user';

export const forgotPassword = async (email) => {
	try {
		const response = await axios.post(`${API_URL}/forgotPassword`, {email});
		return response.data;
	} catch (error) {
		throw error.response?.data?.message || 'Gửi yêu cầu quên mật khẩu thất bại';
	}
};
