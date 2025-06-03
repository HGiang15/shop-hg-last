import axiosClient from '.';

// Lấy địa chỉ của người dùng
export const getUserAddresses = async () => {
	try {
		const token = localStorage.getItem('token');
		const response = await axiosClient.get(`/api/user-addresses/getUserAddresses`, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});
		return response.data;
	} catch (error) {
		throw error.response?.data || {message: 'Lấy danh sách địa chỉ thất bại'};
	}
};

// Tạo địa chỉ mới
export const createAddress = async (addressData) => {
	try {
		const token = localStorage.getItem('token');
		const response = await axiosClient.post(`/api/user-addresses/createAddress`, addressData, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});
		return response.data;
	} catch (error) {
		throw error.response?.data || {message: 'Tạo địa chỉ thất bại'};
	}
};

// Cập nhật địa chỉ
export const updateAddress = async (addressId, addressData) => {
	try {
		const token = localStorage.getItem('token');
		const response = await axiosClient.put(`/api/user-addresses/updateAddress/${addressId}`, addressData, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});
		return response.data;
	} catch (error) {
		throw error.response?.data || {message: 'Cập nhật địa chỉ thất bại'};
	}
};

// Lấy chi tiết địa chỉ theo ID
export const getUserAddressDetail = async (addressId) => {
	try {
		const token = localStorage.getItem('token');
		const response = await axiosClient.get(`/api/user-addresses/getUserAddressDetail/${addressId}`, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});
		return response.data;
	} catch (error) {
		throw error.response?.data || {message: 'Lấy chi tiết địa chỉ thất bại'};
	}
};

// Đặt địa chỉ mặc định
export const setDefaultAddress = async (addressId) => {
	try {
		const token = localStorage.getItem('token');
		const response = await axiosClient.put(`/api/user-addresses/setDefaultAddress/${addressId}`, undefined, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});
		return response.data;
	} catch (error) {
		throw error.response?.data || {message: 'Đặt địa chỉ mặc định thất bại'};
	}
};

// Xóa địa chỉ
export const deleteAddress = async (addressId) => {
	try {
		const token = localStorage.getItem('token');
		const response = await axiosClient.delete(`/api/user-addresses/deleteAddress/${addressId}`, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});
		return response.data;
	} catch (error) {
		throw error.response?.data || {message: 'Xóa địa chỉ thất bại'};
	}
};
