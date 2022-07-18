/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    GEOAPIFY_API_KEY: process.env.GEOAPIFY_API_KEY,
  }
}

module.exports = nextConfig
