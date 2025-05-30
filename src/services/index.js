import axios from 'axios';

const axiosClient = axios.create({
	headers: {
		'content-type': 'application/json',
	},
	baseURL: process.env.NODE_ENV == 'development' ? process.env.NEXT_PUBLIC_API_URL_DEV : process.env.NEXT_PUBLIC_API_URL_PRODUCTION,
	timeout: 15000,
	timeoutErrorMessage: 'Timeout error request',
});

export default axiosClient;
