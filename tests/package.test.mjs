import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { access, cp, mkdir, mkdtemp, readFile, readdir, rm, symlink } from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";
import test from "node:test";

const root = new URL("../", import.meta.url);
const rootPath = fileURLToPath(root);
const run = promisify(execFile);
const manifest = JSON.parse(await readFile(new URL("package.json", root), "utf8"));

test("exposes a Git-installable Astro package contract", async () => {
  assert.equal(manifest.name, "@lunecarnet/astro");
  assert.equal(manifest.private, true);
  assert.equal(manifest.exports["."], "./src/index.ts");
  assert.equal(manifest.exports["./styles.css"], "./src/styles/global.css");
  assert.equal(manifest.exports["./tokens.css"], "./src/styles/tokens.css");
  assert.equal(manifest.exports["./content"], "./src/content.ts");
  assert.equal(manifest.exports["./markdown"], "./src/markdown.ts");
  assert.match(manifest.peerDependencies.astro, /^\^7/);

  await Promise.all(Object.values(manifest.exports)
    .filter((path) => !path.includes("*"))
    .map((path) => access(new URL(path.replace(/^\.\//, ""), root))));
});

test("keeps published source independent from the demo alias", async () => {
  const publishedDirectories = ["src/components", "src/layouts", "src/lib"];
  const files = [];

  for (const directory of publishedDirectories) {
    const entries = await readdir(new URL(`${directory}/`, root), { withFileTypes: true });
    files.push(...entries.filter((entry) => entry.isFile()).map((entry) => `${directory}/${entry.name}`));
  }

  files.push("src/index.ts", "src/types.ts", "src/messages.ts", "src/content.ts", "src/markdown.ts", "src/config/runtime.ts");
    const sources = await Promise.all(files.map((file) => readFile(new URL(file, root), "utf8")));
    sources.forEach((source, index) => assert.doesNotMatch(source, /from\s+["']@\//, `${files[index]} must not depend on the demo @ alias`));
    sources.forEach((source, index) => assert.doesNotMatch(source, /TemplateGuide|showEditingGuides/, `${files[index]} must not expose template editing guides`));
});

test("publishes stable design tokens", async () => {
  const tokens = await readFile(new URL("src/styles/tokens.css", root), "utf8");
  for (const token of ["--lc-color-accent", "--lc-font-serif", "--lc-font-size-prose", "--lc-site-width", "--lc-sidebar-width", "--lc-section-space"]) {
    assert.ok(tokens.includes(token), `missing public token ${token}`);
  }

  const globalStyles = await readFile(new URL("src/styles/global.css", root), "utf8");
  assert.match(globalStyles, /@layer lunecarnet/);
  assert.doesNotMatch(globalStyles, /var\(--(?:paper|surface|ink|muted|accent|line|serif|sans)\)/, "theme internals must use namespaced tokens");
});

test("exports complete page views so consumer routes stay thin", async () => {
  const entry = await readFile(new URL("src/index.ts", root), "utf8");
  const pageViews = [
    "BlogHomePage",
    "BlogArchivePage",
    "BlogArchiveYearPage",
    "BlogCategoryPage",
    "BlogCategoriesPage",
    "BlogPostPage",
    "BlogSearchPage",
    "BlogAboutPage",
    "NotFoundPage",
    "AcademicHomePage",
    "AcademicPublicationsPage",
    "AcademicProjectsPage",
    "AcademicAboutPage"
  ];
  pageViews.forEach((name) => assert.match(entry, new RegExp(`default as ${name}`), `missing page export ${name}`));

  const routeFiles = [
    "src/pages/blog/index.astro",
    "src/pages/blog/archive.astro",
    "src/pages/blog/archive/[year].astro",
    "src/pages/blog/categories.astro",
    "src/pages/blog/categories/[category]/[...page].astro",
    "src/pages/blog/page/[page].astro",
    "src/pages/blog/search.astro",
    "src/pages/blog/about.astro",
    "src/pages/academic/index.astro",
    "src/pages/academic/publications.astro",
    "src/pages/academic/projects.astro",
    "src/pages/academic/about.astro"
  ];
  const routes = await Promise.all(routeFiles.map((file) => readFile(new URL(file, root), "utf8")));
  routes.forEach((source, index) => {
    assert.ok(source.trim().split("\n").length <= 10, `${routeFiles[index]} should remain a thin consumer-style entry`);
  });
});

test("publishes shared content and localization contracts", async () => {
  const content = await readFile(new URL("src/content.ts", root), "utf8");
  const messages = await readFile(new URL("src/messages.ts", root), "utf8");
  assert.match(content, /export const postSchema/);
  assert.match(messages, /export function resolveMessages/);
  assert.match(messages, /zhCnMessages/);
  assert.ok(manifest.files.includes("src/content.ts"));
  assert.ok(manifest.files.includes("src/messages.ts"));
});

test("builds isolated blog and academic consumers from the packed artifact", { timeout: 60_000 }, async () => {
  const temporaryRoot = await mkdtemp(join(tmpdir(), "lunecarnet-consumer-"));
  const npm = process.platform === "win32" ? "npm.cmd" : "npm";

  try {
    const { stdout } = await run(npm, ["pack", rootPath, "--json", "--pack-destination", temporaryRoot], {
      cwd: temporaryRoot,
      env: { ...process.env, npm_config_cache: join(temporaryRoot, "npm-cache") }
    });
    const [{ filename }] = JSON.parse(stdout);
    const astroBin = join(rootPath, "node_modules", "astro", "bin", "astro.mjs");
    const consumerEnv = { ...process.env, SITE_MODE: "" };

    for (const fixture of ["consumer-blog", "consumer-academic"]) {
      const consumer = join(temporaryRoot, fixture);
      await cp(fileURLToPath(new URL(`fixtures/${fixture}/`, import.meta.url)), consumer, { recursive: true });
      await mkdir(join(consumer, "node_modules"), { recursive: true });
      for (const dependency of Object.keys(manifest.dependencies ?? {})) {
        const dependencyTarget = join(consumer, "node_modules", dependency);
        await mkdir(dirname(dependencyTarget), { recursive: true });
        await symlink(join(rootPath, "node_modules", dependency), dependencyTarget, process.platform === "win32" ? "junction" : "dir");
      }
      await run(npm, ["install", join(temporaryRoot, filename), "--ignore-scripts", "--offline", "--legacy-peer-deps", "--no-audit", "--no-fund"], {
        cwd: consumer,
        env: { ...process.env, npm_config_cache: join(temporaryRoot, "npm-cache") }
      });

      const astroTarget = join(consumer, "node_modules", "astro");
      await mkdir(dirname(astroTarget), { recursive: true });
      await symlink(join(rootPath, "node_modules", "astro"), astroTarget, process.platform === "win32" ? "junction" : "dir");
      await mkdir(join(consumer, "node_modules", "@astrojs"), { recursive: true });
      await symlink(join(rootPath, "node_modules", "@astrojs", "check"), join(consumer, "node_modules", "@astrojs", "check"), process.platform === "win32" ? "junction" : "dir");
      await symlink(join(rootPath, "node_modules", "typescript"), join(consumer, "node_modules", "typescript"), process.platform === "win32" ? "junction" : "dir");

      await run(process.execPath, [astroBin, "check"], { cwd: consumer, env: consumerEnv });
      await run(process.execPath, [astroBin, "build"], { cwd: consumer, env: consumerEnv });
    }

    const blog = await readFile(join(temporaryRoot, "consumer-blog", "dist", "index.html"), "utf8");
    const blogMain = blog.match(/<main\b[\s\S]*?<\/main>/)?.[0] ?? "";
    assert.match(blog, /独立博客/);
    assert.match(blog, /最新更新/);
    assert.match(blogMain, /第一篇文章/);
    assert.doesNotMatch(blogMain, /第二篇文章/);
    assert.match(blog, />归档</);
    assert.match(blog, />分类</);
    assert.match(blog, /--lc-color-accent: #7654a8/);
    assert.doesNotMatch(blog, /href="\/blog\/"/);

    const blogArchive = await readFile(join(temporaryRoot, "consumer-blog", "dist", "archive", "index.html"), "utf8");
    assert.match(blogArchive, /第一篇文章/);
    assert.match(blogArchive, /第二篇文章/);

    const blogPageTwo = await readFile(join(temporaryRoot, "consumer-blog", "dist", "page", "2", "index.html"), "utf8");
    const blogPageTwoMain = blogPageTwo.match(/<main\b[\s\S]*?<\/main>/)?.[0] ?? "";
    assert.match(blogPageTwoMain, /第二篇文章/);
    assert.doesNotMatch(blogPageTwoMain, /第一篇文章/);
    assert.match(blogPageTwo, /aria-label="文章分页"/);

    const categoryPageOne = await readFile(join(temporaryRoot, "consumer-blog", "dist", "categories", "测试", "index.html"), "utf8");
    const categoryPageTwo = await readFile(join(temporaryRoot, "consumer-blog", "dist", "categories", "测试", "page", "2", "index.html"), "utf8");
    assert.match(categoryPageOne.match(/<main\b[\s\S]*?<\/main>/)?.[0] ?? "", /第一篇文章/);
    assert.match(categoryPageTwo.match(/<main\b[\s\S]*?<\/main>/)?.[0] ?? "", /第二篇文章/);
    assert.match(await readFile(join(temporaryRoot, "consumer-blog", "dist", "archive", "2026", "index.html"), "utf8"), /第一篇文章/);
    assert.match(await readFile(join(temporaryRoot, "consumer-blog", "dist", "archive", "2025", "index.html"), "utf8"), /第二篇文章/);

    const blogPost = await readFile(join(temporaryRoot, "consumer-blog", "dist", "posts", "hello", "index.html"), "utf8");
    assert.match(blogPost, /class="katex"/);
    assert.match(blogPost, /<details class="callout callout-note"[^>]*open/);
    assert.match(blogPost, /<details class="callout callout-warning"(?![^>]*open)/);
    assert.match(blogPost, /data-callout="note"/);
    assert.match(blogPost, /class="callout-title-icon"/);
    assert.match(blogPost, /测试<strong>提示<\/strong>/);
    assert.match(blogPost, /Callout 正文支持 <strong>Markdown<\/strong>/);
    assert.match(blogPost, /class="toc-depth-1"/);
    assert.match(blogPost, /property="article:modified_time" content="2026-09-03/);
    assert.match(blogPost, /target="_blank"/);
    assert.match(blogPost, /rel="noopener noreferrer"/);
    assert.doesNotMatch(blogPost, /\[!note\]/);
    await access(join(temporaryRoot, "consumer-blog", "dist", "search", "index.html"));
    assert.match(await readFile(join(temporaryRoot, "consumer-blog", "dist", "rss.xml"), "utf8"), /<rss version="2.0">/);
    const consumerSitemap = await readFile(join(temporaryRoot, "consumer-blog", "dist", "sitemap.xml"), "utf8");
    assert.match(consumerSitemap, /\/page\/2\//);
    assert.match(consumerSitemap, /\/categories\/%E6%B5%8B%E8%AF%95\/page\/2\//);
    assert.match(consumerSitemap, /\/archive\/2025\//);
    assert.match(consumerSitemap, /<lastmod>2026-09-03/);
    assert.match(await readFile(join(temporaryRoot, "consumer-blog", "dist", "404.html"), "utf8"), /页面不存在/);
    const consumerAbout = await readFile(join(temporaryRoot, "consumer-blog", "dist", "about", "index.html"), "utf8");
    assert.match(consumerAbout, /消费者自有正文/);
    assert.doesNotMatch(consumerAbout, /记录和分享。/);

    const academicHome = await readFile(join(temporaryRoot, "consumer-academic", "dist", "index.html"), "utf8");
    assert.match(academicHome, /测试学者/);
    assert.match(academicHome, />论文</);
    assert.match(academicHome, />项目</);
    assert.doesNotMatch(academicHome, /id="(?:publications|projects|about|news)"/);
    assert.doesNotMatch(academicHome, /class="widget"><h2>概览/);
    assert.doesNotMatch(academicHome, /href="\/academic\/"/);

    const academicAbout = await readFile(join(temporaryRoot, "consumer-academic", "dist", "about", "index.html"), "utf8");
    assert.match(academicAbout, /第一段学术简介。/);
    assert.match(academicAbout, /第二段学术简介。/);
    assert.match(academicAbout, /研究兴趣/);
    assert.match(academicAbout, /可信知识系统/);
    assert.match(academicAbout, /研究可靠、透明且便于长期维护的知识工具。/);
    assert.doesNotMatch(academicAbout, />教育经历</);
    await access(join(temporaryRoot, "consumer-academic", "dist", "projects", "index.html"));
    await access(join(temporaryRoot, "consumer-academic", "dist", "publications", "index.html"));
  } finally {
    await rm(temporaryRoot, { recursive: true, force: true });
  }
});
