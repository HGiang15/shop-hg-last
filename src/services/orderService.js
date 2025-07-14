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

// Lấy đơn hàng của người dùng đang đăng nhập profile user
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

// Lấy chi tiết đơn hàng theo ID admin
export const getOrderById = async (id) => {
	try {
		const response = await axiosClient.get(`/api/order/getOrderById/${id}`);
		return response.data;
	} catch (error) {
		throw error.response?.data || {message: 'Không thể lấy chi tiết đơn hàng'};
	}
};

// Lấy tất cả đơn hàng (admin)
export const getAllOrders = async (page = 1, limit = 100, status = '', search = '', sort = 'newest', startDate = '', endDate = '') => {
	try {
		const response = await axiosClient.get(`/api/order/getAllOrders`, {
			params: {
				page,
				limit,
				status,
				search,
				sort,
				startDate,
				endDate,
			},
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

// Thống kê
export const getDashboardStats = async () => {
	try {
		const token = localStorage.getItem('token');
		const response = await axiosClient.get('/api/order/dashboard-stats', {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});
		return response.data;
	} catch (error) {
		throw error.response?.data || {message: 'Lấy thống kê thất bại'};
	}
};

// Lấy dữ liệu biểu đồ doanh thu
export const getRevenueChart = async () => {
	try {
		const token = localStorage.getItem('token');
		const response = await axiosClient.get('/api/order/revenue-chart', {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});
		return response.data;
	} catch (error) {
		throw error.response?.data || {message: 'Lấy dữ liệu biểu đồ thất bại'};
	}
};

// Biểu đồ doanh thu theo ngày
export const getRevenueByDay = async () => {
	try {
		const token = localStorage.getItem('token');
		const response = await axiosClient.get('/api/order/revenue-by-day', {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});
		return response.data;
	} catch (error) {
		throw error.response?.data || {message: 'Lấy doanh thu theo ngày thất bại'};
	}
};

// Biểu đồ doanh thu theo năm
export const getRevenueByYear = async () => {
	try {
		const token = localStorage.getItem('token');
		const response = await axiosClient.get('/api/order/revenue-by-year', {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});
		return response.data;
	} catch (error) {
		throw error.response?.data || {message: 'Lấy doanh thu theo năm thất bại'};
	}
};

// Lịch sử giao dịch của người dùng
export const getTransactionHistory = async ({page = 1, limit = 1000, status = '', isPaid = '', paymentMethod = '', sort = 'desc'}) => {
	try {
		const token = localStorage.getItem('token');
		const response = await axiosClient.get('/api/order/transaction-history', {
			headers: {
				Authorization: `Bearer ${token}`,
			},
			params: {page, limit, status, isPaid, paymentMethod, sort},
		});
		return response.data;
	} catch (error) {
		throw error.response?.data || {message: 'Lấy lịch sử giao dịch thất bại'};
	}
};
