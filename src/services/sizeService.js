import axiosClient from '.';

export const getAllSizes = async (page = 1, limit = 1000, sort = 'newest', search = '') => {
	try {
		const response = await axiosClient.get(`/api/size/getAllSizes`, {
			params: {page, limit, sort, search},
		});
		return response.data;
	} catch (error) {
		throw error.response?.data || {message: 'Lấy danh sách kích cỡ thất bại'};
	}
};

export const createSize = async (sizeData) => {
	try {
		const response = await axiosClient.post(`/api/size/createSize`, sizeData);
		return response.data;
	} catch (error) {
		throw error.response?.data || {message: 'Thêm kích cỡ thất bại'};
	}
};

// Lấy danh sách size theo categoryId
export const getSizesByCategoryId = async (categoryId) => {
	try {
		const response = await axiosClient.get(`/api/size/by-category/${categoryId}`);
		return response.data;
	} catch (error) {
		throw error.response?.data || {message: 'Lấy kích cỡ theo danh mục thất bại'};
	}
};

export const getSizeById = async (id) => {
	try {
		const response = await axiosClient.get(`/api/size/getSizeById/${id}`);
		return response.data;
	} catch (error) {
		throw error.response?.data || {message: 'Lấy kích cỡ theo ID thất bại'};
	}
};

export const updateSize = async (id, sizeData) => {
	try {
		const response = await axiosClient.put(`/api/size/updateSize/${id}`, sizeData);
		return response.data;
	} catch (error) {
		throw error.response?.data || {message: 'Cập nhật kích cỡ thất bại'};
	}
};

export const deleteSize = async (id) => {
	try {
		const response = await axiosClient.delete(`/api/size/deleteSize/${id}`);
		return response.data;
	} catch (error) {
		throw error.response?.data || {message: 'Xóa kích cỡ thất bại'};
	}
};

export const deleteMultipleSizes = async (ids) => {
	try {
		const response = await axiosClient.delete(`/api/size/delete-multiple`, {
			data: {ids},
		});
		return response.data;
	} catch (error) {
		throw error.response?.data || {message: 'Xóa nhiều kích cỡ thất bại'};
	}
};
