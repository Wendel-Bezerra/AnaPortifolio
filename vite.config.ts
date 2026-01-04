import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import dotenv from 'dotenv'

// https://vitejs.dev/config/
export default defineConfig({
  // Permite que as funções locais (middleware) leiam variáveis do .env em modo dev
  // (útil para RESEND_API_KEY, RESEND_FROM_EMAIL, etc.)
  // Observação: no browser, continue usando apenas VITE_*.
  // Aqui é apenas Node (dev server).
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  plugins: [
    react(),
    {
      name: 'local-api-middleware',
      configureServer(server) {
        // Garante que o .env sobrescreva variáveis já existentes no ambiente (Windows/PowerShell),
        // evitando valores antigos/truncados durante o desenvolvimento local.
        dotenv.config({ override: true });

        server.middlewares.use(async (req, res, next) => {
          const url = req.url ? req.url.split('?')[0] : '';
          if (!url) return next();

          try {
            if (url === '/api/contact') {
              const mod = await import('./api/contact.js');
              return mod.default(req, res);
            }

            if (url === '/api/test-onboarding') {
              const mod = await import('./api/test-onboarding.js');
              return mod.default(req, res);
            }

            return next();
          } catch (err) {
            // Evita travar o dev server se houver erro na função
            console.error('Erro no middleware local /api:', err);
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json; charset=utf-8');
            res.end(JSON.stringify({ ok: false, error: 'Erro interno no modo desenvolvimento.' }));
          }
        });
      },
    },
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
