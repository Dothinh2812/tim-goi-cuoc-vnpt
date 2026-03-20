import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/blog' }),
  schema: z.object({
    slug: z.string(),
    title: z.string(),
    description: z.string(),
    category: z.string(),
    weekLabel: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date(),
    keywords: z.array(z.string()).default([]),
    excerpt: z.string(),
    order: z.number().int(),
  }),
});

export const collections = {
  blog,
};
