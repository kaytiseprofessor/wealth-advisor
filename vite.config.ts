import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  // In Netlify, process.env is populated by the system, but loadEnv helps locally and specifically targets VITE_ prefixes usually,
  // but here we grab API_KEY specifically.
  // Fix: Cast process to any to access cwd() to avoid TS error 'Property cwd does not exist on type Process'
  const env = loadEnv(mode, (process as any).cwd(), '');
  
  return {
    plugins: [react()],
    define: {
      // Polyfill process.env.API_KEY so the Gemini SDK works as written
      // We use 'env.API_KEY' which comes from loadEnv (local .env) or system env (Netlify)
      'process.env.API_KEY': JSON.stringify(env.API_KEY)
    },
    server: {
      port: 3000
    },
    build: {
      sourcemap: false,
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['react', 'react-dom', 'recharts', 'lucide-react'],
            ai: ['@google/genai']
          }
        }
      }
    }
  };
});