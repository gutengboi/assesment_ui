import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/login',
        destination: 'https://api-assessment.onrender.com/auth/login',
      },
    ];
  },
};

export default nextConfig;
