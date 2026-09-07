import type { APIRoute } from "astro";
import { createBlogSitemapResponse, getPublishedPosts } from "@lunecarnet/astro";
import siteConfig from "../config";

export const GET: APIRoute = async ({ site, url }) => createBlogSitemapResponse({
  posts: await getPublishedPosts(),
  pagination: siteConfig.pagination,
  site,
  fallbackOrigin: url.origin
});
