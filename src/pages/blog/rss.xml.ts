import type { APIRoute } from "astro";
import { blog } from "@/config/blog";
import { createBlogRssResponse } from "@/lib/discovery";
import { getPublishedPosts } from "@/lib/posts";

export const GET: APIRoute = async ({ site, url }) => {
  const posts = await getPublishedPosts();
  return createBlogRssResponse({ posts, blog, site, fallbackOrigin: url.origin });
};
