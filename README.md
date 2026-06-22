# Valentina's Preschool — Project Hub

> **Single source of truth** for the website rebuild. This file consolidates what
> used to be six separate docs (project status, brand, SEO strategy, website plan,
> source-site audit, competitor analysis) so everything stays in one place and in
> sync.
> Last updated: 2026-06-19

**The product brand is _Valentina's Preschool_** (no rebrand). The repo folder is
named `little-sprouts-childcare` — that's a cosmetic placeholder only.

> 📎 **Cross-references:** older notes say things like "see `BRAND.md` §8b" or
> "see `SEO_STRATEGY.md`." Those now refer to the matching **section within this
> document** (the standalone files were merged here).

---

## Table of contents

1. [Project Status](#1-project-status) — stack, what's built, what's left
2. [Brand Foundation](#2-brand-foundation) — name, domain, colors, type, voice, NAP
3. [SEO Strategy](#3-seo-strategy) — the governing hub-and-spoke plan
4. [Website Plan](#4-website-plan) — original splash vision → Home conversion layer
5. [Source Site Audit](#5-source-site-audit) — verbatim content + facts from the old Weebly site
6. [Competitor Analysis](#6-competitor-analysis) — teardown of four reference sites
7. [Admin Panel](#7-admin-panel) — the staff management app (D1 + R2, Cloudflare Access)

---

# 1. Project Status


> Living document capturing decisions, what's built, and what's left.
> Update as the project evolves.
> Last updated: 2026-06-19

> **Note on the folder name:** the repo lives in `little-sprouts-childcare`,
> which was a working placeholder. The product brand is **Valentina's Preschool**
> (see `BRAND.md` — no rebrand). The folder name is cosmetic.

---

## Project location

```
C:\Users\roflo\little-sprouts-childcare
```

```bash
cd C:\Users\roflo\little-sprouts-childcare
code .
```

---

## Stack & key decisions

| Topic | Decision | Why |
| --- | --- | --- |
| **Framework** | **Astro 6** | Ships **zero JS by default** → excellent Core Web Vitals → strong SEO. Grows into SSR/forms/portal later without a rewrite. |
| **Hosting** | **Cloudflare Pages** (planned) | Generous free tier, global CDN, push-to-deploy, automatic HTTPS, host-agnostic. |
| **Language** | TypeScript (strict) | Type safety from the start. |
| **Sitemap** | `@astrojs/sitemap` | Auto-generates `sitemap-index.xml` on build. |
| **Architecture** | **Hub-and-spoke** (per `SEO_STRATEGY.md`) | Each of Valentina's strengths becomes its own schema-rich, keyword-targeted page. Supersedes the single-splash idea. |
| **Fonts** | Self-hosted Fraunces + Nunito Sans (`@fontsource-variable`) | Performance + brand; no third-party font requests. |
| **Images** | Central registry (`src/data/images.ts`) + `Img` component | One-line swap from placeholder → real photo per slot. |
| **Domain** | `valentinaspreschool.com` (confirmed available) | Exact-match, credible. Client to purchase. |

### Considered and ruled out
- **Next.js** — overkill for a content/marketing site (ships a React runtime even on static pages).
- **Docusaurus** — a *documentation* generator; wrong fit (its own docs recommend Astro for marketing sites).
- **Eleventy** — great but too bare-bones (no component model, more manual DX).

---

## What's built ✅

A complete, production-building static site (11 pages) implementing the
hub-and-spoke architecture.

### Pages (`src/pages/`)
| Page | Path | Role / target |
| --- | --- | --- |
| Home (hub) | `/` | Conversion splash + links to all spokes |
| Philosophy | `/philosophy/` | "Reggio Emilia preschool LA" |
| Emotional Literacy | `/emotional-literacy/` | "social-emotional preschool West LA" |
| Bilingual / Spanish | `/bilingual/` | "bilingual preschool Culver City" |
| Programs (by age) | `/programs/` | "toddler / preschool 90034" |
| Enrichment | `/enrichment/` | yoga / gardening / cooking / music (low-competition) |
| Our Educators | `/educators/` | E-E-A-T, `Person` schema |
| Testimonials | `/testimonials/` | `Review` + `AggregateRating` (star snippets) |
| Tuition & FAQ | `/tuition/` | `FAQPage` schema, "preschool cost Culver City" |
| Contact / Book a Tour | `/contact/` | Inquiry form (frontend), map, hours |
| 404 | `/404/` | Custom not-found |

### Components & infrastructure
- `src/layouts/BaseLayout.astro` — meta, Open Graph, canonical, JSON-LD schema.
- `src/components/` — `Header`, `Footer`, `PageHero`, `CtaBand`, `Img`.
- `src/data/site.ts` — single source of truth (NAP, facts, tuition, award, social, nav).
- `src/data/testimonials.ts` — the 8 attributed reviews (for display + schema).
- `src/data/images.ts` — central image registry (see Images below).
- `src/styles/global.css` — "Sunny Garden" brand tokens + base styles.
- `public/` — `robots.txt`, branded `favicon.svg` ("V" monogram).
- `astro.config.mjs` — `site` set to `https://www.valentinaspreschool.com`, `trailingSlash: 'always'`, sitemap integration.

### SEO / schema in place
- `LocalBusiness` → `ChildCare`/`Preschool`, `Person` (Valentina), `Review` +
  `AggregateRating`, `FAQPage` JSON-LD.
- Per-page `<title>`/meta/Open Graph, canonical tags, sitemap, `robots.txt`,
  descriptive alt text on every image.

### Images (placeholder strategy) 🖼️
Real photos aren't in hand yet, so every image is a **vetted placeholder** that
visually resembles the intended final shot, swappable in one line:
- **Scenes** → hand-picked, individually verified **Pexels** photos (real
  kids/classroom; each ID checked + confirmed to resolve). *Not* a random feed.
- **Portraits** → randomuser.me headshots (consistent placeholders for staff).
- **To replace later:** drop the real photo in `src/assets/`, import it in
  `src/data/images.ts`, set `src:` on that entry — `src` always wins over the
  placeholder. (Then process via `astro:assets` for AVIF/WebP.)

---

## Build & run

```bash
npm run dev      # local dev server at http://localhost:4321
npm run build    # production build into dist/  (✅ passing — 11 pages)
npm run preview  # preview the production build
```

Requires Node ≥ 22.12 (currently Node **v22.22.0**, npm **10.8.2**).
Latest build: **11 pages, no errors.**

---

## Deployment & domain

**Repo:** https://github.com/otaviowillow/valentinas-preschool (public, `main`).

**Cost: ~$11/year total** — the domain is the only paid item. Hosting, SSL,
GitHub, and the form backend are all free.

### Step 1 — Deploy to Cloudflare Pages (free, ~5 min)
1. Create a free account at <https://dash.cloudflare.com>.
2. **Workers & Pages → Create → Pages → Connect to Git** → authorize GitHub →
   pick **`valentinas-preschool`**.
3. Build settings (Astro is auto-detected; confirm these):
   - **Framework preset:** Astro
   - **Build command:** `npm run build`
   - **Build output directory:** `dist`
4. **Save and Deploy.** In ~1 min you get a live URL:
   `valentinas-preschool.pages.dev`. Every push to `main` now auto-deploys.

### Step 2 — Buy the domain (~$10–11/yr)
**Option A — Cloudflare Registrar (recommended; at-cost, DNS auto-wired):**
1. In the Cloudflare dashboard: **Domain Registration → Register Domains**.
2. Search `valentinaspreschool.com` → add to cart → pay. WHOIS privacy is free.

**Option B — Porkbun (cheapest standalone):** register at <https://porkbun.com>,
then add the domain to Cloudflare (**+ Add a site**) and switch its nameservers
to the two Cloudflare gives you.

### Step 3 — Attach the domain to the site
1. **Workers & Pages → your project → Custom domains → Set up a domain.**
2. Enter `valentinaspreschool.com` **and** `www.valentinaspreschool.com`.
   - If the domain is on Cloudflare (Option A, or B after nameserver switch),
     DNS records are created automatically.
3. Set the apex (`valentinaspreschool.com`) to redirect to
   `www.valentinaspreschool.com` (matches `site` in `astro.config.mjs`).
4. SSL/HTTPS is issued automatically (free). Done.

> **Form backend (free, do before launch):** the contact form is frontend-only.
> Wire it to a **Cloudflare Pages Function** (100k req/day free) or a free
> service (Web3Forms/Formspree). Put any API key in **Cloudflare → Settings →
> Environment variables / secrets** — never commit it (the repo is public).

---

## What's left ⏳

### Needs the client (blocking polish, not the build)
1. **Buy the domain** `valentinaspreschool.com` and point DNS at Cloudflare Pages.
2. **Real photos** — select/share best Instagram shots (full-res) + parental
   **photo-release consent**. Replaces placeholders.
3. **Award badge** — clean (non-"SAMPLE") BusinessRate "Top 3 2026" image, and
   confirm she's OK with the "Mid-City LA" geo label.
4. **Confirm facts:** director name spelling (Valentina Gloginic), age range
   (sources conflict: 15mo–5yr vs 17mo–6yr), ~$350/wk + $300 app-fee pricing,
   and a **contact email** (`nap.email` is still blank in `site.ts`).
5. **Google Business Profile access** — to update the URL + run the reviews engine.
6. **Staff roster** — confirm current educators (is "Angelica" still on staff?).
7. **Logo** — approve the hand-lettered wordmark direction (or have us generate concepts).
8. **Social links** (Yelp, Facebook) for the footer.

### Engineering to-do before launch
- Wire the **contact form** to a backend (Web3Forms / Formspree / Cloudflare
  Pages Function) — currently frontend-only.
- Create a **social-share image** (`/og-image.jpg`) referenced by Open Graph.
- Final **performance/accessibility pass** + run real images through `astro:assets`.
- **Deploy to Cloudflare Pages**; add the domain to **Google Search Console** and
  submit the sitemap.
- Execute the **Weebly migration** steps (update URL across listings; see
  `BRAND.md` §8c) so existing GBP/citation equity isn't lost.

### Later (phased)
- **Phase 2:** Resources/blog (Reggio cornerstone), a lightweight CMS for
  self-editing, Spanish-language pages (`hreflang`).
- **Phase 3 (demand-driven):** parent-communication "system" (photos,
  newsletters, assessments) over online enrollment.


---

# 2. Brand Foundation

> Pinned-down brand basics for the rebuild: name, domain, colors, type, logo,
> voice, imagery. Decisions are made (opinionated defaults) so we can build;
> client can override any of them.
> Last updated: 2026-06-19

---

## 1. Name

- **Official name:** **Valentina's Preschool** — keep it. 14+ years of brand
  equity, name recognition, Google reviews, and the BusinessRate award are all
  tied to this name. Do **not** rebrand.
- **Director / founder:** Valentina Gloginic (confirm spelling).
- **Note:** the repo folder is `little-sprouts-childcare` — that's a placeholder.
  The product brand is **Valentina's Preschool**. ("Little sprouts" survives only
  as an optional motif — see Logo.)
- **Display rules:** "Valentina's Preschool" (curly apostrophe ' in display copy,
  straight ' in code/alt text). Never "Valentinas" without the apostrophe.

---

## 2. Tagline & descriptors

- **Primary tagline (hero):** *"Childhood is not a race — every child develops at
  their own pace and grace."* (Her existing, beloved slogan — keep it.)
- **Short descriptor (meta/SEO/one-liner):** *"A boutique, Reggio-inspired
  preschool in Culver City / West LA — ages 15 months to 5 years."*
- **Micro-positioning (the moat):** the warm, un-corporate preschool where
  every child is *known* — Reggio-inspired, bilingual, emotional-literacy
  focused, with rich enrichment included.
- ⚠️ **Messaging change (2026-06-19):** per client direction we **no longer lead
  with "12 children / 1:4 ratio"** on the homepage. The boutique/small-by-design
  quality still underpins the voice and is fair game in body copy and SEO, but it
  is **not** a headline stat. Hero stats now lead with strengths (14+ years, two
  languages, Top-3 award, enrichment included).

---

## 3. Domain  ✅ decision

- **Register: `valentinaspreschool.com`** — **confirmed AVAILABLE** (RDAP check,
  2026-06-19). This is the clean, exact-match, most credible option. **Grab it
  ASAP** before someone else does.
- Also available as fallbacks/defensive buys: `valentinapreschool.com`,
  `valentinaspreschoolla.com`, `valentinaspreschool.net/.org/.la`.
- **Recommendation:** buy `.com` (primary) + optionally the `.net`/`.org` and the
  common misspelling `valentinapreschool.com` to redirect → primary.
- Then set `site: 'https://www.valentinaspreschool.com'` in `astro.config.mjs`
  (replaces the placeholder) and point DNS at Cloudflare Pages.
- Use a privacy-protected registrar (Cloudflare Registrar = at-cost, no markup).

---

## 4. Color palette  ✅ decision — **"Sunny Garden"** (implemented)

Theme: **bright, joyful, growing.** Per client direction we **brightened** the
original muted sage/terracotta scheme into a livelier "Sunny Garden" palette:
a vivid leaf green signature with cheerful coral, sunny yellow, and a sky-blue
pop, on bright cream with soft color-tinted section backgrounds. Reads as
*child-joy*, not *adult-wellness somber* — while staying warm and boutique.

> ⚠️ **Differentiation note:** the muted sage+terracotta+cream look is the most
> overused "warm boutique" palette of the 2020s. We avoid it by (1) committing to
> **one ownable signature — bright leaf green `#4fa45a`** used decisively, (2)
> **joyful pops** (coral/yellow/sky) in kid-facing moments, and (3) an
> **accessibility commitment:** small text on light uses **Deep green `#2c6b40`**
> or **Deep coral `#b8431f`** (both ≥4.5:1 on cream); bright fills are for large
> text/decoration only. Every pair checked against WCAG AA before ship.

These are the **live tokens** in `src/styles/global.css`:

| Role | Name | Hex | Use |
| --- | --- | --- | --- |
| Primary | Bright Leaf Green | `#4fa45a` | signature; buttons, brand accents, fills |
| Primary-dark | Deep Green | `#2c6b40` | headings + small text on light (AA), footer |
| Primary-light | Soft Mint | `#cfebd2` | tints, borders |
| Secondary | Bright Coral | `#ee6c45` | highlights, art/activity accents |
| Secondary-dark | Deep Coral | `#b8431f` | CTAs / links on light (AA) |
| Accent | Sunny Yellow | `#ffc23c` | award badge, small pops, stars |
| Pop | Sky Blue | `#4fb3d9` | occasional accents |
| Surface | Bright Cream | `#fffdf7` | page background |
| Surface-2 | Butter Sand | `#fbf1dc` | alternating sections, cards |
| Tint — mint | Mint | `#eaf6ea` | section background |
| Tint — butter | Butter | `#fff3d4` | section background |
| Tint — peach | Peach | `#ffe7dc` | section background |
| Tint — sky | Soft Sky | `#e4f4fa` | section background |
| Ink | Warm Charcoal | `#2e2a26` | body text |
| Ink-muted | Stone | `#6b6258` | captions, secondary text |

- **Contrast:** body/small text uses Deep Green or Warm Charcoal on light
  (≥4.5:1); bright leaf green and coral are for large text, fills, and
  decoration. Section tints are kept pale enough to keep dark text readable.
- Implemented as CSS custom properties (`--color-primary`, etc.) in
  `src/styles/global.css`; section tints exposed as `.section--mint`,
  `.section--butter`, `.section--peach`, `.section--sky`.

---

## 5. Typography  ✅ decision

Pairing: a **warm characterful serif** for headings (credible, human, a little
editorial) + a **friendly rounded sans** for body (approachable, highly legible).

- **Headings / display:** **Fraunces** (Google Fonts) — warm, modern serif with
  personality; great for a boutique, story-led feel.
- **Body / UI:** **Nunito Sans** (Google Fonts) — rounded, friendly, very
  readable for parents skimming on mobile.
- **Fallback stack:**
  - Headings: `'Fraunces', Georgia, 'Times New Roman', serif`
  - Body: `'Nunito Sans', system-ui, -apple-system, 'Segoe UI', sans-serif`
- **Performance:** self-host via `@fontsource` (or Astro font optimization) with
  `font-display: swap`, preload the two primary weights, subset to Latin (+ Latin
  for Spanish accents). Avoid loading many weights (keeps CWV high — our edge).
- ⚠️ **De-cliché caveat:** Fraunces + Nunito are popular (read: a little
  generic). We accept them for trust/legibility but make the pairing *ours* via a
  signature treatment — a distinctive Fraunces optical size + weight for H1 and a
  consistent accent rule — rather than default settings. Re-evaluate if it looks
  templated.
- ✅ **Spanish glyph check (required):** confirm both fonts ship full Latin-ext
  (á é í ó ú ñ ü ¿ ¡) before locking — bilingual copy depends on it.
- **Scale (suggested):** fluid type with `clamp()`; H1 ~clamp(2.2rem, 5vw, 3.5rem),
  body 1.0625–1.125rem, generous line-height (1.6 body) for warmth/readability.

---

## 6. Logo  ▶ direction (needs production + approval)

- ⚠️ **The sprout is a cliché.** Sprouts/trees/butterflies/suns/ABC-blocks are
  the most generic marks in all of childcare; anchoring on "little sprouts" (a
  *placeholder folder name*) would make us look templated. Reject it as the
  primary.
- **Primary direction (stronger):** a **hand-lettered "Valentina's" signature
  wordmark** — personal, warm, boutique, and *impossible to copy*. It reinforces
  the real moat: trust in **Valentina the person** (the testimonials are all about
  her). "Preschool" set smaller beneath in Fraunces/Nunito.
- **Optional secondary mark:** if an icon is needed (favicon/GBP/app), prefer
  something *specific* to her — a subtle monogram **"V"** or a small motif drawn
  from her real differentiators (Reggio "hundred languages" / art) — over a
  generic seedling. A sprout may appear as a tiny tertiary flourish at most.
- **Variants needed:** horizontal (header), stacked (footer/social), icon-only
  (favicon, app icon, GBP), one-color (dark + cream) versions.
- **Favicon:** ✅ a temporary branded **"V" monogram** favicon
  (`public/favicon.svg`, in the brand green) is in place, replacing the default
  Astro favicon. Swap for the final mark once the wordmark/icon is designed.
- **Status:** wordmark to be designed. I can generate logo concepts on request
  (wordmark + optional "V" monogram in the palette above), or hand specs to a
  designer.

---

## 7. Voice & tone

- **Warm, parent-to-parent, intimate, expert-but-not-corporate** (think Mata
  House's founder voice, not CEFA's corporate polish).
- First person plural ("we"), concrete and specific over buzzwordy.
- Lead with feeling + child outcomes; back with credentials/proof.
- A light **bilingual touch** is on-brand (occasional Spanish, since Spanish
  immersion is a real strength) — but keep primary copy English, with full
  Spanish pages later (see SEO strategy).
- Avoid: corporate jargon, over-claiming, anything that makes a 12-child home
  preschool sound like a franchise.

**Make it usable — sample lines:**
- ✅ *"Your child is known here — never lost in the shuffle."* (boutique feel
  *without* leading on the ratio stat — see §2 messaging change.)
- ✅ *"For over fourteen years, families across Culver City have trusted Valentina
  with their first goodbyes and proudest firsts."*
- ✅ *"They garden, cook, paint, stretch into yoga, and sing in two languages —
  all before lunch."*
- ❌ "We leverage a holistic, child-centric pedagogical framework." (jargon)
- ❌ "The #1 best preschool in Los Angeles!" (over-claim / unverifiable)
- ❌ "Our world-class facilities…" (franchise-speak for a home program)
- **Banned words:** world-class, cutting-edge, synergy, solutions, state-of-the-art.

---

## 8. Imagery

- **Real, warm, candid photos** in natural light — children doing art, gardening,
  yoga, cooking, meals, play; the home-like space; Valentina & teachers with kids
  (with photo-release consent).
- Prefer authentic over stock. If stock is unavoidable for launch, choose
  warm, diverse, natural-light images consistent with the palette.
- **Treatment:** slightly warm, soft; rounded corners on cards/images to match
  the friendly type. Consistent crop ratios.
- **Optimization:** all via `astro:assets` (AVIF/WebP, responsive, lazy) +
  descriptive alt text (doubles as SEO).
- **Privacy:** only publish children's photos with signed parental consent.

> **Current implementation (placeholders until real photos arrive):** every image
> is defined once in `src/data/images.ts` and rendered via the `Img` component, so
> swapping in a real photo is a **one-line change per slot** (`src:` wins over the
> placeholder). Temporary placeholders are **hand-picked, individually verified**
> Pexels photos for scenes (real kids/classroom — not a random feed) and
> randomuser.me headshots for staff portraits. Each carries final SEO-ready alt
> text already. See `PROJECT_STATUS.md` → Images for the swap recipe.

---

## 8b. Canonical NAP  ✅ decision (local-SEO foundation)

The **single most important local-SEO asset**: one exact Name / Address / Phone
string, used **byte-for-byte identically** everywhere (site footer, schema, GBP,
Yelp, every directory). Inconsistency (e.g., "Ste" vs "Suite", "LA" vs "Los
Angeles") fractures ranking signals.

```
Valentina's Preschool
6100 Hargis St
Los Angeles, CA 90034
(310) 839-9147
```

- **City decision:** use **"Los Angeles, CA 90034"** as the literal postal
  address (matches the license/listings) — but *target* Culver City + West LA +
  Mid-City in copy, page content, and GBP service area (per `SEO_STRATEGY.md`).
  Don't put a non-postal city in the NAP block.
- Phone format: `(310) 839-9147` everywhere (pick one format and never vary).
- Embed this in `LocalBusiness`/`ChildCare` JSON-LD verbatim.
- **Action:** audit existing listings (GBP, Yelp, GreatSchools, Paper Pinecone,
  Care.com, Winnie) and correct any NAP mismatches.

---

## 8c. Migration from Weebly  ⚠️ (don't lose existing SEO)

She's on `valentinaspreschool.weebly.com` today; moving to the new domain risks
dropping any existing search history if done naively (**Weebly free subdomains
can't 301-redirect to an external domain**).

Plan:
1. Build + launch the new site on `valentinaspreschool.com` (Cloudflare Pages).
2. **Update the website URL everywhere** to the new domain: Google Business
   Profile (most important), Yelp, GreatSchools, Paper Pinecone, Care.com,
   Winnie, social bios, NAEYC.
3. **Google Search Console:** add/verify the new domain, submit the sitemap.
4. Recreate any meaningful old URLs as matching paths on the new site (so inbound
   links land somewhere relevant).
5. Keep the **Weebly page live temporarily**, edited to point visitors to the new
   site (a prominent link/notice), until the new domain is indexed and ranking.
6. Only then retire Weebly.

> Reality check: the Weebly site likely has thin SEO equity anyway, so the upside
> is mostly *not losing the GBP/citation linkage* — which step 2 handles.

---

## 8d. Photo acquisition plan  ⚠️ (the brand is photo-dependent)

The entire warm-boutique strategy + the trust it builds + image SEO all hinge on
**real photos.** ✅ **Risk largely resolved:** Valentina has an active Instagram
with lots of photos — **[@valentinaspreschool](https://www.instagram.com/valentinaspreschool/)** —
which gives us a ready library for the hero, the photo grid, and image SEO.

- **Source the best shots from Instagram** (download originals at full
  resolution — IG compresses; ask Valentina for the source files where possible).
- **Optional top-up photoshoot** for any gaps (even a good phone in natural
  light): morning light, candid, not posed.
- **Shot list:** children doing art / gardening / yoga / cooking; meal time; the
  home-like indoor space + outdoor garden; close-ups of hands/projects; Valentina
  & teachers interacting warmly with kids; the daily-rhythm moments
  (arrival, circle, play, nap area, pickup).
- **Consent:** signed **parental photo-release** for any identifiable child before
  publishing (legal + trust requirement). Keep a few consent-free
  "hands/details/space" shots as safe fallbacks.
- **IG fold = static curated grid, NOT a live embed** — download + optimize the
  chosen images so we don't tank Core Web Vitals (a live IG widget is
  render-blocking third-party JS). Link the grid out to the IG profile.
- Process all via `astro:assets` (AVIF/WebP, responsive) with descriptive,
  keyworded alt text.

---

## 9. Quick-start tokens (mirrors `src/styles/global.css`)

```css
:root {
  /* "Sunny Garden" palette */
  --color-primary: #4fa45a;       /* Bright leaf green — signature */
  --color-primary-dark: #2c6b40;  /* Deep green — text on light (AA) */
  --color-primary-light: #cfebd2; /* Soft mint */
  --color-secondary: #ee6c45;     /* Bright coral */
  --color-secondary-dark: #b8431f;/* Deep coral — CTAs/links (AA) */
  --color-accent: #ffc23c;        /* Sunny yellow */
  --color-sky: #4fb3d9;           /* Sky blue pop */

  --color-surface: #fffdf7;       /* Bright cream */
  --color-surface-2: #fbf1dc;     /* Butter sand */
  --color-mint: #eaf6ea;
  --color-butter: #fff3d4;
  --color-peach: #ffe7dc;
  --color-sky-soft: #e4f4fa;

  --color-ink: #2e2a26;           /* Warm charcoal */
  --color-ink-muted: #6b6258;     /* Stone */

  --font-heading: 'Fraunces Variable', Georgia, serif;
  --font-body: 'Nunito Sans Variable', system-ui, sans-serif;

  --radius: 14px;
  --maxw: 1120px;
}
```

---

## 10. Decisions log

| Item | Decision | Status |
| --- | --- | --- |
| Name | Valentina's Preschool (no rebrand; lean into the *person*) | ✅ |
| Tagline | "Childhood is not a race…" | ✅ |
| Domain | `valentinaspreschool.com` (available) | ✅ recommend buy |
| **Canonical NAP** | Locked string (§8b) used identically everywhere | ✅ |
| Colors | **"Sunny Garden"** — bright leaf green signature + joy pops; deep green/coral for text (a11y) | ✅ implemented |
| Fonts | Fraunces + Nunito Sans, self-hosted (verify Spanish glyphs) | ✅ w/ check |
| Logo | **Hand-lettered "Valentina's" wordmark** (drop the sprout cliché) | ▶ to design |
| Favicon | Temporary **"V" monogram** SVG in brand green | ✅ placeholder |
| Voice | Warm, boutique, parent-to-parent; **don't lead on 1:4** (§2) | ✅ |
| Imagery | Real photos from IG; **vetted placeholders live now** (§8) | ✅ system built |
| Social | Instagram @valentinaspreschool (footer + IG grid) | ✅ |
| **Weebly migration** | URL-update + preserve plan (§8c) | ▶ at launch |

**Still needs the client:** buy the domain, approve logo direction (or let me
generate concepts), **select/share the best Instagram photos** (full-res) +
photo-release consent, confirm director name spelling, and grant access to
**Google Business Profile** (so we can update URL + run the reviews engine).


---

# 3. SEO Strategy

> The "absolute best" direction: maximize SEO while leveraging 100% of
> Valentina's real strengths. Supersedes the splash-only approach in
> `WEBSITE_PLAN.md` (which becomes the *conversion layer* inside this bigger plan).
> Last updated: 2026-06-19

> ✅ **Implementation status:** the **Phase 1 on-page** architecture below is
> **built** — Home hub + spokes (Philosophy, Emotional Literacy, Bilingual,
> Programs, Enrichment, Educators, Testimonials, Tuition/FAQ, Contact), with
> `LocalBusiness`/`ChildCare`, `Person`, `Review`+`AggregateRating`, and `FAQPage`
> JSON-LD, sitemap, canonicals, and alt text in place. **Not yet done:** the
> off-site work (GBP optimization, reviews engine, citations — §5), Resources/blog
> + Spanish `hreflang` pages (Phase 2), and form backend + deploy. See
> `PROJECT_STATUS.md` → "What's left." Architecture details below are the
> source of truth for *why* the site is shaped this way.

---

## 0. The core thesis (read this first)

**Valentina's strengths ARE her keywords.** Every genuine differentiator she has
maps 1:1 to a high-intent, low-competition local search term. The winning move is
a **local hub-and-spoke content site** where each strength becomes its own
dedicated, schema-rich, internally-linked page — all feeding a dominant **Google
Business Profile** presence, all served at near-perfect Core Web Vitals by Astro.

> Reframe: we are not building "a splash page." We are building a **local SEO
> discovery engine with a beautiful conversion layer on top.** The splash is how
> we *convert* the traffic; the spokes + GBP are how we *earn* it.

---

## 1. Why the splash-only plan loses on SEO (the deeper attack)

1. **One page = one ranking opportunity.** A single splash competes for *all*
   keywords with *one* URL. Google ranks a page well for ~1–2 primary terms. You
   have **~10 distinct, ownable keyword clusters** (Reggio, bilingual, emotional
   literacy, in-home/boutique, yoga, ages, etc.) and you'd voluntarily cap
   yourself at one. This is the single biggest self-inflicted wound.
2. **The Instagram embed sabotages Core Web Vitals.** A live IG feed is
   render-blocking third-party JS + layout shift + slow LCP — it kills the exact
   performance edge Astro was chosen for. (Fix: static curated grid or a
   lite/lazy embed.)
3. **No top-of-funnel capture.** No resources/blog = you ignore parents who are
   3–6 months out, searching "what is Reggio Emilia," "how to choose a preschool,"
   "when should my child start preschool." CEFA captures these with its Resource
   Hub. A splash captures only people already ready to convert.
4. **E-E-A-T left on the table.** Valentina is an E-E-A-T goldmine — Master
   Teacher cert, 14+ years, NAEYC, a real pedagogy. Google rewards demonstrated
   expertise. A splash buries it; a proper founder/author entity + cornerstone
   content compounds topical authority.
5. **No internal linking.** Internal links are a core ranking signal. One page
   has none. Hub-and-spoke creates dozens of relevant internal links for free.
6. **Testimonials as decoration, not schema.** Marked up as `Review` +
   `AggregateRating`, they can produce **star-rating rich snippets** in search
   (big CTR lift) and reinforce the map pack. As plain text, they're invisible to
   search.
7. **Awards with no schema = invisible.** A pretty logo strip does nothing for
   SEO. Awards belong in structured data + a linkable mention.
8. **Local fundamentals treated as footer garnish.** NAP, hours, map embed, and
   `LocalBusiness`/`ChildCare` schema are load-bearing for local SEO, not footer
   afterthoughts.

Bottom line: the splash is a great *conversion* artifact and a poor *discovery*
strategy. We need both.

---

## 2. The architecture: hub-and-spoke

```
HOME (hub) ── targets "preschool Culver City" + brand; the conversion splash
│
├── Approach (pillar)
│   ├── Reggio Emilia-Inspired Philosophy   → "Reggio preschool Los Angeles"
│   ├── Emotional Literacy / Social-Emotional → "social emotional preschool LA"
│   └── Bilingual / Daily Spanish            → "bilingual preschool Culver City"
│
├── Programs (pillar)
│   ├── Toddler (15 mo–3 yr)                 → "toddler program Culver City"
│   ├── Preschool / Pre-K (3–5 yr)           → "preschool 3-5 West LA"
│   └── Enrichment (yoga, music & dance,     → "preschool with yoga / music
│       gardening, cooking, art)                near me" (ultra-low competition)
│
├── A Day in the Life                        → "what a preschool day looks like"
├── Meals & Nutrition                        → "preschool that provides meals"
├── Our Educators / Meet Valentina (E-E-A-T) → Person entity + credentials
├── Testimonials & Reviews (Review schema)   → star snippets
├── Tuition & FAQ (FAQPage schema)           → "preschool cost Culver City"
├── Contact / Book a Tour / Join Waitlist    → conversion endpoints
│
└── Resources (blog — top of funnel)
    ├── "What is Reggio Emilia?" (cornerstone)
    ├── "How to choose a preschool in West LA"
    ├── "Benefits of a bilingual preschool"
    ├── "When should my child start preschool?"
    └── "Questions to ask on a preschool tour"
```

Each spoke: one keyword cluster, ~600–1,200 words of genuine substance (we already
have most copy from `SOURCE_SITE_AUDIT.md`), photos with descriptive alt text,
schema, a testimonial relevant to that topic, and a CTA. Spokes link to each
other and back to Home; Home links out to all spokes.

---

## 3. Keyword → Strength → Page map (the centerpiece)

| Strength (Valentina has it) | Keyword cluster (people search it) | Page | Competition |
| --- | --- | --- | --- |
| Boutique, in-home, 1:4, 12 kids | "small home daycare / boutique preschool Culver City" | Home + Approach | Low |
| 14+ years, licensed, NAEYC | brand + trust ("best preschool Culver City") | Home, Educators | Med |
| Reggio Emilia-inspired | "Reggio Emilia preschool Los Angeles / near me" | Philosophy | **Low (gold)** |
| Emotional literacy focus | "social-emotional preschool West LA" | Emotional Literacy | **Very low** |
| Bilingual / daily Spanish | "bilingual / Spanish immersion preschool Culver City" | Bilingual | **Low (gold)** |
| Yoga | "preschool with yoga near me" | Enrichment | Near-zero |
| Music & dance | "music and movement preschool LA" | Enrichment | Low |
| Organic gardening | "gardening preschool Culver City" | Enrichment | Near-zero |
| Cooking | "cooking class preschool LA" | Enrichment | Near-zero |
| Ages 15 mo–5 yr | "toddler daycare / preschool 90034" | Programs (by age) | Med |
| Meals provided | "preschool that provides meals/lunch" | Meals & Nutrition | Low |
| Founder credentials | E-E-A-T / author authority | Meet Valentina | n/a (authority) |
| 8 strong testimonials | star rich snippets + map pack | Testimonials | n/a (CTR) |
| BusinessRate "Top 3 2026" badge (Google Reviews) | trust/credibility + reinforces reviews strategy | Home, Testimonials | n/a (trust) |

The "gold" / "near-zero" rows are the unfair advantage: real strengths almost
nobody else in West LA is optimizing for. We can own them fast.

---

## 4. Leverage Valentina 100% — strengths → SEO assets

- **Founder credentials (Master Teacher, BA, 14 yrs, NAEYC)** → a "Meet Valentina"
  page with `Person` schema; she becomes the **author/byline** on every Resources
  article → builds E-E-A-T and topical authority Google rewards.
- **Reggio depth** → a cornerstone "What is Reggio Emilia?" guide. It ranks for a
  broad informational term *and* positions her as the local expert, funneling
  readers to the enrollment CTA. This is the highest-leverage single asset.
- **Bilingual / Spanish** → **publish key pages in Spanish too** (`hreflang`
  es/en). LA has a massive Spanish-speaking parent market that competitors ignore
  entirely. This can ~2x the addressable search audience — a genuinely unique lever.
- **Emotional literacy** → an ownable category almost no local competitor claims;
  cheap to rank #1 for, and a real differentiator in copy.
- **Daily photos / newsletter / assessments** → fuel **weekly Google Business
  Profile posts** and fresh on-site content (GBP activity is a ranking factor).
- **8 testimonials** → `Review` + `AggregateRating` schema for star snippets, plus
  seeds for a reviews engine (below).
- **BusinessRate "Top 3 2026" badge (powered by Google Reviews)** → a real,
  third-party trust signal. Display the clean badge on Home + Testimonials, and
  it directly validates the **reviews engine** push (the award is literally driven
  by Google review quality/volume — more reviews compounds both ranking *and* the
  badge).
- **Geo targeting — two neighborhoods, not one:** her site says *Culver City /
  West LA* but the badge classifies her under **Mid-City, Los Angeles**, and the
  ZIP is **90034 (Palms/Culver City border)**. Target **all three** in copy, GBP
  service area, and page metadata to widen local coverage.
- **"No child left behind" / anti-corporate intimacy** → the brand voice across
  all copy; protects the moat while we add structure (don't go corporate).

---

## 5. Off-site SEO — the biggest single lever

For a hyperlocal childcare business, the **map pack (Google Business Profile)
sits above organic results** and likely drives most leads. Prioritize it.

1. **Google Business Profile — fully optimized:**
   - Correct primary category (Preschool / Day care center) + secondary
     categories; service area; complete attributes (meals, languages, etc.).
   - 20+ high-quality photos; **weekly posts** (events, art, seasonal).
   - Services list = our spoke topics; seeded Q&A; respond to **every** review.
2. **Reviews engine:** systematic ask at pickup (QR code/card) + email follow-up;
   respond to all; target **Google first, then Yelp**. Review *velocity* and
   *recency* are ranking + trust signals. (She has glowing parents already.)
3. **Citations / directories (NAP-consistent):** Yelp, Care.com, Winnie, Bing
   Places, Apple Maps/Business Connect, Nextdoor, NAEYC directory, Yahoo. Exact
   same Name / Address / Phone everywhere.
4. **Local backlinks:** Culver City Chamber, local parenting blogs/mom groups,
   NAEYC, partner small businesses, local press. A handful of relevant local
   links outperforms volume.

### 5a. Tech employer audience — local SEO expansion (exploration)

> **Status:** strategy / content roadmap — not yet implemented on-site.  
> **Goal:** reach dual-income and hybrid-schedule parents who work in Culver
> City's media/tech cluster (Sony, Amazon MGM, HBO/WBD, Apple TV+, Pinterest,
> TikTok, and Playa Vista / Silicon Beach commuters) without thin "employer
> landing pages" or implied corporate endorsements.

**Why the location fits:** 6100 Hargis St is in **Palms (90034)**, on the Culver
City border — roughly 1 mile from downtown Culver City, walkable to **Palms/National
Metro (E Line)**, and inside the commute shed for the Washington Blvd / Venice Blvd
office corridor (Culver Studios, Sony, Ivy Station, Apple’s Culver Crossings build-out).

**Audience segments to message differently:**

| Segment | Where they work / live | What they search for |
| --- | --- | --- |
| Studio & streaming staff | Sony, Amazon, HBO at Ivy Station | Full-day hours, tour availability, Reggio credibility |
| Tech & product (Apple, Pinterest, startups) | Culver City + Palms renters | Bilingual exposure, boutique feel, fast tour response |
| Silicon Beach commuters | Google / Playa Vista, Marina del Rey | "Westside" + Reggio; willing to drive for fit |
| Relocating hires | New job → new neighborhood | "Preschool near me," Palms/90034, urgent tours |

**Positioning (no capacity/ratio lead):** boutique, Reggio-inspired, daily Spanish,
meals included, **7:30 AM – 6:00 PM**, 14+ years same director, NAEYC member,
license #197417501. Lead with **hours, pedagogy, bilingual, and commute convenience**
— not headcount stats.

**Keyword clusters to earn (site + GBP + reviews):**

- Geo + modality: `boutique preschool Culver City`, `preschool Palms 90034`, `Reggio preschool West LA`, `bilingual preschool Culver City`
- Working-parent logistics: `preschool extended hours Culver City`, `preschool meals included West LA`, `toddler program 15 months Culver City`
- Landmark-adjacent (use in blog/FAQ/reviews, not doorway pages): `preschool near Culver City Metro`, `childcare near Culver City studios` — describe proximity honestly; never claim official employer partnerships

**Google Business Profile (highest leverage):**

- Service area: Culver City, Palms, Mar Vista, West LA, Mid-City, Playa Vista, Cheviot Hills, 90034, 90232
- Description: hours, Reggio + bilingual + meals, Palms/Metro proximity, "families working in Culver City's creative offices"
- Weekly posts: tours, enrichment, bilingual moments, seasonal open houses
- Seed Q&A: full-day hours, ages accepted, parking/drop-off, Metro access, tour booking
- Reviews: ask families to mention **neighborhood + commute** naturally ("easy from Palms," "short drive from Culver City")

**Website content ideas (Phase 2 Resources / FAQ — no new employer URL spam):**

1. Pillar: *"Choosing a preschool when both parents work on the Westside"*
2. FAQ block (Tuition or Contact): Metro/E Line proximity, hours, meals, ages, parking, response time for tours
3. Blog: *"What Reggio-inspired means on a school tour (checklist)"*
4. Blog: *"Bilingual preschool at home — what daily Spanish looks like for toddlers"*
5. One subtle homepage or tuition FAQ line: many families work in Culver City's media/tech offices — no trademark drops

**Off-site channels:**

- **Referrals** from current families (highest conversion; tech parents share in Slack/parent groups)
- **Parent Facebook / Nextdoor:** Culver City, Palms, Westside working parents — authentic replies only
- **Citations:** Winnie, Care.com, TOOTRiS (Apple backup-care ecosystem discoverability), NAEYC directory, Yelp
- **Relocate touchpoints:** pediatricians and realtors who serve Palms/Culver transfers (one-pager, not ads)
- **Employer HR (long game):** small Culver tenants (100–500 staff) for childcare *resource & referral* under IRS §45F — not "official Amazon preschool"

**Competitive note:** Treehouse Tots (Culver/Playa Vista), Bright Horizons (corporate backup), CCUSD (public Spanish immersion). Win on **director-led stability, Reggio depth, emotional literacy, full-day hours, bilingual daily exposure**.

**90-day priority (marketing ops, not code):**

1. Fully optimize GBP + citation audit (NAP exact)
2. Review campaign: 5–10 recent Google reviews mentioning neighborhood/working parents
3. Publish one Resources pillar for working Westside families
4. Instagram 2×/week: enrichment, bilingual, documentation, meals
5. Referral push to enrolled families; track employer names privately on tours to refine copy

**Do not:** doorway pages per employer (`/preschool-for-apple-employees/`), fake walking-distance claims, or leading public copy with enrollment numbers.

---

## 6. Technical SEO — Astro's home turf

- **Core Web Vitals:** static output, `astro:assets` responsive/optimized images
  (AVIF/WebP), ~zero JS, no render-blocking embeds. **Replace the live IG feed
  with a static curated grid** (or a lazy lite-embed) to protect LCP/CLS.
- **Structured data (JSON-LD):**
  - `LocalBusiness` → `ChildCare` / `Preschool` (name, address, geo, hours,
    phone, price range, area served) — site-wide.
  - `Person` (Valentina) for E-E-A-T.
  - `Review` + `AggregateRating` (testimonials) → star snippets.
  - `FAQPage` (Tuition/FAQ) → FAQ rich results.
  - `BreadcrumbList`, `ImageObject`, and `Course`/`Service` for programs.
- **Foundations:** `@astrojs/sitemap` (already installed), `robots.txt`,
  canonical tags, descriptive `<title>`/meta/Open Graph per page, semantic
  headings, alt text on every image.
- **Mobile-first** ("near me" is overwhelmingly mobile), fast TTFB on Cloudflare.
- **Real domain** set in `astro.config.mjs` (replace placeholder) before launch.

---

## 7. Conversion layer (the splash still matters)

The Home hub is still the beautiful, fold-based splash from `WEBSITE_PLAN.md` —
hero + features/awards, why-us, testimonials, photo grid — but now:
- It's **one node in a network**, linking out to spokes (and ranking for the head
  term "preschool Culver City").
- Primary CTA = **"Book a Tour" + "Join the Waitlist"** (capture demand even when
  full — spots are scarce).
- Awards become a **thin trust strip + schema**, not a co-headline.
- Every spoke page also carries the CTA, so traffic from *any* keyword converts.

---

## 8. Maintainability (don't rebuild her into a corner)

She's on Weebly because she can self-edit. Pick a content story before building:
- **Recommended:** a lightweight **Git-based / headless CMS** (e.g. Astro content
  collections + a CMS like Decap/Keystatic/Sanity) so she can edit copy, photos,
  testimonials, and post Resources articles herself.
- **Minimum:** static evergreen site + **Instagram + GBP posts** carry all the
  "dynamic" updates; structural changes route through a developer.
- Resources/blog only pays off if articles actually get published — assign an
  owner (her, with the CMS) or it dies.

---

## 9. Phased rollout

**Phase 1 (launch, weeks 1–3):**
- Home hub (splash) + core spokes: Philosophy, Bilingual, Emotional Literacy,
  Programs (by age), Enrichment, Meet Valentina, Testimonials, Tuition/FAQ,
  Contact/Tour/Waitlist.
- Full technical SEO + schema; Google Business Profile claimed & optimized;
  citations started; reviews engine kicked off.
- Tour + waitlist forms (no backend: Cloudflare Pages Functions / form service).

**Phase 2 (months 2–4):**
- Resources/blog cornerstone content (Reggio guide first), CMS for self-editing,
  Spanish-language pages (`hreflang`), ongoing GBP posts + review velocity.

**Phase 3 (later, demand-driven):**
- The "system" — but **re-scoped toward parent communication** (photos,
  newsletters, assessments she already does manually) over online enrollment,
  which is marginal for 12 seats. Add enrollment/capacity only if demand proves it.

---

## 10. Verdict

The splash-only plan optimizes the easy 20% (a pretty page) and leaves the
leverage on the table. The strongest position is a **hub-and-spoke local SEO site
where every one of Valentina's real strengths becomes a page that ranks** —
anchored by an optimized Google Business Profile and reviews, served fast by
Astro, and bilingual to double the market. The splash becomes the conversion
layer, not the whole strategy. That's how we win "preschool near me" in Culver
City / West LA *and* leverage 100% of what makes her special.


---

# 4. Website Plan

> The original splash-page vision. Translates the vision into concrete sections.
> Pairs with `SOURCE_SITE_AUDIT.md` (content source of truth) and
> `COMPETITOR_ANALYSIS.md` (patterns to borrow).
> Last updated: 2026-06-19

> ⚠️ **Status / what was actually built:** this single-page splash idea was
> **superseded by the hub-and-spoke architecture in `SEO_STRATEGY.md`**, which we
> implemented. The splash now lives on as the **Home hub** (`/`) — hero, why-us,
> testimonials, IG grid — while each "fold" of substance became its own dedicated
> SEO page (Philosophy, Emotional Literacy, Bilingual, Programs, Enrichment,
> Educators, Testimonials, Tuition/FAQ, Contact). Read this doc for the Home
> content intent; read `PROJECT_STATUS.md` for the actual page list. **Note:** the
> hero no longer leads with "12 children / 1:4 ratio" (client direction).

---

## 1. Strategy in one line

A fast, beautiful **single-page splash** that sells the boutique experience and
funnels every visitor to one action — **Book a Tour / Enroll** — backed by simple
sub-pages (pricing per age, etc.) for v1, with an **online enrollment system in
Phase 2**.

Positioning (from competitor analysis): *the warm, home-like, 1:4 alternative to
corporate/cookie-cutter preschools — where no child gets left behind.*

---

## 2. v1 — The splash landing page

A scroll-driven landing page built in "folds" (full-viewport-ish sections).
Primary CTA appears in fold 1 and repeats in the sticky header + footer.

### Fold 1 — Hero: killer features + awards
- Warm photo/video background or hero image.
- Headline = the slogan: *"Childhood is not a race — every child develops at their
  own pace and grace."*
- Subhead: the killer features, scannable (⚠️ **updated** — no longer leads with
  the ratio per client direction):
  - Ages **15 months–5 years** · **Reggio-inspired**
  - **Bilingual** (daily Spanish) · enrichment **included** in tuition
  - **Emotional-literacy** focused · meals provided
  - *(Boutique/known-here feel carries through copy, not as a headline stat.)*
- **As-built hero stats** (`/`): **14+ years**, **2 languages**, **Top-3 award**,
  **100% enrichment included** — replacing the old capacity/ratio stats.
- **Award badge** — her **BusinessRate "Top 3 2026 Award Winner"** badge
  (Preschool · Mid-City, Los Angeles · *Powered by Google Reviews*). It's **one**
  Top-3 *ranking* badge, not three separate awards. Display as a trust element
  (badge image + short caption), not a co-headline.
  *(Need from client: the clean, non-"SAMPLE" watermarked badge image — see §6.)*
- **Primary CTA button: "Book a Tour" / "Enroll"** → enrollment funnel (§4).
- Secondary trust line: *Licensed #197417501 · NAEYC Member · 14+ years.*

### Fold 2 — Why Valentina's (high-value substance)
The "extremely high value" facts that build trust:
- **14+ years** serving Culver City / West LA (longevity stat).
- **Type of education**: Reggio Emilia–inspired, emotional literacy, the "Hundred
  Languages," documentation binders per child.
- **Enrichment included in tuition**: Spanish, music & dance, yoga, organic
  gardening, cooking, art, science.
- **Whole-child outcomes**: kindergarten/Pre-K readiness, self-regulation,
  bilingual progress.
- **Meals provided** (no cold lunchbox), strong parent communication (daily
  photos, monthly newsletter, ~6-month assessments).
- Presented as a **stat band + pillar cards** (CEFA-style), kept boutique-scale.

### Fold 3 — Testimonials
- The **8 attributed reviews** from `SOURCE_SITE_AUDIT.md` (name + location +
  date), shown as a carousel or masonry wall (CEFA-style, scaled down).
- Pull 2–3 punchy quotes as large featured callouts.

### Fold 4 — Instagram potpourri
- A grid/gallery "potpourri" of Instagram photos (daily life, art, activities).
- Either an Instagram feed embed or a curated image grid.
  *(Need from client: Instagram handle / whether to embed live vs. curated grid.)*
- Caption reinforces: *"A peek into a typical week at Valentina's."*

### Global elements
- **Sticky header**: logo · short nav (Why Us · Programs · Testimonials · Contact)
  · persistent **Enroll** button.
- **Footer**: address + map, phone, email, hours, license #, NAEYC, social links.
- Performance + SEO baked in (Astro static, optimized images, `LocalBusiness` /
  `ChildCare` structured data, Open Graph) — our edge over slow competitor sites.

---

## 3. v1 — Supporting sub-pages (lean, competitor-style)

Keep these simple for v1. Lean on competitor structures (Sunshine, Little Dreamers).

- **Programs & Tuition** — age-segmented cards + **price per age** (competitor-style):
  - Toddler-ish (15 mo–3 yr) / Preschool (3–5 yr) — final segmentation TBD.
  - Pricing model & numbers needed from client (see §6). v1 can mirror
    competitors: price per age/schedule, plus fees (registration, etc.).
- **Our Educators** — bios + credentials (confirm roster; "Angelica"?).
- **Contact / Enroll** — form, phone, email, address, embedded map, hours.
- (Optional) **FAQ** — hours, tuition policies, sick/vacation, closed dates
  (pattern from Little Dreamers).

> Note: folds 1–4 can also *be* anchor sections of the one landing page, with the
> sub-pages as deeper dives linked from each fold. Default plan: **one landing
> page + Programs/Tuition + Contact** for v1; expand later.

---

## 4. The enrollment funnel (v1)

CTA in fold 1 → an **actionable enlistment flow**. v1 = low-friction, no backend
required:

1. **"Book a Tour / Enroll" CTA** → dedicated section/page with an inquiry form.
2. **Inquiry form** captures: parent name, email, phone, child's age/DOB,
   desired start date, preferred schedule, message.
3. Submission → email to Valentina (via a form service: Formspree / Web3Forms /
   Cloudflare Pages Functions) + autoresponder to parent.
4. Follow-up steps shown (mirrors competitors): **Tour → Application →
   Orientation** (Little Dreamers' funnel works well).

This satisfies "more actionable enlistment system" without Phase 2 complexity.

---

## 5. Phase 2 — Online enrollment system

A real system layered on once v1 is live. High-level scope:

- **Class/capacity model**: classes/age groups, **seats per class**, **open
  spots** vs. filled, waitlist.
- **Live availability**: show which age groups have openings ("2 spots in
  Preschool").
- **Online enrollment**: parents apply/enroll for a specific class/start date;
  status tracking (applied → toured → offered → enrolled → waitlisted).
- **Admin/back office**: Valentina manages rosters, capacity, roles/staff,
  schedules; approve/decline applications.
- **Possible extras**: deposits/payments, parent portal (photos, newsletters,
  assessments — things she already does manually), document collection.
- **Tech direction**: Astro supports this via SSR + a backend/DB (e.g.
  Cloudflare D1 / a hosted DB) without a rewrite — this is *why we chose Astro*.

Phase 2 is intentionally deferred; v1 ships first.

---

## 6. Open items needed from client (blocking polish, not the build)

> Several originally-open items are now resolved (✅). Remaining client items are
> consolidated in `PROJECT_STATUS.md` → "What's left."

1. **Award badge** — the clean (non-"SAMPLE"/watermarked) BusinessRate "Top 3
   2026" badge image. *(Currently represented as a styled trust element.)*
2. **Photos** — real classroom/activity/art photos for hero + IG grid.
   ✅ *Placeholder system built (vetted Pexels/portraits); one-line swap later.*
3. ✅ **Instagram** — `@valentinaspreschool`; decision = **static curated grid**
   (not a live embed) to protect Core Web Vitals.
4. **Pricing** — confirm ~$350/wk + $300 app fee (from listings) before
   publishing. ✅ *Tuition/FAQ page built with these as provisional figures.*
5. ✅ **Hours** — 7:30 AM–6:00 PM (confirm); in `site.ts` + Contact page.
6. **Staff roster** confirmation (is "Angelica" current?).
7. **Logo** — approve hand-lettered wordmark direction. ✅ *Colors + fonts
   decided and implemented (see `BRAND.md`); temporary "V" favicon in place.*
8. ✅ **Domain** — `valentinaspreschool.com` set in `astro.config.mjs` (client to
   purchase + point DNS).
9. **Social links** (Yelp, Facebook, etc.) for footer.
10. **Contact email** — still blank (`nap.email` in `site.ts`).

---

## 7. Build order (proposed)

1. Brand/layout shell: header, footer, fonts, colors, base layout component.
2. Fold 1 hero (+ awards placeholder + CTA).
3. Fold 2 "Why Us" (stat band + pillars).
4. Fold 3 testimonials.
5. Fold 4 Instagram grid.
6. Enrollment form + funnel.
7. Programs & Tuition page.
8. SEO/structured data + performance pass.
9. Deploy to Cloudflare Pages.
10. (Later) Phase 2 enrollment system.


---

# 5. Source Site Audit

> Deep-dive reference of the existing website we are remaking.
> Source: https://valentinaspreschool.weebly.com/ (Weebly-hosted)
> Captured: 2026-06-19

This document captures **all content, structure, and business facts** from the
current live site so we can rebuild it (better) in Astro. Treat it as the
content source of truth until the client provides updated copy/assets.

---

## 1. Business snapshot (facts)

| Field | Value |
| --- | --- |
| **Business name** | Valentina's Preschool (a.k.a. "Valentina's Daycare & Preschool") |
| **Tagline (current)** | "serving community for over 14 years" |
| **Hero slogan** | "Childhood is not a race, every child develops at their own pace and grace." |
| **Type** | Boutique-style, small in-home preschool / daycare |
| **Location area** | Culver City / West Los Angeles |
| **Address** | 6100 Hargis St, Los Angeles, CA 90034 |
| **Phone** | 310.839.9147 |
| **License #** | 197417501 |
| **Affiliations** | NAEYC member |
| **Capacity** | 12 children at a time |
| **Teacher-to-child ratio** | 1:4 |
| **Ages served** | 15 months to 5 years |
| **Meals** | Provides nutritious meals (breakfast, lunch w/ protein+carbs+veg, afternoon snack) |
| **Languages** | Bilingual environment; daily Spanish |

### Additional facts from third-party listings (verify with client — may be dated)

Sourced from Paper Pinecone and GreatSchools directory listings (2026-06-19):

| Field | Value | Source |
| --- | --- | --- |
| **Director's full name** | **Valentina Gloginic** | Paper Pinecone |
| **Hours** | **7:30 am – 6:00 pm** | Paper Pinecone |
| **Tuition** | **~$350 / week** (5 days, full-time, 17 mo–5 yr) | Paper Pinecone |
| **Application fee** | **$300** | Paper Pinecone |
| **Schedules offered** | 2 / 3 / 5 days | Paper Pinecone |
| **Sibling discount** | Yes | Paper Pinecone |
| **Childcare subsidies** | Accepted | Paper Pinecone |
| **Meals** | Breakfast, Lunch, Snacks (included) | Paper Pinecone |
| **Languages** | English, Spanish (Spanish immersion) | Paper Pinecone |
| **Philosophy (tagged)** | Reggio Emilia, Play-Based, RIE, HighScope, Creative Curriculum, Outdoor/Nature-based, Spanish Immersion | Paper Pinecone |
| **Enrichment (tagged)** | Yoga & dance, art, Spanish, gardening | Paper Pinecone |
| **Admissions** | Rolling, year-round, full day | Paper Pinecone |
| **School-age distance learning** | Supported (yes) | Paper Pinecone |
| **Age range (inconsistent!)** | 15 mo–5 yr (own site) · 17 mo–6 yr · 18 mo–5 yr | varies — **confirm** |
| **Award** | BusinessRate "Top 3 2026" – Preschool, Mid-City LA (powered by Google Reviews) | badge image |
| **Listed on** | GreatSchools (id 32418, "Claimed" status TBD), Paper Pinecone | directories |

> The award (**BusinessRate**) is a free, public, Google-Reviews-based ranking
> (no pay-to-play to appear; the plaque is an optional paid item). Rankings update
> frequently. Use it as a *linked, verifiable trust badge*, not a hero claim.
> Best to link any on-site badge to her live BusinessRate ranking page.

### SEO / metadata observed
- Page `<title>` pattern: `"<Page Name> - valentinaspreschool serving community for over 14 years"`
- Homepage title: `"valentinaspreschool serving community for over 14 years - Childcare Preschool in Culver City CA"`
- Platform: Weebly (has default "Powered by Create your own..." footer, and a
  vestigial "YOUR CART" / search widget — both should be **dropped** in the rebuild).

---

## 2. Site structure / navigation

The current nav has **6 items** (no dedicated Contact or Enroll page — contact
info lives only in the homepage body):

1. **Home / Mission statement** → `/`
2. **Our Educators** → `/our-educators.html`
3. **Philosophy** → `/philosophy.html`
4. **Enrichment Programs** → `/enrichment-programs.html`
5. **Emotional literacy** → `/emotional-literacy.html`
6. **Testimonials** → `/testimonials.html`

### Weebly cruft to remove in rebuild
- "Search by typing & pressing enter" search box
- "YOUR CART" e-commerce widget (unused)
- "Powered by Create your own unique website..." footer

### Recommended improvements (gaps to fill)
- A real **Contact / Enroll** page (form + map + hours).
- **Hours of operation** (not stated anywhere on current site — need from client).
- **Tuition / pricing** info (not stated — need from client).
- Photo **gallery** (testimonials reference daily photos & art projects; the
  current site is very text-heavy with few/no images surfaced).
- Structured data: `LocalBusiness` / `ChildCare` schema, Google Business Profile.

---

## 3. Page-by-page content (verbatim source copy)

### 3.1 Home / Mission statement (`/`)

**Hero heading:**
> Childhood is not a race, every child develops at their own pace and grace.

**Body:**

We are a boutique-style, small preschool located in the Culver City / West Los
Angeles area. We serve 12 children at a time, and our teacher-to-child ratio is
1:4. We accept children from fifteen months to five years of age. We are a small,
boutique-style preschool in the Culver City / West Los Angeles area.

We believe that children learn through active exploration and play and a child's
self-esteem is built on mutual respect between us all, adults and children. Our
curriculum covers an introduction to language arts, social studies, math,
science, organic gardening, cooking projects, yoga, gymnastics, Spanish language,
music, and movement.

Our mission is centered on ensuring that your child feels safe, well cared for,
and valued. We prioritize transparency and consistency in our methods, building
strong partnerships with families to support children in reaching their fullest
potential. Through nurturing curiosity, fostering familiarity, and promoting
predictability, we cultivate an environment where comfort and confidence
naturally lead to connection, social awareness, and self-regulation.

We provide nutritious meals because we believe no preschooler should have to
settle for a cold lunch from their lunchbox. With our low children-to-teacher
ratio, we can dedicate personalized attention to each child, focusing on their
individual needs and growth.

**Contact info (footer of homepage):**
- 6100 Hargis St, Los Angeles, CA 90034
- Tel: 310.839.9147
- License # 197417501
- NAEYC member

---

### 3.2 Our Educators (`/our-educators.html`)

**Valentina G. — Founder & Director**
The driving force behind Valentina's Preschool, with over a decade of dedication
to the community. Holds a Bachelor's Degree and an On-site Supervisor / Master
Teacher certificate with California Teacher Credentialing. Also a music, dance,
and yoga teacher for young children. Passionate about positive discipline
practices to help children grow well-rounded social-emotional skills and
emotional intelligence. Continuously improves her expertise through cutting-edge
child-development science classes.

**Ashley A. — Teacher**
Holds an Associate Teacher certificate and permit from California Teacher
Credentialing. Deeply passionate about working with young children; brings
creativity and uniqueness, implementing an effective and engaging learning
environment.

**Milagros B. ("Mila") — Teacher's Assistant**
A dedicated member of the school for nearly a decade. Background as a social
worker in Peru and 15+ years as a Teacher's Assistant in Los Angeles. Known for
deep care and establishing healthy routines; described as the backbone of the
preschool.

**Slavica P. — Art Teacher**
Attended art school in Belgrade, Serbia, and holds an MS in Anthropology. Former
kindergarten art educator. Helps children express their talents by creating
beautiful art pieces, adding a unique artistic dimension to the school.

**Closing statement:**
At Valentina's Preschool, we believe in continuous improvement and strive to
create an environment where children not only learn but flourish emotionally,
socially, and creatively. Our team is committed to providing the best possible
foundation for the success and resilience of every child.

> Note: testimonials also mention an educator named **Angelica** (not on the
> current Educators page — confirm whether still on staff).

---

### 3.3 Philosophy (`/philosophy.html`)

Key ideas (Reggio Emilia-influenced — "Hundred Languages" reference):

- **Learning is a process** of figuring things out, making connections, getting
  ideas and testing them, taking risks, making mistakes without fear of ridicule,
  and trying again. An optimum environment provides opportunities to explore and
  investigate questions and ideas.
- **The teacher is a collaborator/supporter**, not a controller of learning.
  Respects and trusts learners, talks with them, provides interaction
  opportunities, models learning, supports risk/mistake-making, celebrates good
  ideas, and helps troubleshoot. Gives children time to investigate their own
  ideas; is a flexible, patient observer.
- **Multiple truths** — because the world is complicated, exploration can yield
  multiple truths. Offers both group activities and privacy to work individually.
- **Family involvement is essential** — works closely with parents; organizes
  potluck events to build a community of children, parents, and teachers; invites
  parents with special skills to do classroom demonstrations.
- **The Hundred Languages** — children express themselves in a hundred ways
  (painting, drawing, sculpting, dance, movement, pretend play). Each must be
  valued and nurtured; teachers stay open-minded to each child's special talent.
- **Math** is presented logically, understandably, and excitingly.
- **The teacher observes and responds** to each child's interests and needs,
  providing a stimulating, beautiful environment; an explorer who participates
  without controlling.
- **Documentation** — part of the dialogue with children, parents, and teachers.
  Every child gets a **binder upon enrollment** where projects and notes are saved.

---

### 3.4 Enrichment Programs (`/enrichment-programs.html`)

> **All enrichment programs are part of the regular tuition.**

- **Spanish language** — second-language acquisition boosts verbal communication,
  math/reasoning, cultural awareness, and academic/professional outcomes.
- **Music & Dance** — supports motor skills, language, literacy, memory, and
  self-expression; helps body and mind work together.
- **Yoga** — builds body consciousness, stress management (breathing, awareness,
  healthy movement), concentration, confidence, and positive self-image in a
  healthy non-competitive group.
- **Organic Gardening** — planning, planting, watering, and watching plants grow
  gives kids purpose and responsibility; eating something they grew builds
  priceless self-esteem.
- **Cooking** — a basic life skill that teaches math (counting, measuring),
  sensory exploration, and openness to new tastes.

> Note: the homepage also lists **gymnastics**, **science**, **social studies**,
> and **language arts** as part of the curriculum — consider folding these into
> the programs/curriculum section.

---

### 3.5 Emotional Literacy (`/emotional-literacy.html`)

- Throughout daily interactions, the school **intensely coaches emotional
  literacy**: the ability to identify, understand, and respond to emotions in
  oneself and others in a healthy manner.
- Benefits cited: children are healthier, tolerate frustration better, fight
  less, show less destructive behavior, are less lonely, more focused, less
  impulsive, and show greater academic achievement.
- Teachers help children **self-regulate** by noticing triggers that come with
  strong emotions.
- Preschool-age basics taught: social interactions ("hi"/"bye"), taking turns,
  "sorry / please / thank you," and problem-solving.
- Focus on resolving interpersonal conflicts **peacefully and non-violently**.
- Teachers **model compassionate behavior**, set the tone, and demonstrate
  kindness, generosity, thoughtfulness, and understanding.
- Children are encouraged to express feelings positively and show empathy.

---

### 3.6 Testimonials (`/testimonials.html`)

Seven reviews (most recent first). Reproduced with attribution + date for reuse.

1. **Meggy F. — July 21, 2023**
   Spectacular multi-year experience; sad to graduate. Chose Valentina's over
   "corporate / cookie-cutter" preschools for a nurturing, individualized,
   home-like, inclusive environment where "no child gets left behind." Praises
   Valentina's passion, accommodation of specific needs, weekly art projects,
   gardening/dance/yoga/art/learning, and birthday celebrations. As a single mom,
   deeply trusts Valentina.

2. **Hannah W. (Los Angeles, CA) — Aug 23, 2022**
   2-year-old son's first daycare; born during the pandemic and clingy. Staff
   welcomed and settled him quickly. Praises daily photos and monthly newsletter.
   Would have stayed until age 5 if not moving abroad. Thanks Valentina, Slavica,
   Angelica, and Milagros (Mila also a great babysitter).

3. **Cindy A. (South Los Angeles, CA) — Aug 30, 2022**
   Daughter started at age 2; learned ABCs, numbers, Spanish, yoga. Now advanced
   at her new school. "Choose Valentina's preschool, they're the best!"

4. **Diana D. (South Los Angeles, CA) — June 18, 2022**
   Switched in Fall 2020 for the safe in-home setup during the pandemic; praises
   safety protocols and hygiene/self-care teaching. Daughter thrived with focused
   attention, daily Spanish, Friday backpack of artwork/math/tracing, ~6-month
   assessments, and smooth Pre-K application support.

5. **R S. (Los Angeles, CA) — Dec 23, 2020**
   Daughter started at 1.5 years, stayed 2 years. Exposure to phonics, letters,
   numbers, gardening, yoga, exercise, group play, dancing, music, creative play,
   painting, self-care, and emotional control. Highly recommends.

6. **Karina D. (Los Angeles, CA) — Sept 7, 2017**
   Both kids love it; ~10 children with 3 teachers = lots of attention. Lists
   extensive activities (songs, drawing, tracing, playdough, collage, cooking,
   baking, letters, Spanish, planting, wind flags, birdhouses, dental hygiene,
   science experiments, butterflies, seasons, days of the week, counting). Praises
   bilingual progress, provided meals, detailed parent communication, respectful
   non-intimidating discipline (Valentina kneels to child's level), and daily
   photo texts.

7. **Paige M. (Culver City, CA) — July 5, 2016**
   Daughter thrived; gentle encouragement of speaking and social skills, support
   through becoming a big sister. As a teacher herself, appreciates the weekly
   thematic units (e.g., "polar bears" + ice caps). Highly recommends.

8. **Elisha S. (Los Angeles, CA) — Oct 2, 2015**
   Daughter attended 2 years; loves it. Appreciates occasional photo texts,
   support through potty training and behavior as first-time parents, and learning
   colors, alphabet, numbers. "Home away from home," comes home happy with weekly
   art. Highly recommended.

> (Eight reviews total — count for the rebuild's testimonials section.)

---

## 4. Content themes for the rebuild

Recurring selling points to emphasize in the new site:

- **Small / boutique / home-like** (12 kids, 1:4 ratio, individual attention)
- **Emotional literacy & positive discipline** (differentiator vs. corporate
  preschools)
- **Rich enrichment included in tuition** (Spanish, music/dance, yoga, gardening,
  cooking, art, science)
- **Reggio Emilia-inspired philosophy** ("Hundred Languages," documentation
  binders, child-led exploration)
- **Strong parent communication** (daily photos, monthly newsletter, ~6-month
  assessments, Friday art backpacks, potlucks)
- **Bilingual** environment / daily Spanish
- **Nutritious meals provided**
- **Pre-K readiness** (successful transitions, application support)
- **Trust & longevity** (14+ years, NAEYC member, licensed, experienced staff)

---

## 5. Open questions for the client (before rebuild)

1. Keep the name "Valentina's Preschool" and slogan, or rebrand?
2. ~~Hours~~ → **7:30 am–6:00 pm** per listings — **confirm** still accurate.
3. **Tuition** → ~$350/wk + $300 app fee per listings — **confirm** & decide
   whether to publish on site or say "contact for pricing."
4. **Enrollment process** — add an inquiry/waitlist form? Online enrollment later?
5. **Photos** — can we get real classroom/activity/art photos? (current site is
   text-heavy) — still needed.
6. **Staff roster** — confirm current educators (is "Angelica" still on staff?).
7. **Age range conflict** — own site says 15 mo–5 yr; listings say 17 mo–6 yr /
   18 mo–5 yr. Which is correct?
8. Single location only (6100 Hargis St)? Confirm for local SEO + map embed.
9. Social media / Google Business Profile / Yelp links to include?
10. **BusinessRate badge** — does she want it featured? If so, link to her live
    ranking page (and optionally buy the clean digital asset). Confirm she's OK
    with the "Mid-City LA" geo label it uses.
11. Confirm **director name spelling: "Valentina Gloginic"** (from listings).
12. **Subsidies & sibling discount** — confirmed accepted per listings; feature?


---

# 6. Competitor Analysis

> Deep audit of four reference sites to inform the Valentina's Preschool rebuild.
> Captured: 2026-06-19

Sites analyzed:
1. **CEFA** — https://cefa.ca/ (aspirational benchmark; large franchise)
2. **Mata House** — https://matahouse.com/ (Reggio Emilia philosophy focus; slow site)
3. **The Sunshine Preschool** — https://www.brentwoodsunshinepreschool.com/ (client reference)
4. **Little Dreamers Childcare** — https://www.little-dreamers-childcare.com/ (client reference; closest peer)

Quick reminder of who we are: Valentina's Preschool is a small, boutique,
licensed **in-home** preschool in Culver City / West LA — 12 kids, 1:4 ratio,
ages 15 months–5 years, Reggio-influenced, emotional-literacy-focused. That makes
**Little Dreamers** our closest direct peer, **Mata House** our closest
*philosophical* peer, and **CEFA** the polished structure we steal patterns from.

---

## 1. At-a-glance comparison

| Dimension | CEFA | Mata House | Sunshine | Little Dreamers | **Valentina's (us)** |
| --- | --- | --- | --- | --- | --- |
| Scale | 50+ schools, franchise | Single boutique (Indonesia) | Established neighborhood | Single in-home | Single in-home |
| Platform | Custom / WordPress-class | Wix-ish, heavy/slow | Squarespace | Wix | (rebuilding in Astro) |
| Visual polish | Very high | High (but slow) | High | Medium | TBD — opportunity |
| Philosophy stated | Proprietary 4-pillar | Reggio Emilia / IEYC | Academics + SEL | Play-based | Reggio-influenced + emotional literacy |
| Ages | 1–6 | 1–6 | 2–5 | 12mo–10yr | 15mo–5yr |
| Pricing shown | No (book a tour) | No | **Yes, detailed** | In FAQ only | No (not yet) |
| Tour-first funnel | Yes | Yes (WA/email) | Yes | **Yes (tour required)** | Should add |
| Parent app / comms | Kindertales app | Instagram | — | — | (daily photos/newsletter today) |
| Meals highlighted | Yes (in-house chef) | Yes (wholefoods) | — | Yes (nut-free, included) | Yes (should highlight) |
| Testimonials | Huge wall (30+) | Section | "Best of Brentwood 2024" | — | 8 strong reviews |
| Social proof badges | Stats (25+ yrs, 6000+ grads) | Founders' story | Award badge | License #, EIN | License #, NAEYC, 14 yrs |

---

## 2. Site-by-site deep audit

### 2.1 CEFA — https://cefa.ca/ (the gold standard)

**What it is:** Core Education & Fine Arts — a 50+ location Canadian franchise.
The most sophisticated site of the group. Worth copying *structure and
conversion patterns*, not scale.

**Information architecture (very thorough):**
- About Us → Philosophy, Our Story, Our Teachers, Franchising
- Programs → All Programs, Baby, JK1, JK2, JK3, Weekend Care, Summer Camps
- Curriculum → Overview + 4 branded pillars
- Subsidies → by province
- Resource Hub → Parent Resources, Research & Insights, In the Media, FAQs
- Careers → Work at CEFA, Teacher Training, Openings
- Store, Find a School (primary CTA, repeated everywhere)

**Homepage flow (a great template):**
1. Hero: "The School for a Lifetime Head Start" + single CTA (Find a School)
2. "The CEFA Difference" trust statement
3. **Stat band**: 25+ years · 50+ schools · 6,000+ graduates · 1,000+ certified teachers
4. Methodology hook ("by age 5, ~90% of brain developed")
5. Curriculum: 4 named pillars, each with photo + blurb + Read More
   - Innovators (STEM/critical thinking)
   - Masterminds (literacy/language)
   - Creators (fine arts/expression)
   - Change-Makers (social intelligence/global citizenship)
6. Programs by age stage (Baby → JK1 → JK2 → JK3 + weekend/summer)
7. Teachers (licensed ECEs, ongoing training)
8. Schools ("thoughtfully designed spaces")
9. **Massive testimonials wall** (30+ detailed, attributed by location)
10. Final CTA: "Book a tour to experience the CEFA difference"
11. Newsletter signup + rich footer

**What they do brilliantly (steal these):**
- **Branded curriculum pillars** — turns generic "we teach STEM/art/literacy"
  into a memorable, ownable system. Valentina's could brand its differentiators
  (emotional literacy, the "Hundred Languages", enrichment).
- **Quantified social proof** stat band near the top.
- **Single, repeated primary CTA** ("Find a School" / "Book a tour").
- **Every program/pillar card has alt-text-rich photos** (great for SEO + a11y).
- **Strong testimonials with attribution** (name + location) → credibility.
- Meals/chef, parent app (Kindertales), allergy safety repeatedly reassured in
  reviews — these are clearly the parent anxieties they target.

**What's overkill for us:** franchising, subsidies by province, store, the sheer
volume. We want CEFA's *polish and funnel*, not its size.

---

### 2.2 Mata House — https://matahouse.com/ (philosophy benchmark)

**What it is:** A boutique Reggio Emilia / IEYC preschool. Beautiful, emotive,
brand-led — but the user flagged it as **slow** (a heavy builder site). Our Astro
rebuild can deliver this *feel* with far better performance.

**IA:** Approach · About Us · Parent Testimonials · Admission · Contact Us
(small, focused — much closer to our scale than CEFA).

**Content & tone (emotional, parent-to-parent):**
- Opens with values words: "Nurturing Hearts, Inspiring Minds, Embracing
  Individuality, Encouraging Hope."
- Leads with a **Loris Malaguzzi quote** (Reggio founder) — signals philosophy
  credibility instantly.
- Founders' story: **"Before everything, we were mothers."** Two working moms
  who built the school they wished existed. Extremely effective emotional hook.
- **Reggio approach explained clearly:** child as "competent, capable, natural
  researcher"; "Environment as the Third Teacher"; authentic play; hands-on
  experiential learning.
- **IEYC 4 learning strands:** Independence & Interdependence; Communication;
  Enquiring; Healthy Living & Physical Wellbeing.
- **Health & Nutrition:** wholefood snacks, fresh filtered water, cutting fruit
  in front of children as a learning moment.
- **Named facilities** (gives a small school a sense of richness): Play Studios,
  Sensory Play Area, Art Atelier, Discovery Atelier, Library, Rumble Gym,
  Sensory Kitchen, Playscape, etc.
- **Classes by age** with clear schedules (Playtots, Nursery, Pre-Kindie, K1, K2).
- Educators described by background (Pedagogy, Child Development, Expressive
  Therapy, Arts).
- Instagram-forward (@matahouse.id).

**What to steal:**
- **Lead with philosophy + a founder story.** This is exactly Valentina's
  strength (Reggio-influenced, a passionate founder-director) and it's missing
  from her current site.
- **Name the spaces/ateliers** — makes an in-home setting feel intentional and rich.
- **Quote-driven, emotional copy** over dry feature lists.
- Reggio language ("Hundred Languages," "environment as third teacher") — which
  Valentina's philosophy page already gestures at but doesn't brand.

**What to avoid:** the performance problems. Heavy images/animations with no
optimization = slow. Astro + optimized images fixes this and becomes a
competitive advantage.

---

### 2.3 The Sunshine Preschool — https://www.brentwoodsunshinepreschool.com/ (client reference)

**What it is:** An established Brentwood / West LA preschool (ages 2–5).
Squarespace, clean and polished, neighborhood-prestige positioning.

**IA (clear, conversion-oriented):**
- About Us → History, Owners, Head of School, Mission & Values, Service Learning, Campus
- Programs → Baby, Toddler, Preschool
- Admissions → Process, Timeline, **Tuition & Fees**
- Cart/checkout present (likely for fees/deposits)

**Homepage:**
- Hero: "Welcome to Sunshine — A Place to Grow, Belong, and Shine."
- Big **image slideshow** (9 photos) — very visual, warm.
- Positioning copy: educates ages 2–5, "nurturing, supportive, engaging,"
  "served the Brentwood community... for generations," "home away from home."
- **Award badge: "Voted Best of Brentwood 2024's Best Preschool."**

**Tuition page (notably transparent — rare and trust-building):**
- Sunshine Baby Group — 10-week session: $950
- Toddler — from $3,330 (1x/wk) to $5,075 depending on schedule
- Preschool — 4 full days/wk: **$30,626**; 5 half days/wk: $24,495
- Additional fees: Student Expense $425; Registration $650; Security $575
  (preschool) / $195 (toddler)
- **Scholarships & financial aid** offered → signals inclusivity + premium.

**What to steal:**
- **Polished photo-led hero / slideshow** (warmth sells childcare).
- **Award/recognition badge** as social proof up top.
- **Structured Admissions: Process → Timeline → Tuition** — a clear funnel.
- **"Home away from home"** language (also fits Valentina's in-home setup).
- Optional pricing transparency (a differentiator vs. CEFA/Mata's "contact us").

**Positioning note:** Sunshine is premium/established and pricey. Valentina's
counter-position is *intimacy and individual attention* (12 kids, 1:4) at
presumably a more accessible price — lean into the boutique, no-child-left-behind
angle the testimonials already prove.

---

### 2.4 Little Dreamers Childcare — https://www.little-dreamers-childcare.com/ (closest peer)

**What it is:** A **licensed in-home** family childcare in LA — the most directly
comparable business to Valentina's (in-home, play-based, similar size, Wix site).

**IA:** Home · About Us · Our Children · Admissions · Educators · Contact
- Branding: "Play. Learn. Grow." · Facility # 197494753 · EIN #86-1388340
- Social: Instagram, Yelp, Facebook (linked in footer).

**Content:**
- **Our Children** segmented by age:
  - Older Infants/Toddlers: 12 months–3 years
  - Preschool: 3–5 years
  - Distance Learning: 5–10 years (an interesting add-on offering)
- **Approach:** "licensed in-home program... quality care... challenge and
  nurture through our play-based approach... prepare them to enter Kindergarten."
- **About → Philosophy:** play-based, curriculum follows children's interests &
  learning styles, hands-on activities, "every child and family is unique."
- **Health & Safety:** explicit COVID/licensing protocols (Community Care
  Licensing, LA County Public Health, CDC).
- **Meal Program:** daily snacks + balanced lunch, weekly menus, **nut-free**,
  included in tuition.
- **Admissions:** "Enrolling Now! Spring & Summer 2026." **Tour required before
  application** → application → orientation. Phone + email CTA.
- **FAQ:** Enrollment Fees, Tuition, Closed Dates/Calendar, sick/vacation tuition
  policy, withdrawal policy. (Pricing kept in FAQ, not a public table.)

**What to steal (directly applicable to us):**
- **Age-segmented "Our Children" cards** — simple, scannable program structure.
- **Prominent license #** (trust/legitimacy for in-home care) — we have a license
  # and NAEYC membership to feature.
- **Tour-required admissions funnel** with phone/email — low-friction for a small
  operator (no complex online enrollment needed at launch).
- **FAQ covering tuition/policies** — answers anxieties without a public price wall.
- **Social proof via Instagram/Yelp/Facebook** links.
- **Meal program + safety** as explicit reassurance sections.

**Where we can beat them:** Little Dreamers' site is thin on copy, emotional
story, and testimonials. Valentina's has *richer* substance (Reggio philosophy,
emotional literacy, named enrichment programs, 8 detailed glowing reviews, a
founder with strong credentials). With CEFA/Mata-level presentation, Valentina's
can clearly out-class the closest peer.

---

## 3. Cross-site patterns (what every good site does)

These are effectively table stakes for the rebuild:

1. **Photo-led, warm hero** with one clear primary CTA.
2. **A single dominant conversion goal:** *Book a Tour* (everyone funnels here).
3. **Philosophy/approach stated clearly and early** (named/branded when possible).
4. **Programs segmented by age** with short, scannable descriptions.
5. **Educators/staff page** with credentials → trust.
6. **Meals + health/safety** reassurance (top parent anxieties).
7. **Testimonials with attribution** (name + location/date).
8. **Trust signals:** license #, years in operation, accreditations, awards, stats.
9. **Easy contact:** phone, email, address, map, hours.
10. **Admissions funnel:** Process → Timeline → (Tuition) → Tour/Apply.
11. **Social links** (Instagram especially — proves daily life at the school).

---

## 4. Gap analysis — what each does that Valentina's currently lacks

| Best practice (seen at) | On Valentina's current site? | Action for rebuild |
| --- | --- | --- |
| Photo-led hero / gallery (all) | No (text-heavy) | **Add** — get real classroom/art/activity photos |
| "Book a Tour" CTA funnel (all) | No | **Add** prominent tour CTA + simple form |
| Founder story (Mata House) | No | **Add** — Valentina's credentials are a strength |
| Branded philosophy/pillars (CEFA, Mata) | Implicit only | **Brand it** (emotional literacy + enrichment + Reggio) |
| Stat/trust band (CEFA) | Partial (14 yrs, license) | **Surface** 14+ yrs · 1:4 ratio · 12 kids · NAEYC |
| Age-segmented programs (Little Dreamers, CEFA) | No | **Add** ages 15mo–5yr segmentation |
| Admissions process page (Sunshine, LD) | No | **Add** Process → Timeline → Tour |
| Tuition / FAQ (Sunshine, LD) | No | **Add** at least an FAQ (pricing optional) |
| Meals/safety sections (Mata, LD) | Mentioned on home only | **Elevate** to their own sections |
| Testimonials with attribution (all) | Yes (8, strong) | **Keep & feature** prominently |
| Social links / Instagram (Mata, LD) | No | **Add** if accounts exist |
| Fast performance (vs. slow Mata) | Weebly = mediocre | **Astro win** — fast by default |
| Local SEO / structured data (none do well) | No | **Add** LocalBusiness/ChildCare schema → out-rank them |

---

## 5. Strategic recommendations for the Valentina's rebuild

**Positioning:** "The boutique, home-like preschool where no child gets left
behind." Intimacy (12 kids, 1:4) + emotional intelligence + Reggio-inspired
exploration — a warmer, more individualized alternative to big/corporate
preschools (a theme parents literally cite in the testimonials).

**Proposed sitemap (synthesizing the best of all four):**
- **Home** — photo hero, slogan, trust band (14+ yrs · 1:4 · 12 kids · NAEYC ·
  licensed), philosophy teaser, enrichment teaser, testimonial highlights,
  Book-a-Tour CTA.
- **Our Philosophy** — Reggio-influenced approach + emotional literacy (branded),
  founder story woven in.
- **Programs & Curriculum** — age-segmented (15mo–5yr) + enrichment (Spanish,
  music/dance, yoga, gardening, cooking, art) "all included in tuition."
- **Our Educators** — bios + credentials (confirm current roster).
- **A Day at Valentina's / Gallery** — photos, daily rhythm, meals, named spaces
  (Mata-style), parent communication (daily photos, newsletter, assessments).
- **Testimonials** — the 8 existing reviews, attributed.
- **Admissions / Enroll** — Process → Timeline → Tour form (+ FAQ: hours,
  tuition approach, policies).
- **Contact** — phone, email, address, embedded map, hours.

**Competitive edges to exploit:**
1. **Performance + SEO** — beat slow Mata House and builder-bound peers; add
   `LocalBusiness`/`ChildCare` schema none of them do well → win "preschool/day
   care near me" in Culver City / West LA.
2. **Storytelling** — Mata-level emotional founder story + CEFA-level structure,
   which neither local peer (Sunshine, Little Dreamers) fully delivers.
3. **Authentic proof** — 8 detailed, specific testimonials already in hand;
   feature them like CEFA's wall (scaled down).
4. **Intimacy angle** — explicitly contrast with "corporate/cookie-cutter"
   (parents' own words) → our boutique 1:4 ratio is the hero.

**Still needed from client** (carry over from the source audit): real photos,
hours, tuition/FAQ answers, confirmed staff roster, social media handles, and
whether to publish pricing.

---

# 7. Admin Panel

A staff-only management app layered onto the same Astro project. The public
marketing pages stay static and fast; only `/admin/*` and `/api/*` run on-demand
in a Cloudflare Worker. Built on Cloudflare's free tier.

## Architecture

- **Hosting:** one Cloudflare Worker (`@astrojs/cloudflare` adapter). Static
  pages are prerendered to `dist/` and served via the `ASSETS` binding; admin and
  API routes set `export const prerender = false` and execute in the Worker.
- **Database:** Cloudflare **D1** (SQLite), accessed with **Drizzle ORM**. Schema
  in `src/db/schema.ts`; SQL migrations in `drizzle/migrations/`.
- **File storage:** Cloudflare **R2** bucket (`MEDIA` binding) for uploaded
  photos. Served back through `/api/admin/media/[id]/`.
- **Auth:** **Cloudflare Access** (Zero Trust) gates `/admin*` and `/api/admin*`
  at the edge — no auth code, free for <50 users. `src/middleware.ts` is a
  server-side backstop that reads the Access-injected email. Local `astro dev`
  bypasses Access with a placeholder admin email.
- **Bindings** are accessed via `import { env } from "cloudflare:workers"`
  (Astro v6 removed `Astro.locals.runtime.env`). Helpers live in `src/db/index.ts`.

## Modules (all built)

| Area | Routes | Notes |
| --- | --- | --- |
| Dashboard | `/admin/` | counts: new inquiries, enrolled, open seats, outstanding balance |
| Inquiries | `/admin/inquiries/` | website contact form → D1; status pipeline; convert to family |
| Families | `/admin/families/` | CRUD; add children inline |
| Children | `/admin/children/` | CRUD; status + class assignment |
| Classes | `/admin/classes/` | CRUD; capacity (filled vs. open seats) |
| Billing | `/admin/billing/` | invoices + payments, per-family balances, overdue flags |
| Communications | `/admin/comms/` | announcements (optional email) + R2 photo gallery |

The public contact form (`src/pages/contact.astro`) now posts to
`/api/inquiries/`, which validates (Zod), stores the lead, and redirects to
`/thank-you/`.

## Local development

```bash
npm install
npm run db:generate        # regenerate migrations after editing src/db/schema.ts
npm run db:migrate:local   # apply migrations to the local D1 (.wrangler/ state)
npm run dev                # astro dev; platformProxy exposes local D1/R2
```

Visit `http://localhost:4321/admin/` (Access is bypassed locally).

## One-time Cloudflare provisioning (on the daughter's account)

These need `wrangler login` to her Cloudflare account; they can't be done from CI.

```bash
# 1. Create the database, then paste the returned database_id into wrangler.jsonc
npx wrangler d1 create valentinas-preschool-db

# 2. Create the R2 bucket
npx wrangler r2 bucket create valentinas-preschool-media

# 3. Create the sessions KV namespace, then paste its id into wrangler.jsonc
npx wrangler kv namespace create SESSION

# 4. Apply migrations to the remote DB
npm run db:migrate:remote
```

**Custom domain:** `wrangler.jsonc` lists `valentinaspreschool.com` and
`www.valentinaspreschool.com` as `custom_domain` routes, so `wrangler deploy`
creates the DNS records and binds them to the Worker automatically — no manual
DNS entry needed (the zone must already be active in this Cloudflare account).

Then in the **Zero Trust dashboard → Access → Applications**, add a self-hosted
app covering `valentinaspreschool.com/admin*` and `/api/admin*`, with an
allow policy listing the staff email(s).

## Secrets (never committed)

Set as Worker secrets (`npx wrangler secret put NAME`) — all optional:

- `RESEND_API_KEY` — enables announcement + new-inquiry emails (Resend).
- `NOTIFY_EMAIL` — where new-inquiry notifications are sent.

## Deploy

CI is `.github/workflows/deploy.yml`: on push to `main` it builds, applies remote
D1 migrations, and runs `wrangler deploy`. Requires repo secrets
`CLOUDFLARE_API_TOKEN` (Workers Scripts/D1/R2 edit + Account read) and
`CLOUDFLARE_ACCOUNT_ID`. If Cloudflare's native "Workers Builds" is also
connected to the repo, disable one of them to avoid double deploys.

## Notable decisions

- **Tracking-first billing.** Invoices/payments are recorded by hand; recording a
  payment against an invoice marks it `paid`. Online collection (Stripe) is a
  deliberate fast-follow, not in v1.
- **Spam control.** The public form uses a honeypot field + Astro's built-in
  CSRF origin check.
- **Deletes are safe.** Deleting a class unassigns its children; deleting a child
  detaches its invoices/photos; a family can't be deleted while it has children
  or invoices.
