/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	images: {
		remotePatterns: [
			{
				protocol: 'http',
				hostname: 'localhost',
				port: '3003',
				pathname: '/uploads/**', // Đường dẫn bắt đầu là /uploads/
			},
			{
				protocol: 'https',
				hostname: 'lh3.googleusercontent.com',
				pathname: '/**', // Cho phép tất cả ảnh từ Googleusercontent
			},
		],
	},
};

module.exports = nextConfig;
