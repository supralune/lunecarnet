import type { APIRoute } from "astro";
import { createBlogRssResponse, getPublishedPosts } from "@lunecarnet/astro";
import siteConfig from "../config";

export const GET: APIRoute = async ({ site, url }) => createBlogRssResponse({
  posts: await getPublishedPosts(),
  blog: siteConfig.blog,
  site,
  fallbackOrigin: url.origin
});
