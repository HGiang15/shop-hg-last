export const ROUTES = {
	// User
	Home: '/',
	About: '/about',
	Product: '/products',
	Profile: '/profile',
	Cart: '/cart',
	Order: '/order',
	ChangePassword: '/profile/change-password',
	Address: '/profile/address',
	HistoryOrder: '/profile/history-order',

	// Admin
	AdminDashboard: '/admin/dashboard',
	AdminUser: '/admin/user',
	AdminColor: '/admin/color',
	AdminSize: '/admin/size',
	AdminCategory: '/admin/category',

	AdminProduct: '/admin/product',
	AdminProductCreate: '/admin/product/create',
	AdminProductUpdate: '/admin/product/update',

	AdminOrder: '/admin/order',
	AdminOrderConfirm: '/admin/order/delivery',
	AdminOrderSuccess: '/admin/order/success',
	AdminOrderCancel: '/admin/order/cancel',

	// Auth
	Login: '/auth/login',
	Register: '/auth/register',
	forgot_password: '/auth/forgot-password',
	verify_password: '/auth/verify-password',
	ResetPassword: '/auth/reset-password',
};

export const API_URL = process.env.NODE_ENV == 'development' ? 'http://localhost:3003/api/' : 'https://shop-hg-last-be.vercel.app/api/';
export const API_URL_IMG = process.env.NODE_ENV == 'development' ? 'http://localhost:3003/' : 'https://shop-hg-last-be.vercel.app/';

// export const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/api/`;
// export const API_URL_IMG = process.env.NEXT_PUBLIC_API_URL + '/';

export const SET_ACTIVE_MENU = 'SET_ACTIVE_MENU';
