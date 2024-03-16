/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.externals.push({
      'utf-8-validate': 'commonjs utf-8-validate',
      bufferutil: 'commonjs bufferutil',
    })

    return config
  },
  reactStrictMode: false,
  env: {
    ENV_CODE: process.env.ENV_CODE || '',
  },
  images: {
    domains: ['uploadthing.com', 'utfs.io', 'storage.googleapis.com'],
  },
}

module.exports = nextConfig
