/* global process */
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const rawEnv = loadEnv(mode, process.cwd(), '')
  const configuredApiBaseUrl = String(rawEnv.VITE_API_BASE_URL || '').trim().replace(/\/+$/, '')
  const configuredProxyTarget = String(rawEnv.VITE_DEV_API_PROXY_TARGET || '').trim().replace(/\/+$/, '')
  const proxyTarget = configuredApiBaseUrl || configuredProxyTarget || 'http://localhost:5054'

  return {
    plugins: [react(), tailwindcss()],
    server: {
      proxy: {
        '/api': {
          target: proxyTarget,
          changeOrigin: true,
          secure: false,
        },
        '/hubs': {
          target: proxyTarget,
          changeOrigin: true,
          secure: false,
          ws: true,
        },
      },
    },
    test: {
      environment: 'node',
      setupFiles: './src/test/setupTests.js',
      css: true,
    },
  }
})
