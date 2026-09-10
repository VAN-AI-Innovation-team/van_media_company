import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { ARTICLE_BACKEND_ORIGIN } from './src/articles.js'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const proxy = {
    '/api/articles': {
      target: env.ARTICLE_API_ORIGIN || ARTICLE_BACKEND_ORIGIN,
      changeOrigin: true,
      proxyTimeout: 65000,
    },
  }
  return { plugins: [react()], server: { proxy }, preview: { proxy } }
})

