import axiosClient from '.';

export const getAllColors = async (page = 1, limit = 10, sort = 'newest', search = '') => {
	try {
		const response = await axiosClient.get(`/api/color/getAllColors`, {
			params: {page, limit, sort, search},
		});
		return response.data;
	} catch (error) {
		throw error.response?.data || {message: 'Lấy danh sách màu thất bại'};
	}
};

export const createColor = async (colorData) => {
	try {
		const response = await axiosClient.post(`/api/color/createColor`, colorData);
		return response.data;
	} catch (error) {
		throw error.response?.data || {message: 'Thêm màu thất bại'};
	}
};

export const getColorById = async (id) => {
	try {
		const response = await axiosClient.get(`/api/color/getColorById/${id}`);
		return response.data;
	} catch (error) {
		throw error.response?.data || {message: 'Lấy màu theo ID thất bại'};
	}
};

export const updateColor = async (id, colorData) => {
	try {
		const response = await axiosClient.put(`/api/color/updateColor/${id}`, colorData);
		return response.data;
	} catch (error) {
		throw error.response?.data || {message: 'Cập nhật màu thất bại'};
	}
};

export const deleteColor = async (id) => {
	try {
		const response = await axiosClient.delete(`/api/color/deleteColor/${id}`);
		return response.data;
	} catch (error) {
		throw error.response?.data || {message: 'Xóa màu thất bại'};
	}
};

export const deleteMultipleColors = async (ids) => {
	try {
		const response = await axiosClient.delete(`/api/color/delete-multiple`, {
			data: {ids},
		});
		return response.data;
	} catch (error) {
		throw error.response?.data || {message: 'Xóa nhiều màu thất bại'};
	}
};
