import { withPayload } from '@payloadcms/next/withPayload'
import type { NextConfig } from 'next'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(__filename)

const nextConfig: NextConfig = {
  images: {
    localPatterns: [
      {
        pathname: '/api/media/file/**',
      },
      { pathname: '/logo.jpg' },
    ],
    // Vercel Blob'a doğrudan bağlanan görseller için.
    remotePatterns: [{ protocol: 'https', hostname: '*.public.blob.vercel-storage.com' }],
  },
  // Uygulama dosyaları doğrudan açılsa bile ayrı (opak) bir kökende çalışsın:
  // site çerezlerine, panele ve sayfanın geri kalanına erişemezler.
  async headers() {
    return [
      {
        source: '/uygulamalar/:path*',
        headers: [{ key: 'Content-Security-Policy', value: 'sandbox allow-scripts allow-popups' }],
      },
    ]
  },
  webpack: (webpackConfig) => {
    webpackConfig.resolve.extensionAlias = {
      '.cjs': ['.cts', '.cjs'],
      '.js': ['.ts', '.tsx', '.js', '.jsx'],
      '.mjs': ['.mts', '.mjs'],
    }

    return webpackConfig
  },
  turbopack: {
    root: path.resolve(dirname),
  },
}

export default withPayload(nextConfig, { devBundleServerPackages: false })
