import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

const site = process.env.SITE_URL || undefined;

function rewriteHtmlRoutesForDev() {
  return {
    name: 'rewrite-html-routes-for-dev',
    configureServer(server) {
      server.middlewares.use((req, _res, next) => {
        if (!req.url) {
          return next();
        }

        const [pathname, search] = req.url.split('?');

        if (!pathname.endsWith('.html')) {
          return next();
        }

        const rewrittenPath = pathname === '/index.html' ? '/' : pathname.replace(/\.html$/, '');
        req.url = search ? `${rewrittenPath}?${search}` : rewrittenPath;
        next();
      });
    },
  };
}

export default defineConfig({
  site,
  output: 'static',
  build: {
    format: 'file',
  },
  vite: {
    plugins: [rewriteHtmlRoutesForDev(), tailwindcss()],
  },
  integrations: [
    mdx(),
    ...(site ? [sitemap()] : []),
  ],
});
