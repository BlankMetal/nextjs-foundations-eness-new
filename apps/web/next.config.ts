import type { NextConfig } from 'next';

// In production, set BLOG_URL to the deployed blog app's domain.
// Locally, it falls back to the blog dev server on port 3001.
const blogUrl = process.env.BLOG_URL || 'http://localhost:3001';

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      // Rule 1: exact match for /blog (the index page)
      {
        source: '/blog',
        destination: `${blogUrl}/blog`,
      },
      // Rule 2: catch-all for /blog/anything/nested
      // :path* captures zero or more segments after /blog/
      {
        source: '/blog/:path*',
        destination: `${blogUrl}/blog/:path*`,
      },
    ];
  },
};

export default nextConfig;
