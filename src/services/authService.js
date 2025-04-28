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

export const getListUser = async () => {
	try {
		const response = await axios.get(`${API_URL}user/getListUser`);
		return response.data.data;
	} catch (error) {
		throw error.response?.data || {message: 'Lỗi lấy danh sách người dùng'};
	}
};

export const updateUserStatus = async (id, status) => {
	try {
		const response = await axios.put(`${API_URL}user/status/${id}`, {status});
		return response.data;
	} catch (error) {
		throw error.response?.data || {message: 'Cập nhật trạng thái người dùng thất bại'};
	}
};

export const updateUserRole = async (id, role) => {
	try {
		const response = await axios.put(`${API_URL}user/role/${id}`, {role});
		return response.data;
	} catch (error) {
		throw error.response?.data || {message: 'Cập nhật vai trò người dùng thất bại'};
	}
};
