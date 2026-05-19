import { defineCollection, z } from 'astro:content';

const posts = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    categories: z.array(z.string()).optional().default([]),
    tags: z.array(z.string()).optional().default([]),
    excerpt: z.string().optional(),
    description: z.string().optional(),
    last_modified_at: z.coerce.date().optional(),
  }),
});

export const collections = { posts };
