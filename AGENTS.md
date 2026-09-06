# Lunecarnet maintenance contract

This repository is maintained primarily with AI coding agents. Preserve the following decisions unless the user explicitly changes the product scope.

## Fixed product scope

- Astro 7 static output, Node.js 22 or later.
- One built-in `posts` content collection.
- Exactly three repository modes: `blog`, `academic`, and `both`.
- Consumer sites own identity, content, thin route files, and `--lc-*` token overrides.
- Do not introduce CMS adapters, client frameworks, databases, analytics, or generic plugin systems without a concrete user requirement.

## Architecture invariants

- Keep complete page implementations in `src/components/*Page.astro`.
- Keep consumer and mode-specific files in `src/pages/` and `sites/` thin. Move repeated route logic into exported helpers.
- `BlogShell.astro` and `AcademicShell.astro` are the single owners of the standard two-column header/sidebar/footer page chrome. Article pages may keep their intentionally different single-column shell.
- Reuse a component when a data-backed visual pattern appears in more than one page; do not componentize one-off markup.
- Configuration and Markdown are consumer-owned. Components must not import demo configuration from `src/config/`.
- Standard navigation comes from the theme. `blog.nav` and `academic.nav` are optional full overrides.
- Keep blog Markdown behavior in `createLunecarnetMarkdownProcessor()`. Consumer fixtures must use the exported processor so math and callout behavior matches the template.
- User-facing strings, alt text, and ARIA labels belong in `src/messages.ts`.
- Theme CSS uses `--lc-*` tokens and stays inside the `lunecarnet` cascade layer. Prefer adding a meaningful token over asking consumers to override internal selectors.

## Public usage surface

Prefer and document complete `*Page` components, `defineBlogConfig`, `defineAcademicConfig`, `postSchema`, route helpers, and `--lc-*` tokens. Lower-level components may remain available for advanced use, but do not expand the root export surface without a concrete consumer need.

## Change checklist

- Component or layout change: verify blog, academic, and both modes.
- Config/type change: update both packed consumer fixtures and dependency documentation.
- Route/content change: verify standalone and combined prefixes, RSS, Sitemap, and post navigation.
- Message change: provide both English and Simplified Chinese values.
- Style change: check light/dark, 980px/720px/500px breakpoints, focus visibility, and reduced motion.
- Before handoff, run `npm test`. Do not accept snapshots or fixtures that bypass the packed package artifact.
