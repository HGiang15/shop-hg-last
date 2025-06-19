export const ROUTES = {
	// User
	Home: '/',
	About: '/about',
	Policy: '/policy',
	Contact: '/contact',
	Product: '/products',
	Profile: '/profile',
	Cart: '/cart',
	Order: '/order',
	ChangePassword: '/profile/change-password',
	Address: '/profile/address',
	TransactionHistory: '/profile/transaction-history',
	MyReview: '/profile/my-review',
	HistoryOrder: '/profile/history-order',

	// Admin
	AdminDashboard: '/admin/dashboard',
	AdminUser: '/admin/user',
	AdminColor: '/admin/color',
	AdminSize: '/admin/size',
	AdminCategory: '/admin/category',
	AdminReview: '/admin/review',
	AdminVoucher: '/admin/voucher',
	AdminContact: '/admin/contact',
	AdminProfile: '/admin/profile',
	AdminChangePassword: '/admin/change-password',

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

export const SET_ACTIVE_MENU = 'SET_ACTIVE_MENU';
