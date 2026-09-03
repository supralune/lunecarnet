# Lunecarnet

**English** | [简体中文](./README.zh-CN.md)

An Astro template that combines a personal blog and an academic homepage in one repository. Its visual language blends an editorial blog with a restrained academic profile: warm paper tones, serif headings, fine rules, a low-saturation blue accent, and a comfortable reading density.

The template contains no personal information or branding from the reference projects. Its academic sections use discipline-neutral placeholders, and the built-in editing guides explain where to replace them. The repository is ready to use as a GitHub Template Repository.

## Preview

The screenshots show the light theme with the optional editing guides enabled.

### Blog home

![Lunecarnet blog home page in the light theme](./docs/screenshots/blog-home.jpeg)

### Academic home

![Lunecarnet academic home page in the light theme](./docs/screenshots/academic-home.jpeg)

## Highlights

- Blog, academic, and combined-preview modes with one dependency set and design foundation
- Clean root-level routes in standalone modes and automatic namespaces in combined mode
- Markdown notes with article metadata, table of contents, tags, and adjacent navigation
- Automatic archive and category pages
- Private, browser-local full-text search with no external service
- RSS, Sitemap, robots discovery, canonical URLs, and article metadata
- Light and dark themes with persistent preference and correct browser theme color
- Keyboard navigation, visible focus, reduced-motion support, semantic landmarks, and mobile touch targets
- Optional manual GitHub Pages deployment, pull-request quality checks, and route-level tests
- No analytics, remote font requests, database, or client framework runtime

## Three Ways to Use It

- `blog` — The blog lives at `/`, with root-level archive, category, search, post, and RSS routes. Academic pages are not built.
- `academic` — The academic profile lives at `/`, with root-level Publications, Projects, and About routes. Blog pages and RSS are not built.
- `both` — `/` becomes a template chooser. The complete templates live under `/blog/` and `/academic/`, including blog posts and RSS.

There is only one implementation of each template. Complete home, archive, category, search, About, publication, and project page views are exported components. `sites/blog/`, `sites/academic/`, and consumer sites keep only thin route entrypoints, so page and style improvements are not duplicated.

The repository also exposes an `@lunecarnet/astro` package entrypoint. A separate personal site can depend directly on a versioned GitHub tag, receive upstream component and style updates, and keep its identity, content, and small token overrides locally. See the [Chinese dependency guide](./docs/DEPENDENCY_USAGE.zh-CN.md) for the complete setup.

## Getting Started

Node.js 22 or later is required.

```bash
npm ci
npm run dev:blog
npm run dev:academic
npm run dev:both      # also the default for npm run dev
```

Build the static site with:

```bash
npm run build:blog
npm run build:academic
npm run build:both    # also the default for npm run build
```

The generated files are written to `dist/`.

Run the full quality suite with:

```bash
npm test
```

This checks and builds all three modes, then verifies route isolation, search, article reading aids, RSS, Sitemap, and robots output for each contract.

## Five-Minute Setup

1. Create a repository from this template and clone it.
2. Update identity and editing-guide settings in `src/config/shared.ts`.
3. Customize the enabled templates in `src/config/blog.ts` and `src/config/academic.ts`.
4. If you use the blog, replace the example notes in `src/content/posts/`.
5. Add publication, project, profile, and CV URLs where available.
6. Set `showEditingGuides` to `false` when customization is complete.
7. Choose the corresponding `dev:*` and `build:*` command; set `SITE_MODE` for deployment.
8. Configure `SITE_URL` and `SITE_BASE` if you use a custom domain or subpath.
9. Run `npm test`, then push to GitHub.

## Customization

Most changes happen in focused configuration files:

1. `src/config/shared.ts` contains identity information and the editing-guide switch.
2. `src/config/blog.ts` contains blog copy and navigation.
3. `src/config/academic.ts` contains the academic profile, publications, projects, news, education, honors, and service.
4. `src/config/site.ts` combines consumer-owned data into type-safe props for the reusable package components.
5. `src/config/runtime.ts` resolves paths for the three build modes and normally does not need editing.
6. `src/content/posts/`
   - Remove the three example notes and create Markdown files with the same frontmatter structure.

The original `src/data/site.ts` remains as a compatibility barrel. New code should import from the focused config files.

