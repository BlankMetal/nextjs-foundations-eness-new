import type { NextConfig } from 'next';

// In production, set BLOG_URL to the deployed blog app's domain.
// Locally, it falls back to the blog dev server on port 3001.
const blogUrl = process.env.BLOG_URL || 'http://localhost:3001';

const nextConfig: NextConfig = {
  // Enables the "use cache" directive for functions and components
  cacheComponents: true,

  // Cache profiles control how long data stays fresh before revalidating.
  // Each profile defines three durations (in seconds):
  //   stale:      serve from cache without revalidation
  //   revalidate: serve stale while fetching fresh data in the background
  //   expire:     force a synchronous regeneration (hard deadline)
  cacheLife: {
    blog: {
      stale: 3600,      // 1 hour fresh
      revalidate: 86400, // 24 hours before background revalidation
      expire: 604800,    // 1 week hard max
    },
    products: {
      stale: 300,       // 5 minutes fresh
      revalidate: 900,  // 15 minutes before background revalidation
      expire: 3600,     // 1 hour hard max
    },
    social: {
      stale: 60,        // 1 minute fresh
      revalidate: 300,  // 5 minutes before background revalidation
      expire: 600,      // 10 minutes hard max
    },
  },

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
