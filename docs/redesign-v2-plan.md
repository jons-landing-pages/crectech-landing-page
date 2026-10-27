# CRecTech site — redesign v2 plan ("pull out all the stops")

Branch: `redesign/modern-2026`. Dev server: `npm run dev -- -p 3107`.
Source of facts: `CRecTech Pitch Deck.pdf` (14 pages, 2026). Page numbers below are deck pages.
Rule: only facts the deck or the existing site state. No invented numbers, customers or claims.

## Direction

Two scales, two looks, one camera:

- **Macro world (mill, plant):** engineering drawing in 3D, like the MarinaChain product films.
  Paper background, ink pen-line edges (drei `Edges`), haze fog, flat soft light, no shadows.
- **Micro world (reactor, pellet, molecules):** dark carbon background, the same pen lines in
  paper/green, molecules as ball-and-stick with clearcoat. Gold = oxygen, white = hydrogen,
  graphite = carbon. Legend on screen.
- The page background travels from paper to carbon as the camera zooms in ("Powers of Ten"),
  then back to paper as it zooms out. No crossfades between scenes: each scene grows out of the last.

Type and tokens stay from v1: Archivo (wide display), IBM Plex Mono labels, green `#3fd47a`,
gold `#d9a92c`, carbon `#0a0f0c`, paper `#f3f1ea`.

## Home page order

1. **Hero** — 3D CRecREF™ catalyst pellet (7-hole cylinder, deck p4 photo), gas streaming through
   its channels: CH₄ + CO₂ + H₂O in (green/gold), H₂ + CO out (white). Pointer tilt.
2. Partner marquee (10 logos, files renamed in v1).
3. **Stranded biogas** (deck p2–3) — dot field: >1,000 mills in Indonesia, >65% stranded,
   <10% of biogas captured, up to 20,000 Nm³/day per mill, POME in open lagoons.
4. **The journey** — pinned 3D scroll story (state list below).
5. **Process simplification** (deck p5) — animated line diagram, conventional 4 steps vs CRecTech 2,
   with syngas ratios H₂:CO 3–5 : 1 vs 2 : 1, vented biogenic CO₂, added steam/CO₂.
6. **Scale-up** (deck p9) — log-scale ladder: 1 g/day → 1 kg/day → 50 t/yr → ~50 kt/yr → 500 kt/yr.
7. **Sei Mangkei pilot** (deck p10–11) — Pertamina NRE joint development, 50 t/yr,
   450 t CO₂eq avoided per year, commissioning 10 December 2026 (live countdown).
   At scale: 1,000 mills × ~7 kt/yr → 65 Mt CO₂eq per year.
8. **Ways to work with us** (deck p8) — licensing, technology provider (preferred), BOOT. No IRR.
9. Momentum (awards deck p12 + news) and team teaser.

Left out on purpose (investor-only, confirm with founder before publishing): cost per tonne,
margins, IRR/payback, TAM/SAM/SOM, unnamed "paid US client", partner logos from the GTM slide.

## The journey — state list (scroll-driven, one camera, one world)

| # | Scroll | Layer | Camera / object | Copy (deck page) |
|---|---|---|---|---|
| S1 | 0.00–0.14 | Plant | High wide shot of covered POME lagoon; gas bubbles rise | Lagoon, 20,000 Nm³/day, <10% used (p2) |
| S2 | 0.14–0.30 | Plant | Camera follows pipe to pre-treatment → reactor container → storage | Plant at the source, Sei Mangkei (p11) |
| S3 | 0.30–0.44 | Reactor | Container walls fade, two reactor columns, cut-away tube of pellets | Reactor 1 + Reactor 2 (p4) |
| S4 | 0.44–0.58 | Pellet | Push into one pellet; gas through its holes | CRecREF™ catalyst, WO/2023/146478 (p4) |
| S5 | 0.58–0.74 | Molecules | Catalyst surface; CH₄, CO₂, H₂O arrive; H₂ and CO leave | Biogas reforming → syngas 2 : 1 (p5) |
| S6 | 0.74–0.88 | Molecules | 2 H₂ + CO join into CH₃OH | MeOH synthesis (p5) |
| S7 | 0.88–1.00 | Plant | Fast zoom back out; storage totes fill | Marine-grade bio-methanol (p4) |

