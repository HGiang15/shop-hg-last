import axiosClient from '.';

// Đăng nhập thủ công
export const loginUser = async (email, password) => {
	try {
		const response = await axiosClient.post(`/api/user/login`, {email, password});
		return response.data;
	} catch (error) {
		throw error.response?.data || {message: 'Đăng nhập thất bại'};
	}
};

// Đăng nhập bằng Google
export const loginWithGoogle = async (token) => {
	try {
		const response = await axiosClient.post(`/api/user/google-login`, {token});
		return response.data;
	} catch (error) {
		throw error.response?.data || {message: 'Đăng nhập Google thất bại'};
	}
};

// Đăng ký
export const registerUser = async (userData) => {
	try {
		const response = await axiosClient.post(`/api/user/register`, userData);
		return response.data;
	} catch (error) {
		throw error.response?.data?.message || 'Đăng ký thất bại';
	}
};

// Quên mật khẩu
export const forgotPassword = async (email) => {
	try {
		const response = await axiosClient.post(`/api/user/forgotPassword`, {email});
		return response.data;
	} catch (error) {
		throw error.response?.data?.message || 'Gửi yêu cầu quên mật khẩu thất bại';
	}
};

// Đặt lại mật khẩu
export const resetPassword = async (email, otp, newPassword) => {
	try {
		const response = await axiosClient.post(`/api/user/resetPassword`, {
			email,
			otp,
			newPassword,
		});
		return response.data;
	} catch (error) {
		throw error.response?.data?.message || 'Đặt lại mật khẩu thất bại';
	}
};

// Xác thực OTP
export const verifyOTP = async (userId, otp) => {
	try {
		const response = await axiosClient.post(`/api/user/verifyOTP`, {userId, otp});
		return response.data;
	} catch (error) {
		throw error.response?.data?.message || 'Xác thực OTP thất bại';
	}
};

// Lấy danh sách người dùng
export const getListUser = async (page = 1, limit = 5, search = '', sort = 'newest', role = '', status = '') => {
	try {
		const response = await axiosClient.get(`/api/user/getListUser`, {
			params: {page, limit, search, sort, role, status},
		});
		return response.data;
	} catch (error) {
		throw error.response?.data || {message: 'Lỗi lấy danh sách người dùng'};
	}
};

// Get user by id
export const getUserById = async (id) => {
	try {
		const response = await axiosClient.get(`/api/user/getUserById/${id}`);
		return response.data.data;
	} catch (error) {
		throw error.response?.data || {message: 'Lỗi lấy thông tin người dùng'};
	}
};

// Update user
export const updateUser = async (id, updatedData) => {
	try {
		const response = await axiosClient.put(`/api/user/editUser/${id}`, updatedData);
		return response.data;
	} catch (error) {
		throw error.response?.data || {message: 'Cập nhật người dùng thất bại'};
	}
};

// Cập nhật trạng thái người dùng
export const updateUserStatus = async (id, status) => {
	try {
		const response = await axiosClient.put(`/api/user/status/${id}`, {status});
		return response.data;
	} catch (error) {
		throw error.response?.data || {message: 'Cập nhật trạng thái người dùng thất bại'};
	}
};

// Cập nhật vai trò người dùng
export const updateUserRole = async (id, role) => {
	try {
		const response = await axiosClient.put(`/api/user/role/${id}`, {role});
		return response.data;
	} catch (error) {
		throw error.response?.data || {message: 'Cập nhật vai trò người dùng thất bại'};
	}
};