Setting `blog.language` or `academic.language` to `zh-CN` enables the bundled Chinese interface. Individual interface strings can be overridden through the typed `messages` field without copying components.

Example note:

```md
---
title: "Your Note Title"
description: "A short summary used on listing pages"
publishDate: 2026-08-27
category: "Category Name"
tags: ["Astro", "Writing"]
draft: false
featured: false
readingTime: 5
---

Start the article here. Section headings should normally begin at `##`.
```

Publication authors use structured records so the template can mark roles consistently:

```ts
authors: [
  { name: "Your Name", self: true },
  { name: "Coauthor One" },
  { name: "Coauthor Two", corresponding: true }
]
```

`self: true` underlines the profile owner's name. `corresponding: true` appends `*` to a corresponding author. Both flags can be used on the same person.

Colors, typography, spacing, and responsive rules are centralized in `src/styles/global.css`. Stable downstream overrides use the public `--lc-*` properties in `src/styles/tokens.css`; theme internals use only namespaced properties, while the original short names remain as compatibility aliases. The template uses system fonts, makes no third-party font requests, and has no required image assets. The rationale behind the design system is documented in [`DESIGN.md`](./DESIGN.md).

Editing prompts are separate from the general placeholder content. Keep `showEditingGuides` enabled while customizing, then disable it before publication. Empty publication and project URLs never produce broken `#` links.

The blog follows a common open-source-template pattern: readable demo copy is stored in configuration, while customization instructions live in the optional editing guides. If you remove all example notes, the home page, archive, and category page show purposeful empty states instead of blank sections.

## Content Discovery

- The blog feed is `/rss.xml` in blog mode and `/blog/rss.xml` in combined mode.
- `/sitemap.xml` contains only the routes enabled by the selected build mode.
- `/robots.txt` points crawlers to the generated Sitemap.
- The search page embeds a small static index and searches entirely in the browser.
- Canonical and Open Graph metadata are generated by the shared layout; article pages also expose their publication date.

The template intentionally omits a generic social-preview image. Add a site-specific `public/og.png` only after replacing the demo identity and copy, then reference it from `src/layouts/BaseLayout.astro`.

## GitHub Pages

The repository includes `.github/workflows/pages.yml`, but deployment is manual by default so a newly created template repository does not publish example content automatically. To deploy, choose **GitHub Actions** under **Settings → Pages → Build and deployment**, then open **Actions → Deploy to GitHub Pages → Run workflow**.

If you later want every change on `main` to publish automatically, add a `push` trigger for the `main` branch to that workflow. The separate quality workflow continues to test pushes and pull requests without publishing the site.

The workflow automatically derives the correct public origin and path for both common URL formats:

- User site: `username.github.io`
- Project site: `username.github.io/repository-name`

No URL configuration is required for those standard GitHub Pages addresses. For a custom domain, add these repository variables under **Settings → Secrets and variables → Actions → Variables**:

- `SITE_URL`: the public origin, such as `https://www.example.com`
- `SITE_BASE`: `/` for a root-level custom domain, or a path such as `/notes` when the site is served below a subpath
- `SITE_MODE`: `blog`, `academic`, or `both`; the workflow defaults to `both`

The workflow passes these variables to Astro. This keeps the build mode, navigation, canonical URLs, RSS, Sitemap, and robots metadata aligned with the deployed address.

## Project Structure

```text
sites/blog/           Standalone blog route entrypoints
sites/academic/       Standalone academic route entrypoints
scripts/              Cross-platform mode runner and test orchestration
src/config/           Shared, blog, academic, and runtime configuration
src/index.ts          Public component and utility entrypoint for Git/npm installs
src/types.ts          Public TypeScript types for consumer-owned configuration
src/components/       Shared and template-specific components
src/content/posts/    Markdown blog notes
src/data/site.ts      Compatibility exports for the old config entrypoint
src/layouts/          Base HTML/SEO and template page shells
src/pages/            Combined routes and reusable page implementations
src/styles/           Shared design system and responsive styles
.github/workflows/    Quality checks and optional GitHub Pages deployment
tests/                Build-contract tests for all three modes
```

## Contributing

Read [`CONTRIBUTING.md`](./CONTRIBUTING.md) before proposing changes. Pull requests run the same `npm test` suite used locally. Issue forms and a pull-request template are included under `.github/`.

## License

[MIT](./LICENSE)
