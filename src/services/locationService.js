import {API_URL} from '@/constants/config';
import axios from 'axios';

// Lấy danh sách tỉnh/thành
export const getProvinces = async () => {
	try {
		const response = await axios.get(`${API_URL}locations/provinces`);
		return response.data;
	} catch (error) {
		throw error.response?.data || {message: 'Lấy danh sách tỉnh/thành thất bại'};
	}
};

// Lấy danh sách quận/huyện theo provinceId
export const getDistricts = async (provinceId) => {
	try {
		const response = await axios.get(`${API_URL}locations/districts/${provinceId}`);
		return response.data;
	} catch (error) {
		throw error.response?.data || {message: 'Lấy danh sách quận/huyện thất bại'};
	}
};

// Lấy danh sách phường/xã theo districtId
export const getWards = async (districtId) => {
	try {
		const response = await axios.get(`${API_URL}locations/wards/${districtId}`);
		return response.data;
	} catch (error) {
		throw error.response?.data || {message: 'Lấy danh sách phường/xã thất bại'};
	}
};
