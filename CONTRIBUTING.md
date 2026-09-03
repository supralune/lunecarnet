# Contributing to Lunecarnet

Thank you for helping improve the template. Contributions should preserve its core character: content-first, quiet, accessible, static, and easy to customize.

## Before You Start

- Open an issue for changes that alter the information architecture, visual language, dependencies, or public configuration API.
- Keep new dependencies exceptional. Lunecarnet should remain a small static Astro site with minimal client-side JavaScript.
- Do not add personal data, proprietary assets, remote font requirements, analytics, or tracking by default.

## Local Checks

```bash
npm ci
npm test
```

The test command checks and builds the standalone blog, standalone academic, and combined modes, then verifies each mode's route and discovery-file contract.

## Pull Requests

1. Keep the change focused.
2. Update `README.md` when configuration or behavior changes.
3. Add or update tests for new routes and generated files.
4. Check light and dark themes, keyboard focus, and narrow layouts when changing UI.
5. Explain the user problem and the tradeoff behind the solution.

## Content and Accessibility

- Maintain one page-level heading (`h1`) per page.
- Use semantic links for navigation and buttons only for actions.
- Preserve visible focus states and minimum 44px touch targets on mobile.
- Respect `prefers-reduced-motion` and avoid decorative animation that competes with reading.
- Provide meaningful alternative text for any images contributors add.
