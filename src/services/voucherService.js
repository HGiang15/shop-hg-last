import axiosClient from '.';

// Lấy danh sách voucher khả dụng cho user
export const getAvailableVouchersForUser = async () => {
	try {
		const token = localStorage.getItem('token');
		const response = await axiosClient.get('/api/voucher/getAvailableVouchersForUser', {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});
		return response.data;
	} catch (error) {
		throw error.response?.data || {message: 'Lấy voucher khả dụng thất bại'};
	}
};

// Lấy danh sách voucher
export const getAllVouchers = async (page = 1, limit = 1000, sort = 'newest', search = '', discountType = '') => {
	try {
		const token = localStorage.getItem('token');
		const response = await axiosClient.get('/api/voucher/getAllVouchers', {
			params: {page, limit, sort, search, discountType},
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});
		return response.data;
	} catch (error) {
		throw error.response?.data || {message: 'Lấy danh sách voucher thất bại'};
	}
};

// Tạo voucher mới
export const createVoucher = async (voucherData) => {
	try {
		const token = localStorage.getItem('token');
		const response = await axiosClient.post('/api/voucher/createVoucher', voucherData, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});
		return response.data;
	} catch (error) {
		throw error.response?.data || {message: 'Thêm voucher thất bại'};
	}
};

// Lấy chi tiết voucher theo ID
export const getVoucherById = async (id) => {
	try {
		const token = localStorage.getItem('token');
		const response = await axiosClient.get(`/api/voucher/getVoucherById/${id}`, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});
		return response.data;
	} catch (error) {
		throw error.response?.data || {message: 'Lấy chi tiết voucher thất bại'};
	}
};

// Cập nhật voucher
export const updateVoucher = async (id, voucherData) => {
	try {
		const token = localStorage.getItem('token');
		const response = await axiosClient.put(`/api/voucher/updateVoucher/${id}`, voucherData, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});
		return response.data;
	} catch (error) {
		throw error.response?.data || {message: 'Cập nhật voucher thất bại'};
	}
};

// Xóa voucher
export const deleteVoucher = async (id) => {
	try {
		const token = localStorage.getItem('token');
		const response = await axiosClient.delete(`/api/voucher/deleteVoucher/${id}`, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});
		return response.data;
	} catch (error) {
		throw error.response?.data || {message: 'Xóa voucher thất bại'};
	}
};

// Áp dụng voucher
export const applyVoucher = async ({code, userId, orderTotal}) => {
	try {
		const token = localStorage.getItem('token');
		const response = await axiosClient.post(
			'/api/voucher/applyVoucher',
			{code, userId, orderTotal},
			{
				headers: {
					Authorization: `Bearer ${token}`,
				},
			}
		);
		return response.data;
	} catch (error) {
		throw error.response?.data || {message: 'Áp dụng voucher thất bại'};
	}
};

// Xóa nhiều voucher
export const deleteMultipleVouchers = async (ids) => {
	try {
		const token = localStorage.getItem('token');
		const response = await axiosClient.delete('/api/voucher/deleteMultipleVouchers', {
			data: {ids},
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});
		return response.data;
	} catch (error) {
		throw error.response?.data || {message: 'Xóa nhiều voucher thất bại'};
	}
};
