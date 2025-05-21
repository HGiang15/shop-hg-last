import {API_URL} from '@/constants/config';
import axios from 'axios';

// Lấy địa chỉ của người dùng
export const getUserAddresses = async () => {
	try {
		const token = localStorage.getItem('token');
		const response = await axios.get(`${API_URL}user-addresses/getUserAddresses`, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});
		return response.data;
	} catch (error) {
		throw error.response?.data || {message: 'Lấy danh sách địa chỉ thất bại'};
	}
};

// Tạo địa chỉ mới
export const createAddress = async (addressData) => {
	try {
		const token = localStorage.getItem('token');
		const response = await axios.post(`${API_URL}user-addresses/createAddress`, addressData, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});
		return response.data;
	} catch (error) {
		throw error.response?.data || {message: 'Tạo địa chỉ thất bại'};
	}
};

// Cập nhật địa chỉ
export const updateAddress = async (addressId, addressData) => {
	try {
		const response = await axios.put(`${API_URL}user-addresses/updateAddress/${addressId}`, addressData);
		return response.data;
	} catch (error) {
		throw error.response?.data || {message: 'Cập nhật địa chỉ thất bại'};
	}
};

// Đặt địa chỉ mặc định
export const setDefaultAddress = async (addressId) => {
	try {
		const token = localStorage.getItem('token');
		const response = await axios.put(`${API_URL}user-addresses/setDefaultAddress/${addressId}`, null, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});
		return response.data;
	} catch (error) {
		throw error.response?.data || {message: 'Đặt địa chỉ mặc định thất bại'};
	}
};

// Xóa địa chỉ
export const deleteAddress = async (addressId) => {
	try {
		const token = localStorage.getItem('token');
		const response = await axios.delete(`${API_URL}user-addresses/deleteAddress/${addressId}`, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});
		return response.data;
	} catch (error) {
		throw error.response?.data || {message: 'Xóa địa chỉ thất bại'};
	}
};
