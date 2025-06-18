import { NextConfig } from 'next';

const nextConfig: NextConfig = {
    env: {
      CHAPTERS_MAX_PAGE_SIZE: process.env.CHAPTERS_MAX_PAGE_SIZE,
      RESOURCES_MAX_PAGE_SIZE: process.env.RESOURCES_MAX_PAGE_SIZE
    }
};

export default nextConfig;
