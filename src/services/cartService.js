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
		const response = await axios.post(
			`${API_URL}cart/mergeCart`,
			{localItems},
			{
				withCredentials: true,
			}
		);
		return response.data;
	} catch (error) {
		throw error.response?.data || {message: 'Gộp giỏ hàng thất bại'};
	}
};
