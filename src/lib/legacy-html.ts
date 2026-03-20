import fs from 'node:fs/promises';
import path from 'node:path';

export interface LegacyHtmlPage {
  title: string;
  description: string;
  bodyClass: string;
  bodyHtml: string;
  inlineStyles: string[];
}

function decodeEntities(value: string) {
  return value
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>');
}

function matchFirst(pattern: RegExp, input: string) {
  const match = input.match(pattern);
  return match?.[1]?.trim() || '';
}

function stripScripts(html: string) {
  return html.replace(/<script[\s\S]*?<\/script>/gi, '').trim();
}

export async function readLegacyHtmlPage(sourceFile: string): Promise<LegacyHtmlPage> {
  const filePath = path.resolve(process.cwd(), sourceFile);
  const html = await fs.readFile(filePath, 'utf8');

  const title = decodeEntities(matchFirst(/<title>([\s\S]*?)<\/title>/i, html));
  const description = decodeEntities(
    matchFirst(/<meta\s+name="description"\s+content="([\s\S]*?)"\s*\/?>/i, html),
  );
  const bodyTag = html.match(/<body([^>]*)>([\s\S]*?)<\/body>/i);
  const bodyClass = decodeEntities(matchFirst(/class="([^"]*)"/i, bodyTag?.[1] || ''));
  const bodyHtml = stripScripts(bodyTag?.[2] || '');
  const inlineStyles = [...html.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/gi)]
    .map((match) => match[1]?.trim())
    .filter(Boolean) as string[];

  return {
    title,
    description,
    bodyClass,
    bodyHtml,
    inlineStyles,
  };
}
