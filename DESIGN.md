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

The design tokens live at the top of `src/styles/global.css`.

- `--paper` and `--surface` establish the warm reading environment.
- `--ink`, `--muted`, and `--faint` create three text levels.
- `--line` and `--line-soft` organize information without heavy containers.
- `--accent`, `--accent-deep`, and `--accent-pale` handle interaction and emphasis.
- `--serif` is used for titles and long-form reading; `--sans` supports navigation and metadata.

When extending the template, reuse these roles before adding colors or arbitrary component values.

## Layout Rules

- The maximum site width is 1140px.
- Primary pages use a flexible content column and a 260px contextual sidebar.
- Article text stays near 760px for readable line length.
- Below 980px, the sidebar moves below the content.
- Below 720px, navigation becomes an explicit disclosure menu with 44px targets.

## Template Guidance

Editing prompts are controlled by `showEditingGuides` in `src/data/site.ts`. They are intentionally separate from demo content. Keep them enabled while customizing and disable them before publishing.
