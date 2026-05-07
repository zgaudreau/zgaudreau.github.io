# Dark Mode Design

**Date:** 2026-05-06
**Status:** Approved

## Overview

Add a persistent dark mode to the entire site, toggled by a button in the masthead. The system respects the user's OS-level `prefers-color-scheme` preference by default and stores manual overrides in `localStorage`.

## Color Palette

| Token | Light | Dark |
|---|---|---|
| `--color-paper` | `#f5f0e8` | `#1c1917` |
| `--color-ink` | `#1a1a1a` | `#e8e3d8` |
| `--color-accent` | `#c0392b` | `#e05242` |
| `--color-rule` | `#d4cfc4` | `#2d2a25` |
| `--color-muted` | `#888` | `#9a9183` |

Dark palette stays warm throughout — no cold/blue-gray drift. Accent is nudged slightly brighter in dark mode to maintain pop against the dark background.

## Toggle Button

Placed in `.masthead__top`, right side, alongside "est. 2026". The existing right-side `<span>` is wrapped in a `.masthead__right` flex group containing both "est. 2026" and the new button.

- Styled in the same small mono uppercase as surrounding masthead text
- No border or background — typographic only, consistent with editorial restraint
- Label: `DARK` in light mode (click to switch to dark), `LIGHT` in dark mode (click to switch to light)
- `id="theme-toggle"`, `aria-label="Toggle dark mode"`

## CSS

A single `[data-theme="dark"]` block in `style.css` overrides the five color tokens. All existing site components use `var(--color-*)` already, so the entire site flips automatically.

```css
[data-theme="dark"] {
  --color-paper: #1c1917;
  --color-ink:   #e8e3d8;
  --color-accent: #e05242;
  --color-rule:  #2d2a25;
  --color-muted: #9a9183;
}
```

A `.theme-toggle` rule styles the button to match the masthead top row: mono font, xs size, uppercase, no background, no border, cursor pointer.

## No-Flash Initialization

A tiny inline `<script>` block is added to `<head>` in `_layouts/default.html`, before `style.css` is applied. It runs synchronously and:

1. Reads `localStorage.getItem('theme')`
2. If no stored value, checks `window.matchMedia('(prefers-color-scheme: dark)').matches`
3. If dark, sets `document.documentElement.setAttribute('data-theme', 'dark')` immediately

This prevents a flash of light mode on every page load.

## JS Toggle Logic (main.js)

Added to the existing `DOMContentLoaded` handler:

1. On load: read `data-theme` from `<html>` (already set by inline script) and set button label accordingly
2. On click: toggle `data-theme` between `""` and `"dark"`, write new value to `localStorage`, update button label

## Scope

All three layouts (`default.html`, `post.html`, `project.html`) include the masthead via `{% include masthead.html %}` or share the default layout, so the toggle appears site-wide automatically.
