/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  assetPrefix: process.env.BASE_PATH || '',
  basePath: process.env.BASE_PATH || '',
  trailingSlash: true,
  publicRuntimeConfig: {
    root: process.env.BASE_PATH || '',
  },
  optimizeFonts: false,
  // 開発モードの高速化
  swcMinify: true,
  // TypeScriptの型チェックを並列化（開発時のみ）
  typescript: {
    ignoreBuildErrors: false,
  },
  // ESLintのチェックをスキップ（開発時のみ）
  eslint: {
    ignoreDuringBuilds: false,
  },
  webpack: (config, { isServer, dev }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        canvas: false,
      }
    }
    // 開発モードでのビルド高速化
    if (dev) {
      config.optimization = {
        ...config.optimization,
        removeAvailableModules: false,
        removeEmptyChunks: false,
        splitChunks: false,
      }
      // webpackキャッシュを無効化（エラー回避のため）
      config.cache = false
    }
    return config
  },
}

module.exports = nextConfig
