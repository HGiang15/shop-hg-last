import axiosClient from '.';

export const uploadSingle = async (formData) => {
	try {
		const response = await axiosClient.post('/api/upload/upload-single-file', formData, {
			headers: {'Content-Type': 'multipart/form-data'},
		});
		return response.data;
	} catch (error) {
		throw error.response?.data || {message: 'Upload file thất bại'};
	}
};

export const uploadMultiple = async (formData) => {
	try {
		const response = await axiosClient.post('/api/upload/upload-multiple-file', formData, {
			headers: {'Content-Type': 'multipart/form-data'},
		});
		return response.data;
	} catch (error) {
		throw error.response?.data || {message: 'Upload nhiều file thất bại'};
	}
};
