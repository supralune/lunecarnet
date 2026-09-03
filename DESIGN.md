# Design Notes

Lunecarnet combines two content modes without turning them into two unrelated themes. The blog feels editorial; the academic profile feels indexed and evidence-led. They share the same underlying system.

## Principles

1. **Content before chrome.** The first viewport introduces the person or the writing, not generic interface controls.
2. **Quiet hierarchy.** Scale, spacing, fine rules, and color do most of the work. Cards and shadows are used sparingly.
3. **Legible density.** The layout should feel compact enough for serious material without becoming visually crowded.
4. **One accent, many roles.** Blue marks links, focus, active navigation, and informational guidance.
5. **Progressive disclosure.** Home pages show selected work; dedicated pages hold complete records.
6. **Accessible by default.** Keyboard focus, touch targets, reduced motion, semantic landmarks, and system theme preferences are part of the visual system.

## Core Tokens

The public design tokens live in `src/styles/tokens.css`. Consumer sites should override the namespaced `--lc-*` properties instead of editing `global.css`; the older short names remain compatibility aliases.

- `--lc-color-paper` and `--lc-color-surface` establish the reading environment.
- `--lc-color-ink`, `--lc-color-muted`, and `--lc-color-faint` create three text levels.
- `--lc-color-line` and `--lc-color-line-soft` organize information without heavy containers.
- `--lc-color-accent`, `--lc-color-accent-deep`, and `--lc-color-accent-pale` handle interaction and emphasis.
- `--lc-font-serif` is used for titles and long-form reading; `--lc-font-sans` supports navigation and metadata.
- `--lc-font-size-body`, `--lc-line-height-body`, `--lc-font-size-prose`, and `--lc-line-height-prose` control the two primary reading scales.
- `--lc-site-width`, `--lc-article-width`, `--lc-sidebar-width`, and `--lc-layout-gap` expose the primary layout proportions.
- `--lc-section-space`, `--lc-card-padding`, and `--lc-motion-duration` expose frequently customized rhythm and interaction values.

When extending the template, reuse these roles before adding colors or arbitrary component values.

Component and foundation rules are placed in the `lunecarnet` cascade layer. Consumer styles can remain unlayered and therefore override theme rules predictably; stable customization should still prefer the public tokens over internal class selectors.

## Layout Rules

- The maximum site width is 1140px.
- Primary pages use a flexible content column and a 260px contextual sidebar.
- Article text stays near 760px for readable line length.
- Below 980px, the sidebar moves below the content.
- Below 720px, navigation becomes an explicit disclosure menu with 44px targets.

## Template Guidance

Editing prompts are controlled by `showEditingGuides` in `src/config/shared.ts`. They are intentionally separate from demo content. Keep them enabled while customizing and disable them before publishing.
