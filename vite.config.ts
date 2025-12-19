import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { nodePolyfills } from 'vite-plugin-node-polyfills'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    nodePolyfills(),
  ],
  // --- 新增下面这段 server 配置 ---
  server: {
    host: '0.0.0.0',      // 允许所有 IP 访问
    port: 5173,           // 锁定端口为 5173
    strictPort: true,     // 如果端口被占用直接报错，不自动换端口
    cors: true,           // 允许跨域
    // 如果你的 Vite 版本较新，可能还需要加上这个：
    allowedHosts: ['.cpolar.top', 'localhost'] 
  }
})