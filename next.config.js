/** @type {import('next').NextConfig} */
const nextConfig = {
  // output: 'export',   // ❌ remove to enable API routes
  eslint: {
    ignoreDuringBuilds: true,
  },
  // For static exports, we need to keep unoptimized: true, but we'll add other optimizations
  images: {
    unoptimized: true,
    // These settings will be used when not in export mode
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    formats: ['image/webp'],
  },
  // Improve SEO by adding trailing slashes consistently
  trailingSlash: true,
  // Improve performance
  swcMinify: true,
  // Add compression for better performance
  compress: true,
  // Add poweredByHeader for security
  poweredByHeader: false,
  // Note: Custom headers cannot be used with "output: export"
  // If you need to add security headers, consider using a static hosting service
  // that allows you to configure headers (like Vercel, Netlify, or AWS S3 with CloudFront)
};

module.exports = nextConfig;
