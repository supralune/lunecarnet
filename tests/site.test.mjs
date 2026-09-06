import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

const mode = ["blog", "academic", "both"].includes(process.env.SITE_MODE)
  ? process.env.SITE_MODE
  : "both";
const dist = new URL("../dist/", import.meta.url);
const read = (path) => readFile(new URL(path, dist), "utf8");

const templateRoute = (template, path = "") => {
  const suffix = path ? `${path.replace(/^\/+|\/+$/g, "")}/` : "";
  return mode === "both" ? `${template}/${suffix}` : suffix;
};

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

test(`builds the ${mode} route contract`, async () => {
  const sharedRoutes = ["index.html", "404.html", "sitemap.xml", "robots.txt"];
  const blogRoutes = [
    `${templateRoute("blog")}index.html`,
    `${templateRoute("blog", "archive")}index.html`,
    `${templateRoute("blog", "categories")}index.html`,
    `${templateRoute("blog", "search")}index.html`,
    `${templateRoute("blog", "about")}index.html`,
    `${templateRoute("blog", "posts/designing-a-calm-digital-garden")}index.html`,
    mode === "both" ? "blog/rss.xml" : "rss.xml"
  ];
  const academicRoutes = [
    `${templateRoute("academic")}index.html`,
    `${templateRoute("academic", "publications")}index.html`,
    `${templateRoute("academic", "projects")}index.html`,
    `${templateRoute("academic", "about")}index.html`
  ];
  const routes = [
    ...sharedRoutes,
    ...(mode !== "academic" ? blogRoutes : []),
    ...(mode !== "blog" ? academicRoutes : [])
  ];
  await Promise.all(routes.map((route) => access(new URL(route, dist))));

  if (mode === "blog") await assert.rejects(access(new URL("publications/index.html", dist)));
  if (mode === "academic") await assert.rejects(access(new URL("rss.xml", dist)));
  if (mode === "both") {
    const index = await read("index.html");
    assert.match(index, /TEMPLATE COLLECTION/);
    assert.match(index, /href="[^"]*\/blog\/"/);
    assert.match(index, /href="[^"]*\/academic\/"/);
  }
});

test("renders template-aware navigation and metadata", async () => {
  const root = expectedPublicRoot();
  const template = mode === "academic" ? "academic" : "blog";
  const pagePath = templateRoute(template);
  const page = await read(`${pagePath}index.html`);
  assert.match(page, /aria-label="Primary navigation"/);
  assert.match(page, /data-nav-toggle/);
  assert.match(page, /aria-current="page"/);
  assert.match(page, /rel="canonical"/);
  assert.doesNotMatch(page, /href="#"/);

  const publicPath = mode === "both" ? `/${template}/` : "/";
  assert.ok(page.includes(`rel="canonical" href="${root}${publicPath}"`));

  if (mode === "academic") {
    assert.doesNotMatch(page, /application\/rss\+xml/);
    assert.doesNotMatch(page, /Template variant/);
  } else {
    assert.match(page, /application\/rss\+xml/);
    if (mode === "blog") assert.doesNotMatch(page, /Template variant/);
  }
});

test("exports a mode-specific sitemap and robots file", async () => {
  const root = expectedPublicRoot();
  const sitemap = await read("sitemap.xml");
  const robots = await read("robots.txt");
  assert.match(sitemap, /<urlset/);
  assert.ok(robots.includes(`Sitemap: ${root}/sitemap.xml`));

  if (mode === "blog") {
    assert.ok(sitemap.includes(`<loc>${root}/archive/</loc>`));
    assert.doesNotMatch(sitemap, /\/publications\//);
  } else if (mode === "academic") {
    assert.ok(sitemap.includes(`<loc>${root}/publications/</loc>`));
    assert.doesNotMatch(sitemap, /\/posts\//);
  } else {
    assert.ok(sitemap.includes(`<loc>${root}/blog/</loc>`));
    assert.ok(sitemap.includes(`<loc>${root}/academic/</loc>`));
  }
});

test("keeps blog-only discovery and reading features inside the blog template", { skip: mode === "academic" }, async () => {
  const search = await read(`${templateRoute("blog", "search")}index.html`);
  assert.match(search, /id="note-search"/);
  assert.match(search, /id="search-index"/);
  assert.match(search, /Designing a Calm Digital Garden/);

  const article = await read(`${templateRoute("blog", "posts/designing-a-calm-digital-garden")}index.html`);
  assert.match(article, /class="toc"/);
  assert.match(article, /class="post-navigation is-single"/);
  assert.match(article, /class="previous-note"/);
  assert.doesNotMatch(article, /class="next-note"/);
  assert.match(article, /property="og:type" content="article"/);

  const middleArticle = await read(`${templateRoute("blog", "posts/notes-that-remain-useful")}index.html`);
  assert.match(middleArticle, /class="post-navigation"/);
  assert.doesNotMatch(middleArticle, /class="post-navigation is-single"/);
  assert.match(middleArticle, /class="previous-note"/);
  assert.match(middleArticle, /class="next-note"/);

  const firstArticle = await read(`${templateRoute("blog", "posts/a-small-project-log")}index.html`);
  assert.match(firstArticle, /class="post-navigation is-single"/);
  assert.doesNotMatch(firstArticle, /class="previous-note"/);
  assert.match(firstArticle, /class="next-note"/);

  const rssPath = mode === "both" ? "blog/rss.xml" : "rss.xml";
  assert.match(await read(rssPath), /<rss version="2.0">/);
});

test("keeps unselected projects off the academic home page", { skip: mode === "blog" }, async () => {
  const home = await read(`${templateRoute("academic")}index.html`);
  const projects = await read(`${templateRoute("academic", "projects")}index.html`);
  assert.match(home, /Project or Research Initiative Title/);
  assert.doesNotMatch(home, /Second Project or Collaboration/);
  assert.match(projects, /Second Project or Collaboration/);
});
