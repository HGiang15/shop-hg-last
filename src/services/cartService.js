import axiosClient from '.';

export const getAllCart = async () => {
	try {
		const token = localStorage.getItem('token');

		const response = await axiosClient.get(`/api/cart/getAllCart`, {
			withCredentials: true,
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});

		return response.data;
	} catch (error) {
		throw error.response?.data || {message: 'Lấy giỏ hàng thất bại'};
	}
};

export const removeItemFromCart = async (itemId) => {
	try {
		const token = localStorage.getItem('token');

		const response = await axiosClient.delete(`/api/cart/removeItem/${itemId}`, {
			withCredentials: true,
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});

		return response.data;
	} catch (error) {
		throw error.response?.data || {message: 'Xoá sản phẩm khỏi giỏ hàng thất bại'};
	}
};

export const addToCart = async (productData) => {
	try {
		const token = localStorage.getItem('token');
		const headers = token ? {Authorization: `Bearer ${token}`} : {};

		const response = await axiosClient.post(`/api/cart/addToCart`, productData, {
			headers,
			withCredentials: true,
		});

		return response.data;
	} catch (error) {
		throw error.response?.data || {message: 'Thêm vào giỏ hàng thất bại'};
	}
};

export const updateCartItem = async (itemId, quantity) => {
	try {
		const token = localStorage.getItem('token');
		const response = await axiosClient.put(
			`/api/cart/updateItem`,
			{itemId, quantity},
			{
				withCredentials: true,
				headers: {
					Authorization: `Bearer ${token}`,
				},
			}
		);

		return response.data;
	} catch (error) {
		throw error.response?.data || {message: 'Cập nhật số lượng thất bại'};
	}
};

export const mergeCart = async (localItems) => {
	try {
		const token = localStorage.getItem('token');

		if (!token) throw new Error('Không có thông tin người dùng');

		const headers = {
			Authorization: `Bearer ${token}`,
		};

		const response = await axiosClient.post(
			`/api/cart/mergeCart`,
			{localItems},
			{
				headers,
				withCredentials: true,
			}
		);

		return response.data;
	} catch (error) {
		throw error.response?.data || {message: 'Gộp giỏ hàng thất bại'};
	}
};
