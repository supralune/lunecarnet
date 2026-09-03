import type { APIRoute } from "astro";
import { siteMode, templatePath } from "@/config/runtime";
import { absoluteSiteUrl, escapeXml } from "@/lib/discovery";
import { getPublishedPosts, postPath } from "@/lib/posts";

const blogRoutes = ["/", "/archive/", "/categories/", "/search/", "/about/"]
  .map((path) => templatePath("blog", path));
const academicRoutes = ["/", "/publications/", "/projects/", "/about/"]
  .map((path) => templatePath("academic", path));

const staticRoutes = siteMode === "blog"
  ? blogRoutes
  : siteMode === "academic"
    ? academicRoutes
    : ["/", ...blogRoutes, ...academicRoutes];

export const GET: APIRoute = async ({ site, url }) => {
  const posts = siteMode === "academic" ? [] : await getPublishedPosts();
  const entries: Array<{ path: string; lastmod?: string }> = [
    ...staticRoutes.map((path) => ({ path })),
    ...posts.map((post) => ({ path: postPath(post), lastmod: post.data.publishDate.toISOString() }))
  ];
  const urls = entries.map((entry) => `<url><loc>${escapeXml(absoluteSiteUrl(entry.path, site, url.origin))}</loc>${entry.lastmod ? `<lastmod>${entry.lastmod}</lastmod>` : ""}</url>`).join("\n  ");
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${urls}
</urlset>`;
  return new Response(xml, { headers: { "Content-Type": "application/xml; charset=utf-8" } });
};
