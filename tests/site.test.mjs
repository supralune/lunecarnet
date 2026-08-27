import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

const dist = new URL("../dist/", import.meta.url);
const read = (path) => readFile(new URL(path, dist), "utf8");

function expectedPublicRoot() {
  const [ownerFromSlug, repository] = process.env.GITHUB_REPOSITORY?.split("/") ?? [];
  const owner = process.env.GITHUB_REPOSITORY_OWNER ?? ownerFromSlug;
  const projectPages = repository && owner && repository.toLowerCase() !== `${owner.toLowerCase()}.github.io`;
  const site = (process.env.SITE_URL?.trim() || (owner ? `https://${owner}.github.io` : "https://example.github.io")).replace(/\/$/, "");
  const configuredBase = process.env.SITE_BASE?.trim();
  const inferredBase = process.env.GITHUB_ACTIONS === "true" && projectPages ? `/${repository}` : "";
  const base = configuredBase
    ? configuredBase === "/" ? "" : `/${configuredBase.replace(/^\/+|\/+$/g, "")}`
    : inferredBase;
  return `${site}${base}`;
}

test("builds every primary template route", async () => {
  const routes = [
    "index.html",
    "blog/index.html",
    "blog/archive/index.html",
    "blog/categories/index.html",
    "blog/search/index.html",
    "blog/about/index.html",
    "academic/index.html",
    "academic/publications/index.html",
    "academic/projects/index.html",
    "academic/about/index.html",
    "404.html"
  ];
  await Promise.all(routes.map((route) => access(new URL(route, dist))));
});

test("renders accessible navigation and discovery metadata", async () => {
  const blog = await read("blog/index.html");
  assert.match(blog, /aria-label="Primary navigation"/);
  assert.match(blog, /data-nav-toggle/);
  assert.match(blog, /aria-current="page"/);
  assert.match(blog, /rel="canonical"/);
  assert.match(blog, /application\/rss\+xml/);
  assert.doesNotMatch(blog, /href="#"/);
});

test("uses the deployment origin and base path in public URLs", async () => {
  const root = expectedPublicRoot();
  const blog = await read("blog/index.html");
  assert.ok(blog.includes(`rel="canonical" href="${root}/blog/"`));
  assert.ok((await read("sitemap.xml")).includes(`<loc>${root}/blog/</loc>`));
  assert.ok((await read("robots.txt")).includes(`Sitemap: ${root}/sitemap.xml`));
});

test("renders local search and article reading aids", async () => {
  const search = await read("blog/search/index.html");
  assert.match(search, /id="note-search"/);
  assert.match(search, /id="search-index"/);
  assert.match(search, /Designing a Calm Digital Garden/);

  const article = await read("posts/designing-a-calm-digital-garden/index.html");
  assert.match(article, /class="toc"/);
  assert.match(article, /class="post-navigation"/);
  assert.match(article, /property="og:type" content="article"/);
});

test("exports RSS, sitemap, and robots discovery files", async () => {
  assert.match(await read("rss.xml"), /<rss version="2.0">/);
  assert.match(await read("sitemap.xml"), /<urlset/);
  assert.match(await read("robots.txt"), /Sitemap:/);
});
