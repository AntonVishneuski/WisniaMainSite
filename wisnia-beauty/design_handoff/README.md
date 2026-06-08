# Handoff: Wiśnia Beauty Studio — bilingual multi-page site

## Overview
Marketing site for **Wiśnia Beauty Studio**, a cosmetology / laser / massage studio in central Warsaw (ul. Gen. W. Andersa 15, obok LuxMed). Fully **bilingual: Polish (default) + Russian**, switchable in-page (persisted in `localStorage["wisnia-lang"]`). Goal: drive bookings via **WhatsApp / phone / Booksy**.

The site is now **multi-page**:
- **Homepage** (`index.html`) — hero, pain points, "Nasze kierunki", tabbed price list (Kosmetologia / Laser / Ciało / Pakiety), before/after gallery, team, "how it works", reviews (horizontal scroll), FAQ, contact + map, footer.
- **7 SEO service pages** (`uslugi/*.html`) — one per query, each with: hero (photo or "soon" placeholder) + breadcrumb, prose (czym jest / wskazania / jak przebiega / efekty), sticky price aside, **package upsell card (−15%)**, before/after (where real photos exist), reviews, cross-links, footer.
- **Blog** (`blog/index.html` + 4 articles) — index grid + articles with CTA to a related service.
- **Privacy policy** (`privacy.html`) — RODO/GDPR, 8 sections.

## About the design files
Files are a **high-fidelity design reference in plain HTML/CSS/vanilla JS** — recreate in the target stack (React/Next, Astro, Vue, CMS theme…) using its conventions; do not ship verbatim. If no stack exists, any modern static-site/component framework fits (mostly-static marketing site).

- `source/` — editable: `index.html` (homepage) + `privacy.html` linked to `styles.css`, `i18n.js`, `i18n-privacy.js`, `main.js`, `assets/`, plus `robots.txt`, `sitemap.xml`, and the self-contained `uslugi/` + `blog/` pages. **Read this to understand structure.**
- `preview/` — fully self-contained build (CSS/JS/images inlined): open `index.html`, `uslugi/*.html`, `blog/*.html`, `privacy.html` to view the finished result offline.

## Fidelity
**High-fidelity.** Final colors, type, spacing, copy (PL+RU), imagery, interactions are all present. Recreate closely, then wire real integrations (see "Known gaps").

## Tech notes
- **i18n**: translatable nodes carry `data-i18n="key"`; Polish is inline (source of truth). Homepage uses `window.I18N.ru` (+ `.meta`) via `main.js`. Sub-pages are self-contained: each has an inline `window.I18N_PAGE.ru` dict + a small inline script that swaps text and persists `wisnia-lang`. Replace with the framework's i18n in production; keys can be reused.
- **Icons**: Lucide via `data-lucide="…"` (pinned `lucide@0.456.0`). The WhatsApp glyph is an inline SVG injected into `.ico-wa` (not Lucide).
- **Fonts**: Google Fonts — **Cormorant Garamond** (serif headings) + **Jost** (sans body); `@import`-ed atop `styles.css`.
- **Pricing tabs / hash**: homepage tabs are `data-tab` buttons toggling `[data-panel]`; `index.html#pakiety` (or any panel id) opens that tab on load. Service-page package cards link to `../index.html#pakiety`.
- **Reveal-on-scroll** gated behind `prefers-reduced-motion`.

## Design tokens (`styles.css` :root)
Colors: `--cherry #8B1A3A`, `--cherry-deep #6E122C`, `--cherry-soft #A8324F`, `--rose-gold #C9956C`, `--rose-gold-dk #B07E55`, `--blush #F5EDE3`, `--blush-deep #EFE3D5`, `--cream #FDFAF7`, `--graphite #1A1A1A`, `--gray #5A5A5A`, `--gray-soft #8A8079`, `--line rgba(26,26,26,.10)`, `--line-warm rgba(201,149,108,.35)`.
Type: serif Cormorant Garamond (h1–h4, prices, names; 600); sans Jost (body 17px/1.65); eyebrow 13px uppercase 0.28em rose-gold-dk.
Spacing `--s-1..-s-10`: 4,8,12,16,24,32,48,64,96,128. Radii sm10 md16 lg22 xl32 pill999. Shadows warm cherry-tinted (sm/md/lg). Content max 1200px; header 78px. Breakpoints 960 / 640.

## Navigation (consistent across pages)
- Header: logo, **"Usługi" dropdown (7 services)**, Cennik, Efekty, **Blog**, O nas, Kontakt, PL/RU, Booksy CTA. Homepage mobile → burger drawer (services + blog). Sub-pages mobile → horizontal-scroll nav row.
- Footer: brand + social, Nawigacja (+Blog), **Usługi (7 links)**, Kontakt, privacy link.

## Assets (`source/assets/`)
- `logo-sm.png` / `logo-wisnia.png` (color logo), `logo-cream-sm.png` (light variant).
- `hero-olga.jpg` (homepage hero), `hero-laser.jpg` (laser service-page hero).
- `portrait-olga.jpg`, `portrait-katia.jpg` (team).
- `ba1..ba6-before/-after.jpg` (6 real before/after pairs, baked-in text removed for localization).
Tone: warm, natural, clinical-but-cozy; cherry/blush accents; no heavy filters.

## Content / compliance notes
- Mesotherapy copy deliberately avoids "injection/needle" wording (regulatory in PL) — keep that phrasing.
- Men's laser page has no reviews (avoid female reviews there) and a placeholder hero — client will supply a male photo + male reviews.
- 5 service pages (IPL, RF, vessels, cleansing, mezo) use a "Zdjęcie wkrótce / Фото скоро" hero placeholder — swap for real photos when provided.

## Known gaps / TODO for the developer
- **Domain**: replace `https://TWOJA-DOMENA.pl` in `robots.txt` and `sitemap.xml`.
- **WhatsApp**: verify `+48 453 270 435` is on WhatsApp (`wa.me/48453270435`). Booksy points to `https://wisniabeauty.booksy.com/a` (real).
- **Google Map** iframe queried by name+address — swap for the official "Embed a map" link.
- **Analytics**: add GA4 / GTM / Search Console IDs in `<head>` (not included — need real IDs).
- **Privacy policy**: add legal entity (NIP/company) + data-request e-mail when available.
- **Reviews / rating** numbers and dates: keep in sync with live Google/Booksy profiles.
- Cabinet/equipment photos to be added to trust sections + service heroes.

## Files
- `source/`: index.html, privacy.html, styles.css, i18n.js, i18n-privacy.js, main.js, robots.txt, sitemap.xml, assets/, uslugi/ (7), blog/ (index + 4)
- `preview/`: index.html, privacy.html, uslugi/ (7), blog/ (index + 4) — self-contained, open to view
