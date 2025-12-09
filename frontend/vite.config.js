import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [
    react({
      fastRefresh: true,
      babel: {
        plugins: [
          ['@babel/plugin-transform-react-jsx', { runtime: 'automatic' }]
        ]
      }
    })
  ],
  server: {
    host: '0.0.0.0',
    port: 5000,
    strictPort: true,
    watch: {
      usePolling: false,
      interval: 1000,
      ignored: ['**/node_modules/**', '**/dist/**', '**/logs/**']
    },
    allowedHosts: [
      '.replit.dev',
      '.repl.co',
      'localhost',
    ],
    hmr: {
      protocol: 'wss',
      host: undefined,
      port: 443,
      timeout: 30000,
      overlay: false,
      clientPort: 443,
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          mui: ['@mui/material', '@mui/icons-material'],
        },
      },
    },
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom'],
  },
});