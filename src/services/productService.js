import {API_URL} from '@/constants/config';
import axios from 'axios';

export const createProduct = async (productData) => {
	try {
		const response = await axios.post(`${API_URL}product/createProduct`, productData);
		return response.data;
	} catch (error) {
		throw error.response?.data || {message: 'Thêm sản phẩm thất bại'};
	}
};

export const updateProduct = async (productId, productData) => {
	try {
		const response = await axios.put(`${API_URL}product/updateProduct/${productId}`, productData);
		return response.data;
	} catch (error) {
		throw error.response?.data || {message: 'Chỉnh sửa sản phẩm thất bại'};
	}
};

export const getAllProducts = async () => {
	try {
		const response = await axios.get(`${API_URL}product/getAllProducts`);
		return response.data;
	} catch (error) {
		throw error.response?.data || {message: 'Lấy danh sách sản phẩm thất bại'};
	}
};

export const deleteProduct = async (productId) => {
	try {
		const response = await axios.delete(`${API_URL}product/deleteProduct/${productId}`);
		return response.data;
	} catch (error) {
		throw error.response?.data || {message: 'Xóa sản phẩm thất bại'};
	}
};

export const getProductById = async (productId) => {
	try {
		const response = await axios.get(`${API_URL}product/getProductById/${productId}`);
		return response.data;
	} catch (error) {
		throw error.response?.data || {message: 'Lấy thông tin sản phẩm thất bại'};
	}
};

export const getFeaturedProducts = async () => {
	try {
		const response = await axios.get(`${API_URL}product/featuredProducts`);
		return response.data;
	} catch (error) {
		throw error.response?.data || {message: 'Lấy sản phẩm nổi bật thất bại'};
	}
};

export const filterProducts = async (filters) => {
	try {
		const response = await axios.get(`${API_URL}product/filterProducts`, {params: filters});
		return response.data;
	} catch (error) {
		throw error.response?.data || {message: 'Lọc sản phẩm thất bại'};
	}
};
