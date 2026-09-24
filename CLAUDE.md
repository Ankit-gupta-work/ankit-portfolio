# Ankit Gupta — Portfolio (Angular 18)

## Source of truth
`design/portfolio-reference.html` is the approved design. It is one self-contained HTML file
(CSS in `<head>`, a small script at the bottom). The Angular app must look and behave
**identically** to it — same text, spacing, colors, animations and hover effects.
When in doubt, open the reference file and copy from it; never invent new styling or copy.

## Stack
- Angular 18, standalone components only (no NgModules), signals for state
- Tailwind CSS for utilities only; all colors/borders/fonts come from CSS custom properties
- Static prerendering (SSG) — the site has no backend
- Fonts: Plus Jakarta Sans + JetBrains Mono (Google Fonts, preloaded)
- No animation libraries. CSS keyframes + scroll-driven animations; JS only where the reference uses it

## Rules
- Design tokens live in `src/styles/tokens.css` (`.pf` = dark default, `.pf.light` = light). Copy them verbatim from the reference.
- Global keyframes live in `src/styles/animations.css`. Component styles only hold that component's rules.
- All copy, links, projects and stack rows live in `src/app/data/portfolio.data.ts`. Components never hard-code content.
- Keep `prefers-reduced-motion` support exactly as in the reference.
- Accessibility: real `<a>`/`<button>`, `aria-label` on icon-only buttons, visible focus styles.
- Target Lighthouse ≥ 90 on all four categories.
- Don't add sections, features or dependencies that aren't in the reference without asking.

## Commands
- `npm start` — dev server
- `npm run build` — production build (prerendered)
- `npm run test:visual` — Playwright screenshots of the app vs the reference (see `e2e/`)
