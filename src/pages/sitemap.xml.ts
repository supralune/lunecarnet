import type { APIRoute } from "astro";
import { siteMode, templatePath } from "@/config/runtime";
import { blogTemplate } from "@/config/site";
import { absoluteSiteUrl, escapeXml, getBlogSitemapEntries } from "@/lib/discovery";
import { getPublishedPosts } from "@/lib/posts";

const academicRoutes = ["/", "/publications/", "/projects/", "/about/"]
  .map((path) => templatePath("academic", path));

export const GET: APIRoute = async ({ site, url }) => {
  const posts = siteMode === "academic" ? [] : await getPublishedPosts();
  const entries: Array<{ path: string; lastmod?: string }> = [
    ...(siteMode === "both" ? [{ path: "/" }] : []),
    ...(siteMode === "academic" ? [] : getBlogSitemapEntries(posts, blogTemplate.pagination)),
    ...(siteMode === "blog" ? [] : academicRoutes.map((path) => ({ path })))
  ];
  const urls = entries.map((entry) => `<url><loc>${escapeXml(absoluteSiteUrl(entry.path, site, url.origin))}</loc>${entry.lastmod ? `<lastmod>${entry.lastmod}</lastmod>` : ""}</url>`).join("\n  ");
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${urls}
</urlset>`;
  return new Response(xml, { headers: { "Content-Type": "application/xml; charset=utf-8" } });
};
