# Veratori Website — Required Next Steps

_Audit date: 2026-07-06. Context: this commit syncs the repo to what is already live at
veratori.com (the May 2026 redesign — 3-tier pricing, /demo page, hidden image placeholders,
Problem/Solution product page — was deployed but never committed; the repo was 2 months behind
the live site). Everything below is what still needs to be fixed or built, ranked._

## 1. CRITICAL — the /pricing "Secure Checkout" is fake and it is LIVE

`src/components/pricing/OrderForm.tsx` (`LoginModal`) shows a "Secure Checkout" dialog that:

- accepts a **real email + password** from the visitor, then fakes success with a
  `setTimeout(1200ms)` — no backend, no account, the credentials go nowhere;
- offers "Continue with Google" that fakes a Google sign-in the same way;
- presents **Stripe / PayPal** as payment options with no payment processing behind them.

Why this must be fixed before any real customer sees it:

- A visitor who "checks out" believes they ordered — the order does not exist (lost sale +
  liability).
- Collecting passwords into a dead form is a phishing-shaped pattern that can burn trust
  (and using Stripe/PayPal branding on a non-functional checkout is a compliance problem).

**Fix (pick one):**
- (fastest) Replace the whole modal with a "Request installation quote" form posting to
  Web3Forms — the /demo page already has this exact pattern to copy; or
- (real checkout) Use **Stripe Payment Links / Stripe Checkout** — a static site can link
  straight to Stripe-hosted checkout, no backend needed. Never collect passwords client-side.

## 2. HIGH — truth-in-marketing pass (product's core value is honesty)

The dashboard enforces "no fabrication" in code; the website should meet the same bar.

- **Hero "live" ticker** (`src/components/home/Hero.tsx`): "units counted / $ saved" starts at
  fixed values and grows by `rnd()` increments styled as a live scan. Either label it clearly
  ("Simulated view" / "Illustrative"), or wire it to a real aggregate stat. As-is it reads as
  real telemetry.
- **Press page**: outlet names (TechCrunch, Atlanta Business Chronicle, Food & Wine Tech,
  Restaurant Business) render as coverage; press releases are dated (Mar 2026 beta launch,
  Jan 2026 ATV cohort, 2024 LiDAR paper). Verify each is real and published — remove any that
  aren't.
- **Blog**: "How One Restaurant Recovered $8,000 in 90 Days" is a checkable claim — verify or
  reframe. Verify dates/authors on all six posts.
- **Locations** (header mega-menu): "Austin, TX (HQ) · Atlanta, GA · New York, NY" — confirm.
- **Stats**: "22 billion lbs of food wasted" etc. — add sources (footnote or link).

## 3. HIGH — dependency vulnerabilities (8: 4 high / 3 moderate / 1 low)

`npm audit` 2026-07-06: **next** (HTTP request smuggling in rewrites; image-cache growth),
**picomatch**, **flatted**, **form-data** (high); brace-expansion, js-yaml (moderate).
Most have non-breaking fixes:

```
npm audit fix && npm run build   # then redeploy out/
```

Static export blunts the Next.js server CVEs (no running server), but patch anyway — it's
one command.

## 4. Deploy process — stop shipping from an uncommitted tree

The live site ran ahead of git for ~2 months (manual `out/` uploads to Cloudflare).
- Connect **Cloudflare Pages → GitHub main** (build: `npm run build`, output: `out/`), and set
  `NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY` in the Pages build environment — a clone built without it
  ships **broken contact/demo forms** (the key is baked at build time; it currently lives only
  in the untracked `.env.local` on Felipe's machine).
- Decide the canonical GitHub home: `philipcardozo/Veratori-Website` and
  `FelipeCardozo0/Veratori-Website` are a mirror pair — auto-deploy from one, keep or retire
  the other.

## 5. Missing pieces (build next)

- **No path from website → product.** There is no "Sign in" link to the dashboard anywhere in
  the header/footer. Add one (e.g. `app.veratori.com` pointed at the Firebase-hosted dashboard;
  its CSP already allowlists `*.veratori.com`).
- **SEO plumbing**: no `robots.txt`, no `sitemap.xml`, no favicon/OG image in the export. All
  three are static files in `public/` (+ one `<link rel="icon">`) — quick win.
- **Real photography**: every `ImagePlaceholder` is now commented out (correct for launch);
  the described shots (sensor in cooler, dashboard on tablet, team/workspace) are the asset
  list for a photo day. `public/images/ATV.png` was uploaded but is referenced by nothing —
  wire it to the press/blog ATV items or delete it.
- **Hidden sections need a decision**: `RLTrainer` and the YOLO demo sandbox on /product are
  commented out, and their code still ships in the bundle (tfjs + coco-ssd are dependencies).
  Restore them or delete the components + drop `@tensorflow/tfjs`, `@tensorflow-models/coco-ssd`
  (and `three`/`@react-three/*` if nothing else uses them) — that's a large bundle cut.
- **Pricing confirmation**: $299 / $359 / $549 per unit/mo + 5/12/20% term discounts are now
  public. Confirm these are the intended launch numbers (they must match what the order/quote
  flow from item 1 actually charges).

## 6. Minor code debt

- Unused imports left behind by the commented-out placeholders (harmless; `next lint` will
  list them).
- `LoginModal`, its Stripe/PayPal SVGs, and the fake-auth state machine become dead code once
  item 1 lands — delete them then.
- Local git has a stray `justin` remote (unrelated project) — `git remote remove justin`.
