import axiosClient from '.';

export const createCategory = async (categoryData) => {
	try {
		const response = await axiosClient.post(`/api/category/createCategory`, categoryData);
		return response.data;
	} catch (error) {
		throw error.response?.data || {message: 'Thêm sản phẩm thất bại'};
	}
};

export const getAllCategories = async (page = 1, limit = 20, sort = 'newest', search = '') => {
	try {
		const response = await axiosClient.get(`/api/category/getAllCategories`, {
			params: {page, limit, sort, search},
		});
		return response.data;
	} catch (error) {
		throw error.response?.data || {message: 'Lấy danh sách danh mục thất bại'};
	}
};

export const getCategoryById = async (id) => {
	try {
		const response = await axiosClient.get(`/api/category/getCategoryById/${id}`);
		return response.data;
	} catch (error) {
		throw error.response?.data || {message: 'Lấy danh mục thất bại'};
	}
};

export const updateCategory = async (id, categoryData) => {
	try {
		const response = await axiosClient.put(`/api/category/updateCategory/${id}`, categoryData);
		return response.data;
	} catch (error) {
		throw error.response?.data || {message: 'Cập nhật danh mục thất bại'};
	}
};

export const deleteCategory = async (categoryId) => {
	try {
		const response = await axiosClient.delete(`/api/category/deleteCategory/${categoryId}`);
		return response.data;
	} catch (error) {
		throw error.response?.data || {message: 'Xóa danh mục thất bại'};
	}
};

export const deleteMultipleCategories = async (ids) => {
	try {
		const response = await axiosClient.delete(`/api/category/delete-multiple`, {
			data: {ids},
		});
		return response.data;
	} catch (error) {
		throw error.response?.data || {message: 'Xoá nhiều danh mục thất bại'};
	}
};