Mobile: same story, canvas full-bleed behind a bottom text band (not a side column).
Reduced motion: no pinning; each state is a still pose with its text.

## Engineering

- `three@0.186.1`, `@react-three/fiber@9.8.1`, `@react-three/drei@10.7.9`, `lenis@1.3.26`.
- Each 3D scene is a client component loaded with `next/dynamic` (`ssr: false`), rendered only
  while on screen (`frameloop` toggled by IntersectionObserver), DPR capped at 1.75.
- All geometry is procedural (extruded shapes, instancing). No downloaded models, no AI images.
- Seeded randomness (mulberry32) so the scenes look the same on every load.
- Camera: keyframes `{target, orbit:[az, el, dist], fov}` with monotone cubic Hermite per channel and
  log-space distance (pattern from `marinachain-product-videos/products/series/look3d/camera.ts`).

### Scroll performance (measured 2026-10-14)

- `SceneWarmup` compiles every material (`compileAsync`) and draws one frame while the visitor is on
  the cover. Without it, three.js compiled shaders the first time each object came into view and the
  page froze mid-scroll (0.15–0.4 s with a warm shader cache, several seconds on a first visit).
- Keep the number of lights constant. Light counts are part of every material's shader, so hiding a
  light (or a group that holds one) recompiles all materials. Switch lights by `intensity` instead.
- `SceneCanvas` drops to pixel ratio 1 for the rest of the visit after 2.5 s below 40 fps (drei
  `PerformanceMonitor`), for older and integrated GPUs.
- Lenis already smooths the wheel, so the camera damping is light (`SCROLL_DAMPING = 10`).
- How to measure: production export, Playwright Chrome with `--use-angle=metal`, steady programmatic
  scroll with `behavior: "instant"` (the page CSS sets `scroll-behavior: smooth`), long-animation-frame
  entries for freezes, and `Emulation.setCPUThrottlingRate` 4 for an older CPU.

## Checks (run before each hand-off)

1. `npx tsc --noEmit` and `npx next build` pass.
2. Browser at 1440×900 and 375×812: every section, no horizontal scroll, no console errors.
3. Stills critique (motion-studio): screenshot each journey state; score composition, legibility,
   motion direction (two frames apart), and fix the worst three. Three rounds, every score ≥ 8.
4. Reduced-motion pass and a WebGL-off fallback (static text still readable).
5. Lighthouse-style sanity: hero text visible before JS; 3D bundles not in the first-load chunk.

## Resume point

**Status (2026-10-14):** built and verified (build passes; stills at 1440×900 and 390×844, no console errors).

Changes from the original plan, at the user's request:
- Home cover is the deck p10 drone photo (`public/images/site/sei-mangkei-aerial.jpg`) with an SVG callout overlay; the 3D journey sits directly below it, opening on the plant overview.
- Each page has its own opener: Technology = floating 3D pellet on paper (`TechnologyHero`), About = team photo, News/Contact = compact `PageHeader`.
- Process comparison is an animated flow sheet (`components/shared/ProcessDiagram.tsx`).
- All copy follows the antislop lens: full-sentence headlines with checkable facts.

The founder review items (financial figures kept out, the bi-reforming balance, pilot date, photo rights) are approved. The work is in PR #1 on `jons-landing-pages/crectech-landing-page`, and Vercel deploys a preview for each push. Next.js is on 16.4.3. On 2026-10-27 `npm audit` reported new critical advisories for 16.0.0–16.4.0 (GHSA-2464-fhr4-w9xw, GHSA-p3m5-59mp-jv5r, GHSA-673q-mjm6-r5xr); 16.4.3 clears them (`npm audit` reports 0 vulnerabilities).

**Status (2026-10-27):** type-check and build pass on 16.4.3. Phone emulation at 375×812 (local dev server, because the Vercel preview needs a Vercel login): cover, journey states and all inner pages have no horizontal scroll and no console errors.

Next, if continuing: check the Vercel preview on a real phone (iOS Safari and Android Chrome), then merge PR #1.
