/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	// images: {
	// 	domains: ['localhost', 'lh3.googleusercontent.com'],
	// 	remotePatterns: [
	// 		{
	// 			protocol: 'http',
	// 			hostname: 'localhost',
	// 			port: '3003',
	// 			pathname: '/uploads/**',
	// 		},
	// 	],
	// },
	images: {
		remotePatterns: [
			{
				protocol: 'https',
				hostname: '**',
			},
			{
				protocol: 'http',
				hostname: '**',
			},
		],
	},
};

module.exports = nextConfig;
