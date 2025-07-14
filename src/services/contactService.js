import axiosClient from '.';

const getToken = () => {
	if (typeof window !== 'undefined') {
		return localStorage.getItem('token');
	}
	return null;
};

// user Gửi tin nhắn liên hệ
export const createContactMessage = async (contactData) => {
	try {
		const response = await axiosClient.post(`/api/contact/createContactMessage`, contactData);
		return response.data;
	} catch (error) {
		throw error.response?.data || {message: 'Gửi tin nhắn thất bại'};
	}
};

// admin Lấy tất cả tin nhắn
export const getAllMessages = async (page = 1, limit = 10, search = '', sort = 'newest', status = '') => {
	try {
		const token = localStorage.getItem('token');
		const response = await axiosClient.get(`/api/contact/getAllMessages`, {
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

// admin Lấy chi tiết một tin nhắn
export const getMessageById = async (id) => {
	try {
		const token = getToken();
		const response = await axiosClient.get(`/api/contact/getMessageById/${id}`, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});
		return response.data;
	} catch (error) {
		throw error.response?.data || {message: 'Lấy chi tiết liên hệ thất bại'};
	}
};

// admin Cập nhật trạng thái
export const updateMessageStatus = async (id, status) => {
	try {
		const token = getToken();
		const response = await axiosClient.put(
			`/api/contact/updateMessageStatus/${id}/status`,
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

// admin Xóa một tin nhắn
export const deleteMessage = async (id) => {
	try {
		const token = getToken();
		const response = await axiosClient.delete(`/api/contact/deleteMessage/${id}`, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});
		return response.data;
	} catch (error) {
		throw error.response?.data || {message: 'Xóa liên hệ thất bại'};
	}
};

// admin: Gửi email trả lời
export const replyToMessage = async (id, replyData) => {
	try {
		const token = getToken();
		const response = await axiosClient.post(`/api/contact/replyToMessage/${id}/reply`, replyData, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});
		return response.data;
	} catch (error) {
		throw error.response?.data || {message: 'Gửi trả lời thất bại'};
	}
};
