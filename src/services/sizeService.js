import {API_URL} from '@/constants/config';
import axios from 'axios';

export const getAllSizes = async (page = 1, limit = 5) => {
	try {
		const response = await axios.get(`${API_URL}size/getAllSizes`, {
			params: {page, limit},
		});
		return response.data;
	} catch (error) {
		throw error.response?.data || {message: 'Lấy danh sách kích cỡ thất bại'};
	}
};

export const createSize = async (sizeData) => {
	try {
		const response = await axios.post(`${API_URL}size/createSize`, sizeData);
		return response.data;
	} catch (error) {
		throw error.response?.data || {message: 'Thêm kích cỡ thất bại'};
	}
};

export const getSizeById = async (id) => {
	try {
		const response = await axios.get(`${API_URL}size/getSizeById/${id}`);
		return response.data;
	} catch (error) {
		throw error.response?.data || {message: 'Lấy kích cỡ theo ID thất bại'};
	}
};

export const updateSize = async (id, sizeData) => {
	try {
		const response = await axios.put(`${API_URL}size/updateSize/${id}`, sizeData);
		return response.data;
	} catch (error) {
		throw error.response?.data || {message: 'Cập nhật kích cỡ thất bại'};
	}
};

export const deleteSize = async (id) => {
	try {
		const response = await axios.delete(`${API_URL}size/deleteSize/${id}`);
		return response.data;
	} catch (error) {
		throw error.response?.data || {message: 'Xóa kích cỡ thất bại'};
	}
};
