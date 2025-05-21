import {API_URL} from '@/constants/config';
import axios from 'axios';

// Tạo đơn hàng
export const createOrder = async (orderData) => {
	try {
		const response = await axios.post(`${API_URL}orders/create`, orderData);
		return response.data;
	} catch (error) {
		throw error.response?.data || {message: 'Tạo đơn hàng thất bại'};
	}
};

// Lấy đơn hàng của người dùng đang đăng nhập
export const getUserOrders = async () => {
	try {
		const response = await axios.get(`${API_URL}orders/my-orders`);
		return response.data;
	} catch (error) {
		throw error.response?.data || {message: 'Lấy đơn hàng thất bại'};
	}
};

// Lấy tất cả đơn hàng (admin)
export const getAllOrders = async () => {
	try {
		const response = await axios.get(`${API_URL}orders/getAllOrders`);
		return response.data;
	} catch (error) {
		throw error.response?.data || {message: 'Lỗi khi lấy danh sách đơn hàng'};
	}
};

// Cập nhật trạng thái đơn hàng
export const updateOrderStatus = async (orderId, status) => {
	try {
		const response = await axios.put(`${API_URL}orders/update-status/${orderId}`, {status});
		return response.data;
	} catch (error) {
		throw error.response?.data || {message: 'Cập nhật trạng thái đơn hàng thất bại'};
	}
};
