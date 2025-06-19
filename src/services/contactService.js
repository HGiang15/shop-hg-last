import axiosClient from '.';

// Lấy token từ localStorage một cách an toàn
const getToken = () => {
	if (typeof window !== 'undefined') {
		// Sử dụng 'token' để nhất quán với voucherService.js
		return localStorage.getItem('token');
	}
	return null;
};

// [User] Gửi tin nhắn liên hệ
export const createContactMessage = async (contactData) => {
	try {
		const response = await axiosClient.post(`/api/contact`, contactData);
		return response.data;
	} catch (error) {
		throw error.response?.data || {message: 'Gửi tin nhắn thất bại'};
	}
};

// --- CÁC HÀM DÀNH CHO ADMIN ---

// [Admin] Lấy tất cả tin nhắn
export const getAllMessages = async (page = 1, limit = 10, search = '', sort = 'newest', status = '') => {
	try {
		const token = localStorage.getItem('token');
		const response = await axiosClient.get(`/api/contact`, {
			params: {page, limit, search, sort, status},
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});
		return response.data;
	} catch (error) {
		throw error.response?.data || {message: 'Lấy danh sách liên hệ thất bại'};
	}
};

// [Admin] Lấy chi tiết một tin nhắn
export const getMessageById = async (id) => {
	try {
		const token = getToken();
		const response = await axiosClient.get(`/api/contact/${id}`, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});
		return response.data;
	} catch (error) {
		throw error.response?.data || {message: 'Lấy chi tiết liên hệ thất bại'};
	}
};

// [Admin] Cập nhật trạng thái
export const updateMessageStatus = async (id, status) => {
	try {
		const token = getToken();
		const response = await axiosClient.put(
			`/api/contact/${id}/status`,
			{status},
			{
				headers: {
					Authorization: `Bearer ${token}`,
				},
			}
		);
		return response.data;
	} catch (error) {
		throw error.response?.data || {message: 'Cập nhật trạng thái thất bại'};
	}
};

// [Admin] Xóa một tin nhắn
export const deleteMessage = async (id) => {
	try {
		const token = getToken();
		const response = await axiosClient.delete(`/api/contact/${id}`, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});
		return response.data;
	} catch (error) {
		throw error.response?.data || {message: 'Xóa liên hệ thất bại'};
	}
};

// [Admin]: Gửi email trả lời
export const replyToMessage = async (id, replyData) => {
	// Đổi tên tham số cho rõ ràng
	try {
		const token = getToken();
		const response = await axiosClient.post(`/api/contact/${id}/reply`, replyData, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});
		return response.data;
	} catch (error) {
		throw error.response?.data || {message: 'Gửi trả lời thất bại'};
	}
};
