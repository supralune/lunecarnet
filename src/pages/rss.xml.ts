import type { APIRoute } from "astro";
import { blog } from "@/data/site";
import { absoluteSiteUrl, escapeXml } from "@/lib/discovery";
import { getPublishedPosts, postPath } from "@/lib/posts";

export const GET: APIRoute = async ({ site, url }) => {
  const posts = await getPublishedPosts();
  const homeUrl = absoluteSiteUrl("/blog/", site, url.origin);
  const items = posts.map((post) => {
    const link = absoluteSiteUrl(postPath(post), site, url.origin);
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
};
