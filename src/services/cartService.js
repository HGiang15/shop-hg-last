import {API_URL} from '@/constants/config';
import axios from 'axios';

export const getAllCart = async () => {
	try {
		const response = await axios.get(`${API_URL}cart/getAllCart`, {
			withCredentials: true,
		});
		return response.data;
	} catch (error) {
		throw error.response?.data || {message: 'Lấy giỏ hàng thất bại'};
	}
};

export const removeItemFromCart = async (itemId) => {
	try {
		const response = await axios.delete(`${API_URL}cart/removeItem/${itemId}`, {
			withCredentials: true,
		});
		return response.data;
	} catch (error) {
		throw error.response?.data || {message: 'Xoá sản phẩm khỏi giỏ hàng thất bại'};
	}
};

export const addToCart = async (productData) => {
	try {
		const response = await axios.post(`${API_URL}cart/addToCart`, productData, {
			withCredentials: true,
		});
		return response.data;
	} catch (error) {
		throw error.response?.data || {message: 'Thêm vào giỏ hàng thất bại'};
	}
};

export const updateCartItem = async (itemId, quantity) => {
	try {
		const response = await axios.put(
			`${API_URL}cart/updateItem`,
			{itemId, quantity},
			{
				withCredentials: true,
			}
		);
		return response.data;
	} catch (error) {
		throw error.response?.data || {message: 'Cập nhật số lượng thất bại'};
	}
};

export const mergeCart = async (localItems) => {
	try {
		const token = localStorage.getItem('token'); // Lấy token người dùng từ localStorage

		if (!token) throw new Error('Không có thông tin người dùng'); // Nếu không có token, báo lỗi

		const headers = {
			Authorization: `Bearer ${token}`, // Thêm token vào header để xác thực
		};

		const response = await axios.post(
			`${API_URL}cart/mergeCart`, // Địa chỉ endpoint của BE
			{localItems}, // Gửi giỏ hàng của khách từ frontend
			{
				headers, // Đính kèm header Authorization
				withCredentials: true, // Đảm bảo cookie được gửi
			}
		);

		return response.data; // Trả về dữ liệu từ BE
	} catch (error) {
		throw error.response?.data || {message: 'Gộp giỏ hàng thất bại'};
	}
};
