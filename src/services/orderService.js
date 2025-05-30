import axiosClient from '.';

export const createVNPayUrl = async ({amount, orderId}) => {
	try {
		const token = localStorage.getItem('token');
		const res = await axiosClient.post(
			`/api/order/create-payment-url`,
			{amount, orderId},
			{
				headers: {
					Authorization: `Bearer ${token}`,
				},
			}
		);
		return res.data;
	} catch (error) {
		throw error.response?.data || {message: 'Tạo link thanh toán thất bại'};
	}
};

// Tạo đơn hàng
export const createOrder = async (orderData) => {
	try {
		const token = localStorage.getItem('token');
		const response = await axiosClient.post(`/api/order/create-order`, orderData, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});
		return response.data;
	} catch (error) {
		throw error.response?.data || {message: 'Tạo đơn hàng thất bại'};
	}
};

// Lấy đơn hàng của người dùng đang đăng nhập
export const getUserOrders = async () => {
	try {
		const token = localStorage.getItem('token');
		const response = await axiosClient.get(`/api/order/my-order`, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});
		return response.data;
	} catch (error) {
		throw error.response?.data || {message: 'Lấy đơn hàng thất bại'};
	}
};

// Lấy chi tiết đơn hàng theo ID
export const getOrderById = async (id) => {
	try {
		const response = await axiosClient.get(`/api/order/getOrderById/${id}`);
		return response.data;
	} catch (error) {
		throw error.response?.data || {message: 'Không thể lấy chi tiết đơn hàng'};
	}
};

// Lấy tất cả đơn hàng (admin)
export const getAllOrders = async (page = 1, limit = 100, status = '') => {
	try {
		const response = await axiosClient.get(`/api/order/getAllOrders`, {
			params: {page, limit, status},
		});
		return response.data;
	} catch (error) {
		throw error.response?.data || {message: 'Lỗi khi lấy danh sách đơn hàng'};
	}
};

// Cập nhật trạng thái đơn hàng
export const updateOrderStatus = async (orderId, status) => {
	try {
		const response = await axiosClient.put(`/api/order/update-status/${orderId}`, {status});
		return response.data;
	} catch (error) {
		throw error.response?.data || {message: 'Cập nhật trạng thái đơn hàng thất bại'};
	}
};

// Xóa đơn hàng (admin)
export const deleteOrder = async (orderId) => {
	try {
		const token = localStorage.getItem('token');
		const response = await axiosClient.delete(`/api/order/delete-order/${orderId}`, {
			headers: {Authorization: `Bearer ${token}`},
		});
		return response.data;
	} catch (error) {
		throw error.response?.data || {message: 'Xoá đơn hàng thất bại'};
	}
};
