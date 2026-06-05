/** @type {import('next').NextConfig} */
const nextConfig = {
  // Emit a self-contained server bundle (.next/standalone/server.js) so the
  // Docker runtime image can run `node server.js` without node_modules.
  output: 'standalone',
  reactStrictMode: true,
  experimental: {
    esmExternals: true,
  },
};

module.exports = nextConfig;
