import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vite";
import { resolve } from 'path'

const projectRoot = process.env.PROJECT_ROOT || import.meta.dirname

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const isProduction = mode === 'production'
  
  return {
    // Set base path for custom domain (root path) or GitHub Pages fallback
    base: isProduction ? '/' : '/',
    
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
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['react', 'react-dom'],
            ui: ['@radix-ui/react-select', '@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu'],
            charts: ['recharts'],
            icons: ['@phosphor-icons/react']
          }
        }
      }
    },
    server: {
      // Development server configuration (only used in dev mode)
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
