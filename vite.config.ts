import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import viteTsconfigPaths from 'vite-tsconfig-paths'

// https://vite.dev/config/
export default defineConfig({
  root: 'public',
  publicDir: false, // Disable default public dir since we're using public as root
  plugins: [
    react(),
    viteTsconfigPaths(),
  ],
  server: {
    port: 3000,
    open: true,
  },
  build: {
    outDir: '../build',
    emptyOutDir: true,
    sourcemap: true,
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: '../src/setupTests.ts',
    include: ['../src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
  },
})
