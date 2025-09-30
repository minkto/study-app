import { NextConfig } from 'next';

const nextConfig: NextConfig = {
  env: {
    CHAPTERS_MAX_PAGE_SIZE: process.env.CHAPTERS_MAX_PAGE_SIZE,
    RESOURCES_MAX_PAGE_SIZE: process.env.RESOURCES_MAX_PAGE_SIZE,
    DEFAULT_DAYS_BEFORE_CHAPTER_REVIEW_DUE: process.env.DEFAULT_DAYS_BEFORE_CHAPTER_REVIEW_DUE
  }, 
  output: "standalone"

};

export default nextConfig;
