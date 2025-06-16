import axiosClient from '.';

export const createProduct = async (productData) => {
	try {
		const response = await axiosClient.post(`/api/product/createProduct`, productData);
		return response.data;
	} catch (error) {
		throw error.response?.data || {message: 'Thêm sản phẩm thất bại'};
	}
};

export const updateProduct = async (productId, productData) => {
	try {
		const response = await axiosClient.put(`/api/product/updateProduct/${productId}`, productData);
		return response.data;
	} catch (error) {
		throw error.response?.data || {message: 'Chỉnh sửa sản phẩm thất bại'};
	}
};

export const getAllProducts = async (page = 1, limit = 5, sort = 'newest', search = '') => {
	try {
		const response = await axiosClient.get(`/api/product/getAllProducts`, {
			params: {page, limit, sort, search},
		});
		return response.data;
	} catch (error) {
		throw error.response?.data || {message: 'Lấy danh sách sản phẩm thất bại'};
	}
};

export const deleteProduct = async (productId) => {
	try {
		const response = await axiosClient.delete(`/api/product/deleteProduct/${productId}`);
		return response.data;
	} catch (error) {
		throw error.response?.data || {message: 'Xóa sản phẩm thất bại'};
	}
};

export const deleteMultipleProducts = async (ids) => {
	try {
		const response = await axiosClient.delete(`/api/product/deleteMultipleProducts`, {
			data: {ids},
		});
		return response.data;
	} catch (error) {
		throw error.response?.data || {message: 'Xóa nhiều sản phẩm thất bại'};
	}
};

export const getProductById = async (productId) => {
	try {
		const response = await axiosClient.get(`/api/product/getProductById/${productId}`);
		return response.data;
	} catch (error) {
		throw error.response?.data || {message: 'Lấy thông tin sản phẩm thất bại'};
	}
};

export const getFeaturedProducts = async () => {
	try {
		const response = await axiosClient.get(`/api/product/featuredProducts`);
		return response.data;
	} catch (error) {
		throw error.response?.data || {message: 'Lấy sản phẩm nổi bật thất bại'};
	}
};

export const filterProducts = async (filters) => {
	try {
		const response = await axiosClient.get(`/api/product/filterProducts`, {params: filters});
		return response.data;
	} catch (error) {
		throw error.response?.data || {message: 'Lọc sản phẩm thất bại'};
	}
};
