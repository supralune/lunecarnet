import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { postSchema } from "@lunecarnet/astro/content";

const posts = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/posts" }),
  schema: postSchema
});

export const collections = { posts };
