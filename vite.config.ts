import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    // Enable code splitting
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor chunks
          'react-vendor': ['react', 'react-dom'],
          'form-vendor': ['react-hook-form', '@hookform/resolvers', 'zod'],
          'ui-vendor': ['@radix-ui/react-dialog', '@radix-ui/react-label', '@radix-ui/react-progress', '@radix-ui/react-select'],
          'i18n-vendor': ['react-i18next', 'i18next', 'i18next-browser-languagedetector'],
          
          // AI components (lazy loaded)
          'ai-components': [
            './src/components/organisms/AIAssistModal',
            './src/components/molecules/AIEnhancedTextarea',
            './src/hooks/useAIAssist/index.ts',
            './src/lib/api/ai-service',
            './src/lib/api/openai-service',
          ],
        },
      },
    },
    
    // Bundle size optimization
    target: 'esnext',
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
    
    // Source maps for debugging (only in dev)
    sourcemap: process.env.NODE_ENV === 'development',
    
    // Chunk size warnings
    chunkSizeWarningLimit: 1000, // 1MB warning
  },
  
  // Performance optimizations
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-hook-form',
      'zod',
      'react-i18next',
      'i18next',
    ],
    exclude: [
      // Exclude AI components from pre-bundling (they're lazy loaded)
      '@/lib/api/ai-service',
      '@/lib/api/openai-service',
    ],
  },
  
  // Development server configuration
  server: {
    // Enable HMR for better development experience
    hmr: true,
  },
  
  // Define environment variables
  define: {
    __BUILD_TIME__: JSON.stringify(new Date().toISOString()),
    __VERSION__: JSON.stringify(process.env.npm_package_version || '1.0.0'),
  },
})
