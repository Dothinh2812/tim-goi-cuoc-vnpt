import fs from 'node:fs/promises';
import path from 'node:path';

const rootDir = process.cwd();
const blogContentDir = path.join(rootDir, 'blog-content');
const outputDir = path.join(rootDir, 'src', 'content', 'blog');
const redirectsOutput = path.join(rootDir, 'src', 'data', 'root-blog-redirects.ts');
const vercelConfigOutput = path.join(rootDir, 'vercel.json');

function decodeEntities(value) {
  return value
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>');
}

function stripTags(value) {
  return decodeEntities(value.replace(/<[^>]+>/g, '').trim());
}

function yamlString(value) {
  return JSON.stringify(value ?? '');
}

function normalizeInternalLinks(html) {
  return html.replace(/(href|src)="([^"]+)"/g, (match, attr, value) => {
    if (
      value.startsWith('http://') ||
      value.startsWith('https://') ||
      value.startsWith('mailto:') ||
      value.startsWith('tel:') ||
      value.startsWith('#') ||
      value.startsWith('/')
    ) {
      return `${attr}="${value}"`;
    }

    if (value.startsWith('../')) {
      return `${attr}="/${value.slice(3)}"`;
    }

    return `${attr}="/${value}"`;
  });
}

function getFirstMatch(pattern, input) {
  return input.match(pattern)?.[1]?.trim() || '';
}

function parseBlogIndex(html) {
  const sections = [...html.matchAll(/<section class="mt-10">([\s\S]*?)<\/section>/g)];
  let order = 1;
  const entries = new Map();

  for (const sectionMatch of sections) {
    const sectionHtml = sectionMatch[1];
    const category = stripTags(getFirstMatch(/<h2[^>]*>([\s\S]*?)<\/h2>/i, sectionHtml));
    const articles = [
      ...sectionHtml.matchAll(
        /<article[\s\S]*?<p class="text-xs font-semibold text-secondary mb-2">([\s\S]*?)<\/p>[\s\S]*?<h3[^>]*>([\s\S]*?)<\/h3>[\s\S]*?<p class="text-darkText\/70 mb-4">([\s\S]*?)<\/p>[\s\S]*?<a href="([^"]+)"/g,
      ),
    ];

    for (const articleMatch of articles) {
      const weekLabel = stripTags(articleMatch[1]);
      const title = stripTags(articleMatch[2]);
      const excerpt = stripTags(articleMatch[3]);
      const href = articleMatch[4];
      const slug = href.replace(/^blog-content\//, '').replace(/\.html$/, '');

      entries.set(slug, {
        slug,
        category,
        weekLabel,
        title,
        excerpt,
        order,
      });

      order += 1;
    }
  }

  return entries;
}

function parseArticleJsonLd(html) {
  const scripts = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)];
  for (const match of scripts) {
    try {
      const parsed = JSON.parse(match[1]);
      if (parsed['@type'] === 'Article') {
        return parsed;
      }
    } catch {
      // Ignore malformed blocks and keep scanning.
    }
  }

  return null;
}

const blogIndexHtml = await fs.readFile(path.join(rootDir, 'blog.html'), 'utf8');
const blogIndexMap = parseBlogIndex(blogIndexHtml);
const blogFiles = (await fs.readdir(blogContentDir)).filter((file) => file.endsWith('.html')).sort();

await fs.mkdir(outputDir, { recursive: true });
await fs.mkdir(path.dirname(redirectsOutput), { recursive: true });

const redirects = {};

for (const fileName of blogFiles) {
  const sourcePath = path.join(blogContentDir, fileName);
  const html = await fs.readFile(sourcePath, 'utf8');
  const slug = fileName.replace(/\.html$/, '');
  const listMeta = blogIndexMap.get(slug);

  if (!listMeta) {
    continue;
  }

  const description = decodeEntities(
    getFirstMatch(/<meta\s+name="description"\s+content="([\s\S]*?)"\s*\/?>/i, html),
  );
  const keywords = decodeEntities(
    getFirstMatch(/<meta\s+name="keywords"\s+content="([\s\S]*?)"\s*\/?>/i, html),
  )
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
  const articleJson = parseArticleJsonLd(html);
  const articleInnerHtml = getFirstMatch(/<article[^>]*>([\s\S]*?)<\/article>/i, html)
    .replace(/<h1[^>]*>[\s\S]*?<\/h1>/i, '')
    .trim();

  const mdxSource = `---
slug: ${yamlString(slug)}
title: ${yamlString(listMeta.title)}
description: ${yamlString(description)}
category: ${yamlString(listMeta.category)}
weekLabel: ${yamlString(listMeta.weekLabel)}
pubDate: ${yamlString(articleJson?.datePublished || '')}
updatedDate: ${yamlString(articleJson?.dateModified || articleJson?.datePublished || '')}
keywords:
${keywords.map((keyword) => `  - ${yamlString(keyword)}`).join('\n') || '  []'}
excerpt: ${yamlString(listMeta.excerpt)}
order: ${listMeta.order}
---

${normalizeInternalLinks(articleInnerHtml)}
`;

  await fs.writeFile(path.join(outputDir, `${slug}.mdx`), mdxSource);
  redirects[slug] = `/blog-content/${slug}.html`;
}

const redirectsModule = `export const ROOT_BLOG_REDIRECTS = ${JSON.stringify(redirects, null, 2)} as const;
`;

const vercelConfig = {
  $schema: 'https://openapi.vercel.sh/vercel.json',
  redirects: Object.entries(redirects).map(([slug, destination]) => ({
    source: `/${slug}.html`,
    destination,
    permanent: true,
  })),
};

await fs.writeFile(redirectsOutput, redirectsModule);
await fs.writeFile(vercelConfigOutput, JSON.stringify(vercelConfig, null, 2));
