import {API_URL} from '@/constants/config';
import axios from 'axios';

export const getAllColors = async () => {
	try {
		const response = await axios.get(`${API_URL}color/getAllColors`);
		return response.data;
	} catch (error) {
		throw error.response?.data || {message: 'Lấy danh sách màu thất bại'};
	}
};

export const createColor = async (colorData) => {
	try {
		const response = await axios.post(`${API_URL}color/createColor`, colorData);
		return response.data;
	} catch (error) {
		throw error.response?.data || {message: 'Thêm màu thất bại'};
	}
};

export const getColorById = async (id) => {
	try {
		const response = await axios.get(`${API_URL}color/getColorById/${id}`);
		return response.data;
	} catch (error) {
		throw error.response?.data || {message: 'Lấy màu theo ID thất bại'};
	}
};

export const updateColor = async (id, colorData) => {
	try {
		const response = await axios.put(`${API_URL}color/updateColor/${id}`, colorData);
		return response.data;
	} catch (error) {
		throw error.response?.data || {message: 'Cập nhật màu thất bại'};
	}
};

export const deleteColor = async (id) => {
	try {
		const response = await axios.delete(`${API_URL}color/deleteColor/${id}`);
		return response.data;
	} catch (error) {
		throw error.response?.data || {message: 'Xóa màu thất bại'};
	}
};
