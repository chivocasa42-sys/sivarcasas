import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'standalone',
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  async redirects() {
    const departments = [
      'ahuachapan',
      'cabanas',
      'chalatenango',
      'cuscatlan',
      'la-libertad',
      'la-paz',
      'la-union',
      'morazan',
      'san-miguel',
      'san-salvador',
      'san-vicente',
      'santa-ana',
      'sonsonate',
      'usulutan',
    ];

    return departments.flatMap((dept) => [
      {
        source: `/tag/${dept}`,
        destination: `/${dept}`,
        permanent: true,
      },
      {
        source: `/tag/${dept}/:filter`,
        destination: `/${dept}/:filter`,
        permanent: true,
      },
    ]);
  },
};

export default nextConfig;
