import axiosClient from '.';

// Lấy tất cả đánh giá theo productId
export const getReviewsByProductId = async (productId, page = 1, limit = 100) => {
	try {
		const response = await axiosClient.get(`/api/review/get-reviews-by-product-id/${productId}`, {
			params: {page, limit},
		});
		return response.data;
	} catch (error) {
		throw error.response?.data || {message: 'Không thể tải đánh giá.'};
	}
};

// Tạo đánh giá mới
export const createReview = async (reviewData) => {
	try {
		const token = localStorage.getItem('token');
		const response = await axiosClient.post(`/api/review/add-review`, reviewData, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});
		return response.data;
	} catch (error) {
		throw error.response?.data || {message: 'Không thể gửi đánh giá.'};
	}
};

// Lấy tất cả đánh giá của người dùng đang đăng nhập
export const getReviewsByUser = async (page = 1, limit = 3) => {
	try {
		const token = localStorage.getItem('token');
		const response = await axiosClient.get(`/api/review/get-reviews-by-user/me`, {
			headers: {Authorization: `Bearer ${token}`},
			params: {page, limit},
		});
		return response.data;
	} catch (error) {
		throw error.response?.data || {message: 'Không thể tải đánh giá của bạn.'};
	}
};

// Lấy chi tiết một đánh giá theo id
export const getReviewById = async (id) => {
	try {
		const token = localStorage.getItem('token');
		const response = await axiosClient.get(`/api/review/get-review-by-id/${id}`, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});
		return response.data;
	} catch (error) {
		throw error.response?.data || {message: 'Không thể tải chi tiết đánh giá.'};
	}
};

// Lấy tất cả đánh giá cho admin
export const getAllReviewsForAdmin = async (page = 1, limit = 10, search = '', rating = '', sort = '') => {
	try {
		const token = localStorage.getItem('token');
		const response = await axiosClient.get('/api/review/get-all-reviews-for-admin', {
			headers: {
				Authorization: `Bearer ${token}`,
			},
			params: {
				page,
				limit,
				search: search,
				rating: rating,
				sort: sort,
			},
		});
		return response.data;
	} catch (error) {
		throw error.response?.data || {message: 'Không thể tải danh sách đánh giá.'};
	}
};

// Cập nhật đánh giá
export const updateReview = async (id, updatedData) => {
	try {
		const token = localStorage.getItem('token');
		const response = await axiosClient.put(`/api/review/update-review/${id}`, updatedData, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});
		return response.data;
	} catch (error) {
		throw error.response?.data || {message: 'Không thể cập nhật đánh giá.'};
	}
};

// Xóa đánh giá
export const deleteReview = async (id) => {
	try {
		const token = localStorage.getItem('token');
		const response = await axiosClient.delete(`/api/review/delete-review/${id}`, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});
		return response.data;
	} catch (error) {
		throw error.response?.data || {message: 'Không thể xóa đánh giá.'};
	}
};

// Xóa nhiều đánh giá
export const deleteMultipleReviews = async (ids) => {
	try {
		const token = localStorage.getItem('token');
		const response = await axiosClient.delete('/api/review/delete-multiple-reviews', {
			headers: {
				Authorization: `Bearer ${token}`,
			},
			data: {
				ids,
			},
		});
		return response.data;
	} catch (error) {
		throw error.response?.data || {message: 'Không thể xóa nhiều đánh giá.'};
	}
};
