import {API_URL} from '@/constants/config';
import axios from 'axios';

// Lấy tất cả đánh giá theo productId
export const getReviewsByProductId = async (productId, page = 1, limit = 100) => {
	try {
		const response = await axios.get(`${API_URL}review/get-reviews-by-product-id/${productId}`, {
			params: {page, limit},
		});
		return response.data;
	} catch (error) {
		throw error.response?.data || {message: 'Không thể tải đánh giá.'};
	}
};

// Tạo đánh giá mới
export const createReview = async (reviewData) => {
	try {
		const token = localStorage.getItem('token');
		const response = await axios.post(`${API_URL}review/add-review`, reviewData, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});
		return response.data;
	} catch (error) {
		throw error.response?.data || {message: 'Không thể gửi đánh giá.'};
	}
};

// Lấy chi tiết một đánh giá theo id
export const getReviewById = async (id) => {
	try {
		const token = localStorage.getItem('token');
		const response = await axios.get(`${API_URL}review/get-review/${id}`, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});
		return response.data;
	} catch (error) {
		throw error.response?.data || {message: 'Không thể tải chi tiết đánh giá.'};
	}
};

// Cập nhật đánh giá
export const updateReview = async (id, updatedData) => {
	try {
		const token = localStorage.getItem('token');
		const response = await axios.put(`${API_URL}review/update-review/${id}`, updatedData, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});
		return response.data;
	} catch (error) {
		throw error.response?.data || {message: 'Không thể cập nhật đánh giá.'};
	}
};

// Xóa đánh giá
export const deleteReview = async (id) => {
	try {
		const token = localStorage.getItem('token');
		const response = await axios.delete(`${API_URL}review/delete-review/${id}`, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});
		return response.data;
	} catch (error) {
		throw error.response?.data || {message: 'Không thể xóa đánh giá.'};
	}
};
