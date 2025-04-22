import axios from 'axios';

export const forgotPassword = async (email) => {
	try {
		const response = await axios.post(`${API_URL}user/forgotPassword`, {email});
		return response.data;
	} catch (error) {
		throw error.response?.data?.message || 'Gửi yêu cầu quên mật khẩu thất bại';
	}
};
