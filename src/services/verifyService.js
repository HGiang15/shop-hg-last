import axios from 'axios';

const API_URL = 'http://localhost:3003/api/user';

export const verifyOTP = async (userId, otp) => {
	try {
		const response = await axios.post(`${API_URL}/verifyOTP`, {userId, otp});
		return response.data;
	} catch (error) {
		throw error.response?.data?.message || 'Xác thực OTP thất bại';
	}
};
