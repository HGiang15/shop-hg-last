import {API_URL} from '@/constants/config';
import axios from 'axios';

export const createCategory = async (categoryData) => {
	try {
		const response = await axios.post(`${API_URL}category/createCategory `, categoryData);
		return response.data;
	} catch (error) {
		throw error.response?.data || {message: 'Thêm sản phẩm thất bại'};
	}
};

export const getAllCategories = async () => {
	try {
		const response = await axios.get(`${API_URL}category/getAllCategories`);
		return response.data;
	} catch (error) {
		throw error.response?.data || {message: 'Lấy danh sách danh mục thất bại'};
	}
};

export const getCategoryById = async (id) => {
	try {
		const response = await axios.get(`${API_URL}category/getCategoryById/${id}`);
		return response.data;
	} catch (error) {
		throw error.response?.data || {message: 'Lấy danh mục thất bại'};
	}
};

export const updateCategory = async (id, categoryData) => {
	try {
		const response = await axios.put(`${API_URL}category/updateCategory/${id}`, categoryData);
		return response.data;
	} catch (error) {
		throw error.response?.data || {message: 'Cập nhật danh mục thất bại'};
	}
};

export const deleteCategory = async (categoryId) => {
	try {
		const response = await axios.delete(`${API_URL}category/deleteCategory/${categoryId}`);
		return response.data;
	} catch (error) {
		throw error.response?.data || {message: 'Xóa danh mục thất bại'};
	}
};
