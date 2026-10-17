# Helping Hands Auto Care

Website for **Helping Hands Auto Care**, Chris Stiles's mobile mechanic service based in Enfield, New Hampshire — brakes, oil changes, diagnostics, batteries and tune-ups at the customer's home or work across the Upper Valley.

**Live:** https://helpinghandsmobilemechanic.vercel.app

## Tech stack

- Astro 5 static site, TypeScript, plain CSS (`src/styles/global.css`)
- Three.js hero: an interactive brake assembly that spins and explodes apart on scroll (`src/scripts/brake-scene.ts`)
- No server code and no environment variables

## Project layout

```
src/data/business.ts     Every fact on the site (phone, services, hours, rates). Change it here only.
src/data/reviews.json    Customer reviews
src/pages/index.astro    The one-page site
src/components/          Header, hero, footer, mobile call bar, logo, icons
src/scripts/             The Three.js brake scene
scripts/                 Asset tooling: logo build, 3D model optimisation, Facebook photo download
```

`business.ts` is the single source of truth: if a fact is not in it, it doesn't go on the site. Items marked `TODO(helpinghands)` still need Chris's confirmation.

## Local setup

Requires Node 20.3+.

```bash
npm install
npm run dev       # http://localhost:4531
npm run build     # static output in dist/
npm run models    # re-optimise the 3D models after replacing them
```

## Deploying

Vercel builds with `npm run build` and serves `dist/` (`vercel.json` also sets security headers and long caching for `/_astro/`). Pushes to `main` deploy to production.
