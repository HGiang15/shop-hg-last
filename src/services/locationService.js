import axiosClient from '.';

// danh sách tỉnh/thành
export const getProvinces = async () => {
	try {
		const response = await axiosClient.get(`/api/locations/provinces`);
		return response.data;
	} catch (error) {
		throw error.response?.data || {message: 'Lấy danh sách tỉnh/thành thất bại'};
	}
};

// danh sách quận/huyện theo provinceId
export const getDistricts = async (provinceId) => {
	try {
		const response = await axiosClient.get(`/api/locations/districts/${provinceId}`);
		return response.data;
	} catch (error) {
		throw error.response?.data || {message: 'Lấy danh sách quận/huyện thất bại'};
	}
};

// danh sách phường/xã theo districtId
export const getWards = async (districtId) => {
	try {
		const response = await axiosClient.get(`/api/locations/wards/${districtId}`);
		return response.data;
	} catch (error) {
		throw error.response?.data || {message: 'Lấy danh sách phường/xã thất bại'};
	}
};
