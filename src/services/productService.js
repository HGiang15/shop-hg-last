import {API_URL} from '@/constants/config';
import axios from 'axios';

export const createProduct = async (productData) => {
	try {
		const response = await axios.post(`${API_URL}product/createProduct`, productData);
		return response.data;
	} catch (error) {
		throw error.response?.data || {message: 'Thêm sản phẩm thất bại'};
	}
};
