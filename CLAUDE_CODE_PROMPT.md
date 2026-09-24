# How to use this

1. Make an empty folder, e.g. `ankit-portfolio/`.
2. Put the files in it like this:
   ```
   ankit-portfolio/
   ├── CLAUDE.md
   └── design/
       └── portfolio-reference.html
   ```
3. Open `design/portfolio-reference.html` in Chrome once. That's exactly what you're building.
4. In a terminal in that folder, run `claude`, then paste the prompt below.

Before you start, replace the `[...]` placeholders in the prompt with your real links, or leave them and Claude Code will keep them as `#` placeholders.

---

# Prompt (copy everything below this line)

Build my developer portfolio as an Angular 18 app in this folder, matching `design/portfolio-reference.html` exactly. Read `CLAUDE.md` first and follow it. Then read the whole reference file before writing any code.

## Goal
A pixel-accurate Angular 18 port of the reference: same layout, copy, colors, both themes, every animation and hover effect. The reference is the source of truth. If the reference and this prompt disagree, follow the reference and tell me.

## Setup
- Scaffold with Angular CLI 18: standalone, SSR/prerender enabled (`--ssr`), CSS styles, no routing beyond the single home route.
- Add Tailwind CSS (utilities only; don't let Tailwind's preflight change the reference's typography, so check that headings, margins and buttons still match).
- Load Plus Jakarta Sans (400, 500, 600, italic 500/600) and JetBrains Mono (400, 500) from Google Fonts with `preconnect` and `display=swap`.

## Structure
```
src/
  styles/tokens.css        ← the .pf / .pf.light variables, copied verbatim
  styles/animations.css    ← all @keyframes + scroll-driven rules + reduced-motion
  styles.css               ← imports the two above + shared classes (.wrap, .eyebrow, .h2, .btn, .card, .tag, .code…)
  app/data/portfolio.data.ts
  app/core/theme.service.ts
  app/core/worker-status.service.ts
  app/shared/reveal.directive.ts
  app/shared/custom-cursor.component.ts
  app/shared/scroll-progress.component.ts
  app/sections/nav/…
  app/sections/hero/…            (includes arch-diagram as its own component)
  app/sections/currently-building/…   (includes terminal-log as its own component)
  app/sections/projects/…
  app/sections/how-i-think/…
  app/sections/stack/…
  app/sections/contact/…
  app/sections/footer/…
```

## Behaviour to port (from the reference's `<script>` and CSS)
1. **Theme**: `ThemeService` with a `signal<'dark'|'light'>`. Dark is the default. Save the choice in `localStorage` (SSR-safe: only touch `window`/`localStorage` in the browser via `isPlatformBrowser` or `afterNextRender`). Toggling adds `.theming` for 260 ms so colors fade in 200 ms without breaking hover transitions. The toggle button shows sun in dark mode and moon in light mode, and updates its `aria-label`. Avoid a flash of the wrong theme on load (apply the class before first paint with a tiny inline script in `index.html`).
2. **Worker countdown**: `WorkerStatusService` exposes `lastRun` and `nextRun` signals. It uses a 2-hour cycle starting 42 min after the last run and ticks every second, browser only.
3. **Custom cursor**: 28px ring + 4px dot, follows the mouse; grows to 44px and hides the dot over `a, button, [tabindex]`. Update position with direct style writes (`Renderer2`) outside Angular's change detection (`NgZone.runOutsideAngular`). Hidden on touch/coarse pointers.
4. **Scroll reveals**: keep the CSS `animation-timeline: view()` rules. Add `RevealDirective` as a fallback only when `CSS.supports('animation-timeline: view()')` is false: IntersectionObserver adds an `.in` class that plays the same fade-up / slide-left / scale-in.
5. **Scroll progress bar + nav background on scroll**: keep the CSS `scroll(root)` versions, with a small scroll-listener fallback (outside NgZone) for browsers without support.
6. **Architecture diagram, packets, terminal log, pulses, spinners**: pure CSS, copied as-is. Keep the SVG path coordinates and `offset-path` identical.
7. **prefers-reduced-motion**: everything shows instantly with no motion, packets hidden, as in the reference.

## Content (goes in portfolio.data.ts)
Copy all text from the reference exactly. Links:
- GitHub: https://github.com/ankit-for-work
- LinkedIn: https://linkedin.com/in/ankit-gupta
- Email: ankitjguptaforwork@gmail.com
- JobPing live demo: [LIVE_DEMO_URL]
- JobPing case study: [CASE_STUDY_URL]
- Resume PDF: [RESUME_URL] (or put the PDF in `public/` and link to it)
- Inventory Management "Details": [INVENTORY_URL]
- HR Leave Portal "Details": [HR_PORTAL_URL]
Leave any `[...]` I haven't filled in as `#` and list them for me at the end.

## Responsive
Match the reference's breakpoints (1020px and 720px). Then check the layout at 390px, 768px, 1024px and 1440px widths. No horizontal scroll at any width.

## Verify before you say you're done
1. `npm run build` passes with zero errors and zero warnings you introduced.
2. Add Playwright (`npm run test:visual`): screenshot the reference file and the running app at 1440×900 and 390×844, in dark and light, scrolled to each section. Compare them and fix differences until they match. Put screenshots in `e2e/screenshots/` so I can look at them.
3. Run Lighthouse on the production build (mobile + desktop) and report the four scores. Fix anything under 90.
4. Check keyboard navigation: Tab reaches every link and the theme toggle, and focus is visible.
5. Test with `prefers-reduced-motion: reduce` emulated in Playwright.

## Work style
- Work in small steps and commit after each section with a clear message (initialise git first).
- Show me the plan (file list + order) before writing code, then go.
- When finished, give me: how to run it, the Lighthouse scores, the remaining `#` placeholders, and one-line deploy steps for Vercel and for GitHub Pages.
