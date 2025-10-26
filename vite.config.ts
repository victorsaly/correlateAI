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
          manualChunks: {
            vendor: ['react', 'react-dom'],
            ui: ['@radix-ui/react-select', '@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu'],
            charts: ['recharts'],
            icons: ['@phosphor-icons/react']
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
    server: {
      // Development server configuration
      host: true,
      cors: true,
      // Force proper MIME types for modules
      fs: {
        strict: false
      },
      proxy: !isProduction ? {
        '/api/fred': {
          target: 'https://api.stlouisfed.org',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api\/fred/, '/fred'),
          secure: false,
          configure: (proxy, options) => {
            proxy.on('error', (err, req, res) => {
              console.log('proxy error', err);
            });
            proxy.on('proxyReq', (proxyReq, req, res) => {
              console.log('Sending Request to the Target:', req.method, req.url);
            });
            proxy.on('proxyRes', (proxyRes, req, res) => {
              console.log('Received Response from the Target:', proxyRes.statusCode, req.url);
            });
          },
          headers: {
            'User-Agent': 'Mozilla/5.0 (compatible; FRED-API-Client/1.0)'
          }
        },
        '/api/worldbank': {
          target: 'https://api.worldbank.org',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api\/worldbank/, ''),
          secure: false,
          configure: (proxy, options) => {
            proxy.on('error', (err, req, res) => {
              console.log('WorldBank proxy error', err);
            });
            proxy.on('proxyReq', (proxyReq, req, res) => {
              console.log('Sending WorldBank Request:', req.method, req.url);
            });
            proxy.on('proxyRes', (proxyRes, req, res) => {
              console.log('WorldBank Response:', proxyRes.statusCode, req.url);
            });
          },
          headers: {
            'User-Agent': 'Mozilla/5.0 (compatible; WorldBank-API-Client/1.0)'
          }
        }
      } : undefined
    }
  }
});
