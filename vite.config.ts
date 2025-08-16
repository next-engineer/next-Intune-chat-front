import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 8080,
    host: true
  },
  build: {
    outDir: 'dist',
    sourcemap: false, // 프로덕션에서는 소스맵 비활성화
    minify: 'terser', // 더 나은 압축을 위해 terser 사용
    terserOptions: {
      compress: {
        drop_console: true, // console.log 제거
        drop_debugger: true, // debugger 제거
      },
    },
    rollupOptions: {
      output: {
        // 청크 분할 최적화
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          utils: ['axios', 'zod'],
          websocket: ['ws'],
        },
        // 청크 파일명 최적화
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: 'assets/[ext]/[name]-[hash].[ext]',
      },
    },
    // 청크 크기 경고 임계값 설정
    chunkSizeWarningLimit: 1000,
  },
  preview: {
    port: 8080,
    host: true,
    allowedHosts: [
      '43.201.29.38',
      'ec2-43-201-29-38.ap-northeast-2.compute.amazonaws.com',
      'intune-elb-01-1312052410.ap-northeast-2.elb.amazonaws.com'
    ]
  },
  // 의존성 최적화
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom'],
  },
}) 