import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // basePath shifts all routes under /blog without changing the file structure.
  // app/page.tsx now serves at /blog instead of /
  // app/[slug]/page.tsx now serves at /blog/[slug] instead of /[slug]
  basePath: '/blog',
};

export default nextConfig;
