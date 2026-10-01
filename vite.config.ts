/// <reference types="vitest/config" />
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { resolve } from 'path'

const projectRoot = '.'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const isProduction = mode === 'production'
  
  return {
    // Set base path for custom domain (root path)
    base: isProduction ? '/' : '/',
    
    // Explicitly set publicDir to ensure all public assets are copied
    publicDir: 'public',
    
    plugins: [
      react(),
      tailwindcss(),
    ],
    // Strip console.* and debugger statements from production bundles only
    esbuild: isProduction ? { drop: ['console', 'debugger'] } : {},
    resolve: {
      alias: {
        '@': resolve(projectRoot, 'src')
      }
    },
    build: {
      // Optimize for production
      minify: true,
      sourcemap: false,
      target: 'esnext',
      rollupOptions: {
        output: {
          // React in its own long-cached chunk; Recharts (and the d3 modules it pulls in) stays lazy with the charts
          manualChunks(id) {
            // clsx is shared by the app and Recharts; without this it lands in the charts chunk and drags it into first load
            if (/node_modules\/(react|react-dom|scheduler|clsx|tailwind-merge)\//.test(id)) return 'vendor'
            // Rollup's CommonJS interop helper is shared by React and Recharts 3; if it lands in the charts chunk,
            // vendor and charts import each other and React initialises undefined ("reading 'forwardRef'")
            if (id.includes('commonjsHelpers')) return 'vendor'
            if (/node_modules\/(recharts|d3-|victory-vendor|recharts-scale)/.test(id)) return 'charts'
            if (/node_modules\/@radix-ui\//.test(id)) return 'ui'
          },
          // Ensure proper file extensions for GitHub Pages
          entryFileNames: 'assets/[name]-[hash].js',
          chunkFileNames: 'assets/[name]-[hash].js',
          assetFileNames: 'assets/[name]-[hash].[ext]'
        }
      },
      assetsDir: 'assets',
      // Ensure proper CSS and JS handling
      cssCodeSplit: true,
      emptyOutDir: true,
      // Better GitHub Pages compatibility
      assetsInlineLimit: 0
    },
    // unit tests live next to the code; tests/e2e is Playwright's
    test: { include: ['src/**/*.test.ts'] },
    server: {
      // localhost only; run `npm run dev -- --host` to test on a phone
      port: 5180,
      strictPort: true,
    },
  }
});
