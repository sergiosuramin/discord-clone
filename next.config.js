/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  env: {
    ENV_CODE: process.env.ENV_CODE || '',
  },
}

module.exports = nextConfig
