import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
    ],
  },
  webpack: (config, { isServer, dev }) => {
    if (!isServer && !dev) {
      const workboxWebpackPlugin = require('workbox-webpack-plugin');
      config.plugins.push(
        new workboxWebpackPlugin.InjectManifest({
          swSrc: 'src/lib/sw.ts',
          swDest: '../public/sw.js',
          // Other configurations if needed
        })
      );
    }
    return config;
  },
};

export default nextConfig;
