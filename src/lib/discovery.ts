import { templatePath } from "../config/runtime";
import type { BlogConfig, BlogPaginationConfig } from "../types";
import {
  archiveYearPath,
  blogPagePath,
  categoryPath,
  defaultBlogPagination,
  getArchiveGroups,
  getCategorySummaries,
  positivePageSize,
  postModifiedDate,
  postPath,
  type Post
} from "./posts";

export function escapeXml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

export function absoluteSiteUrl(path: string, site: URL | undefined, fallbackOrigin: string) {
  const base = import.meta.env.BASE_URL.replace(/\/$/, "");
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return new URL(`${base}${normalizedPath}`, site ?? fallbackOrigin).toString();
}

export type SitemapEntry = { path: string; lastmod?: string };

export function getBlogSitemapEntries(posts: readonly Post[], pagination: BlogPaginationConfig = {}): SitemapEntry[] {
  const postsPerPage = positivePageSize(pagination.postsPerPage, defaultBlogPagination.postsPerPage);
  const categoryPostsPerPage = positivePageSize(pagination.categoryPostsPerPage, defaultBlogPagination.categoryPostsPerPage);
  const entries: SitemapEntry[] = [
    { path: templatePath("blog") },
    { path: templatePath("blog", "/archive/") },
    { path: templatePath("blog", "/categories/") },
    { path: templatePath("blog", "/search/") },
    { path: templatePath("blog", "/about/") }
  ];

  const totalPages = Math.ceil(posts.length / postsPerPage);
  for (let page = 2; page <= totalPages; page += 1) entries.push({ path: blogPagePath(page) });
  getArchiveGroups(posts).forEach(([year]) => entries.push({ path: archiveYearPath(year) }));
  getCategorySummaries(posts).forEach((category) => {
    const categoryPages = Math.ceil(category.posts.length / categoryPostsPerPage);
    for (let page = 1; page <= categoryPages; page += 1) entries.push({ path: categoryPath(category.name, page) });
  });
  posts.forEach((post) => entries.push({ path: postPath(post), lastmod: postModifiedDate(post).toISOString() }));
  return entries;
}

export function createBlogRssResponse(options: {
  posts: readonly Post[];
  blog: BlogConfig;
  site: URL | undefined;
  fallbackOrigin: string;
}) {
  const { posts, blog, site, fallbackOrigin } = options;
  const homeUrl = absoluteSiteUrl(templatePath("blog"), site, fallbackOrigin);
  const items = posts.map((post) => {
    const link = absoluteSiteUrl(postPath(post), site, fallbackOrigin);
    return `<item>
      <title>${escapeXml(post.data.title)}</title>
      <link>${link}</link>
      <guid>${link}</guid>
      <pubDate>${post.data.publishDate.toUTCString()}</pubDate>
      <category>${escapeXml(post.data.category)}</category>
      <description>${escapeXml(post.data.description)}</description>
    </item>`;
  }).join("\n");
  const xml = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0">
  <channel>
    <title>${escapeXml(blog.title)}</title>
    <link>${homeUrl}</link>
    <description>${escapeXml(blog.description)}</description>
    <language>${blog.language}</language>
    ${items}
  </channel>
</rss>`;
  return new Response(xml, { headers: { "Content-Type": "application/rss+xml; charset=utf-8" } });
}

export function createSitemapResponse(options: {
  entries: readonly SitemapEntry[];
  site: URL | undefined;
  fallbackOrigin: string;
}) {
  const urls = options.entries.map((entry) => {
    const location = escapeXml(absoluteSiteUrl(entry.path, options.site, options.fallbackOrigin));
    return `<url><loc>${location}</loc>${entry.lastmod ? `<lastmod>${escapeXml(entry.lastmod)}</lastmod>` : ""}</url>`;
  }).join("\n  ");
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${urls}
</urlset>`;
  return new Response(xml, { headers: { "Content-Type": "application/xml; charset=utf-8" } });
}

export function createBlogSitemapResponse(options: {
  posts: readonly Post[];
  pagination?: BlogPaginationConfig;
  site: URL | undefined;
  fallbackOrigin: string;
}) {
  return createSitemapResponse({
    entries: getBlogSitemapEntries(options.posts, options.pagination),
    site: options.site,
    fallbackOrigin: options.fallbackOrigin
  });
}
