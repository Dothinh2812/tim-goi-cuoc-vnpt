import { defineMiddleware } from 'astro:middleware';

function toRoutePath(pathname: string) {
  if (pathname === '/index.html') {
    return '/';
  }

  return pathname.replace(/\.html$/, '');
}

export const onRequest = defineMiddleware((context, next) => {
  const { pathname } = new URL(context.request.url);

  if (!pathname.endsWith('.html')) {
    return next();
  }

  return context.rewrite(toRoutePath(pathname));
});
