import type { APIRoute } from "astro";
import { absoluteSiteUrl } from "@/lib/discovery";

export const GET: APIRoute = ({ site, url }) => {
  const body = `User-agent: *
Allow: /
Sitemap: ${absoluteSiteUrl("/sitemap.xml", site, url.origin)}
`;
  return new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
};
