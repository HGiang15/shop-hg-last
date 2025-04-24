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
		],
	},
};

module.exports = nextConfig;
