# Personal Site Scaffold — zgaudreau.com

**Date:** 2026-05-06  
**Status:** Approved

## Overview

A personal hub site for Zack Gaudreau at zgaudreau.com. Not a professional portfolio — a creative outlet and maker's log for sharing personal projects (3D printing, woodworking, AI experiments), photography, and writing with people he knows. No audience-building goals at this stage.

Deployed via GitHub Pages from the `master` branch root. Vanilla HTML/CSS/JS, no frameworks, no build step.

## Aesthetic

**Direction:** Personal Zine — warm off-white paper, editorial serif typography, self-published magazine feel. Eclectic and personal without being precious.

**Color tokens:**
- `--color-paper`: `#f5f0e8` — warm off-white background
- `--color-ink`: `#1a1a1a` — near-black body text
- `--color-accent`: `#c0392b` — editorial red for tags, rules, highlights
- `--color-rule`: `#d4cfc4` — light horizontal rule color
- `--color-muted`: `#888` — secondary text, metadata

**Typography:**
- Display/headings: Cormorant Garamond (Google Fonts) — elegant, distinctive, editorial
- Body copy: Lora (Google Fonts) — readable serif, warm
- Labels/metadata: Courier Prime (Google Fonts) — monospace for dates, tags, issue numbers

**Tone:** Horizontal rules everywhere. Sparse layout. Let the type do the work.

## File Structure

```
index.html                  — homepage
style.css                   — all styles
js/
  main.js                   — minimal JS (mobile nav toggle only)
blog/
  index.html                — post listing
  post-template.html        — template for individual posts
projects/
  index.html                — project gallery
assets/
  images/                   — photos, project images (empty placeholder)
  fonts/                    — reserved for self-hosted fonts if needed later
docs/
  superpowers/specs/        — design specs (this file)
```

`.superpowers/` added to `.gitignore`.

## Pages

### Shared Masthead

All pages share the same `<header>`:
- Top line: site name (`zgaudreau.com`) left-aligned, small metadata (e.g. "vol. 1") right-aligned. Courier Prime, small caps, letter-spaced.
- Horizontal rule.
- Nav row: `Projects · Blog · About` — plain text links, no buttons or boxes.
- Horizontal rule.

### `index.html` — Homepage

Two-column editorial layout below the masthead:

**Left column (wider, ~65%):** Featured project block.
- Small red category tag above the title (e.g. `3D PRINTING`)
- Large Cormorant Garamond heading
- 2–3 sentence description in Lora
- "Read more →" link

**Right column (~35%):** Stack of recent posts + about blurb.
- Section label: `RECENT POSTS` in Courier Prime, letter-spaced
- 3–5 post teasers: date + title only, no excerpts
- Horizontal rule
- Short about blurb: 2–3 sentences, first-person
- "About me →" link

Columns collapse to single column (featured project first) on mobile.

### `blog/index.html` — Blog Listing

Single-column post list below the shared masthead.

Each post entry (top to bottom):
- Date — Courier Prime, small, muted
- Title — large Cormorant Garamond, linked
- Category tag — small, red, letter-spaced (e.g. `WOODWORKING`)
- One-sentence excerpt — Lora
- Horizontal rule

No cards, no boxes — pure typographic stacking.

### `blog/post-template.html` — Post Template

Shared masthead, then:
- Article `<header>`: title (large Cormorant), date + category below it
- Horizontal rule
- Article `<body>`: Lora body copy, `max-width: 680px`, generous `line-height: 1.75`
- Horizontal rule
- Post footer: `← Previous` / `Next →` navigation links

### `projects/index.html` — Projects Gallery

Shared masthead, then a grid of project entries.

Each project card (text only, no images yet):
- Title — Cormorant Garamond, medium-large
- Category badge — small, red (e.g. `3D PRINTING` / `WOODWORKING` / `AI`)
- Short description — 1–2 sentences, Lora
- Status tag — `ONGOING` / `COMPLETE` / `ARCHIVED` in Courier Prime

Grid: 2 columns on desktop, 1 on mobile.

### `style.css` — Stylesheet Structure

Single file, organized in labeled sections:

1. **Tokens** — all CSS custom properties (colors, fonts, spacing, max-widths)
2. **Reset** — `box-sizing: border-box`, `margin: 0` on body/headings
3. **Base** — `body` font, color, background; typographic scale (`h1`–`h4`, `p`, `a`)
4. **Layout** — `.masthead`, `.container`, `.two-col`, `.post-grid`; responsive breakpoints
5. **Components** — `.tag`, `.rule`, `.post-entry`, `.project-card`, `.nav`
6. **Pages** — page-specific overrides scoped by `body.page-home`, `body.page-blog`, etc.

### `js/main.js`

Mobile nav toggle only. No other JS until there's a concrete reason.

## Responsive Behavior

- Max content width: `900px`, centered
- Mobile breakpoint: `640px`
- Two-column layouts (homepage, projects grid) collapse to single column at mobile breakpoint
- Masthead nav wraps or condenses on small screens

## Out of Scope (for this scaffold)

- Search functionality
- Comments
- RSS feed
- Dark mode
- Any CMS or dynamic content
- Analytics
- Images (placeholders only)
