import { z } from "astro/zod";

/** Stable schema shared by the theme demo and consumer-owned `posts` collections. */
export const postSchema = z.object({
  title: z.string().trim().min(1),
  description: z.string().trim().min(1),
  publishDate: z.coerce.date(),
  updatedDate: z.coerce.date().optional(),
  category: z.string().trim().min(1),
  tags: z.array(z.string()).default([]),
  draft: z.boolean().default(false),
  featured: z.boolean().default(false),
  readingTime: z.number().int().positive().default(5)
});
