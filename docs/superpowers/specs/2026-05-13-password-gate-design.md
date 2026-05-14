---
name: password-gate-design
description: Design spec for site-wide client-side password gate on zgaudreau.github.io
metadata:
  type: project
---

A full-viewport password gate that blocks all site content until the correct password is entered. Auth persists in `localStorage` so the user only needs to enter it once per device.

## Mechanism

An inline synchronous `<script>` in `<head>` of `_layouts/default.html` checks `localStorage` for a key `zgaudreau_auth`. If absent, it sets `data-gated` on `<html>` before any content paints. CSS uses `[data-gated] #gate { display: flex }` to show the overlay; by default the overlay is `display: none`.

On correct password entry the gate handler in `js/main.js` calls `localStorage.setItem('zgaudreau_auth', '1')`, removes the `data-gated` attribute, and the overlay disappears without a page reload. On wrong password, the input shakes and clears.

## Password

Plaintext password: `salmon`
SHA-256 hash: `aeaa2cec33e27d65690e726e1710d3f4a99a2bf0ae9a3bd9087488f1dfb4d38d`

Only the hash is stored in source. The gate handler uses `crypto.subtle.digest('SHA-256', ...)` (Web Crypto API) to hash user input and compare to this constant.

## Security posture

Client-side only — a determined user can bypass via DevTools (`localStorage.setItem('zgaudreau_auth', '1')`). Hashing prevents plaintext password exposure in source. Suitable for keeping casual visitors out; not a substitute for server-side auth.

## Components

### `_layouts/default.html`
- Inline sync script in `<head>`: checks localStorage, sets `data-gated` if not authed
- `<div id="gate">` at the bottom of `<body>`: full-viewport overlay with a `<form>` containing a password `<input>` and submit `<button>`

### `style.css`
- `#gate`: `display: none`, full-viewport fixed overlay, centered content, inherits CSS vars (background, text, font) — light/dark aware automatically
- `[data-gated] #gate`: `display: flex`
- Shake keyframe animation for wrong password

### `js/main.js`
- Gate form submit handler: SHA-256 hash input via Web Crypto, compare to hash constant
- Match: store token, remove `data-gated`
- Fail: add shake class to input, clear value on animation end
