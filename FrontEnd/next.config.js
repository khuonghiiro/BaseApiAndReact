/** @type {import('next').NextConfig} */

const nextConfig = {
    //reactStrictMode: false, // React Strict Mode is off
    //output: 'export',
    //which can then be deployed on its own without installing node_modules
    output: 'standalone',
    eslint: {
        // Warning: This allows production builds to successfully complete even if
        // your project has ESLint errors.
        ignoreDuringBuilds: true,
    },
	generateBuildId: async () => {
        // This could be anything, using the latest git hash
        return '82322C83C3A3476246B398A1196C5'
    },
    typescript: {
        // Tắt typescript-checking trong quá trình build
        ignoreBuildErrors: true,
    },
    //xuat file tinh
    //useFileSystemPublicRoutes: false,
    images: {
        remotePatterns: [
            {
                protocol: 'http',
                hostname: 'localhost',
            }
        ],
    },
}

module.exports = nextConfig