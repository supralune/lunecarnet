import { z } from "astro/zod";

/** Stable schema shared by the theme demo and consumer-owned `posts` collections. */
export const postSchema = z.object({
  title: z.string(),
  description: z.string(),
  publishDate: z.coerce.date(),
  category: z.string(),
  tags: z.array(z.string()).default([]),
  draft: z.boolean().default(false),
  featured: z.boolean().default(false),
  readingTime: z.number().int().positive().default(5)
});
