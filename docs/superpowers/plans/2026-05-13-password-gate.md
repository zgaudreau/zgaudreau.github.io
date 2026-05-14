# Password Gate Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a full-viewport password gate to every page that blocks all content until the correct password is entered, persisting auth in `localStorage`.

**Architecture:** An inline sync script in `<head>` sets `data-gated` on `<html>` before paint if not authed. CSS shows a fixed overlay `#gate` when `[data-gated]` is present. A form handler in `main.js` SHA-256 hashes the entered password with Web Crypto and compares to a hardcoded constant; on match it stores the auth token and removes `data-gated`.

**Tech Stack:** Vanilla JS (Web Crypto API), Jekyll Liquid templates, CSS custom properties

---

## File Map

| File | Change |
|------|--------|
| `style.css` | Append gate overlay styles and shake animation |
| `_layouts/default.html` | Add inline auth script to `<head>`; add `#gate` overlay div to `<body>` |
| `js/main.js` | Add gate form submit handler with SHA-256 hash check |

---

### Task 1: Gate CSS

**Files:**
- Modify: `style.css` (append after line 388, before the RESPONSIVE section)

- [ ] **Step 1: Verify the insertion point**

Open `style.css`. Confirm line ~389 reads `/* RESPONSIVE */`. The gate styles go immediately before that block.

- [ ] **Step 2: Append gate styles**

Insert the following block into `style.css` between the `/* PAGES */` section and the `/* RESPONSIVE */` section:

```css
/* ============================================================
   GATE
   ============================================================ */
#gate {
  display: none;
  position: fixed;
  inset: 0;
  z-index: 9999;
  background: var(--color-paper);
  align-items: center;
  justify-content: center;
}

[data-gated] #gate {
  display: flex;
}

#gate h1 {
  font-family: var(--font-display);
  font-size: var(--text-2xl);
  font-weight: 600;
  font-style: italic;
  margin-bottom: var(--space-md);
  color: var(--color-ink);
}

#gate form {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-sm);
}

#gate input[type="password"] {
  font-family: var(--font-mono);
  font-size: var(--text-base);
  padding: 0.4em 0.75em;
  border: 1px solid var(--color-rule);
  background: transparent;
  color: var(--color-ink);
  letter-spacing: 0.15em;
  text-align: center;
  width: 14ch;
  outline: none;
}

#gate input[type="password"]:focus {
  border-color: var(--color-ink);
}

#gate button[type="submit"] {
  font-family: var(--font-mono);
  font-size: var(--text-xs);
  letter-spacing: 0.1em;
  text-transform: uppercase;
  background: none;
  border: none;
  color: var(--color-muted);
  cursor: pointer;
  padding: 0.25em 0;
}

#gate button[type="submit"]:hover {
  color: var(--color-ink);
}

@keyframes gate-shake {
  0%, 100% { transform: translateX(0); }
  20%       { transform: translateX(-6px); }
  40%       { transform: translateX(6px); }
  60%       { transform: translateX(-4px); }
  80%       { transform: translateX(4px); }
}

#gate input.shake {
  animation: gate-shake 0.35s ease;
}
```

- [ ] **Step 3: Commit**

```bash
git add style.css
git commit -m "feat: add password gate CSS"
```

---

### Task 2: Gate HTML + auth check in `default.html`

**Files:**
- Modify: `_layouts/default.html`

- [ ] **Step 1: Add the inline auth check to `<head>`**

In `_layouts/default.html`, locate the existing inline theme script (lines 11–19). Add the gate check script **immediately after** it, still inside `<head>`:

```html
  <script>
    (function () {
      try {
        if (!localStorage.getItem('zgaudreau_auth')) {
          document.documentElement.setAttribute('data-gated', '');
        }
      } catch (e) {
        document.documentElement.setAttribute('data-gated', '');
      }
    })();
  </script>
```

The full `<head>` script block order should be:
1. Theme script (already there)
2. Gate auth check (new)

- [ ] **Step 2: Add the gate overlay to `<body>`**

In `_layouts/default.html`, locate the closing `</body>` tag. Add the following **immediately before** `</body>`, after the `<script src=".../main.js">` line:

```html
  <div id="gate" role="dialog" aria-modal="true" aria-label="Password required">
    <form id="gate-form">
      <h1>password</h1>
      <input type="password" id="gate-input" autocomplete="current-password" />
      <button type="submit">enter</button>
    </form>
  </div>
```

- [ ] **Step 3: Verify the full updated `default.html`**

The file should look like this in full:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{% if page.title %}{{ page.title }} &mdash; {% endif %}Zack Gaudreau</title>
  <link rel="stylesheet" href="{{ '/style.css' | relative_url }}">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400;1,600&family=Courier+Prime:ital,wght@0,400;0,700;1,400&family=Lora:ital,wght@0,400;0,500;1,400&display=swap" rel="stylesheet">
  <script>
    (function () {
      var stored = null;
      try { stored = localStorage.getItem('theme'); } catch (e) {}
      if (stored === 'dark' || (!stored && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        document.documentElement.setAttribute('data-theme', 'dark');
      }
    })();
  </script>
  <script>
    (function () {
      try {
        if (!localStorage.getItem('zgaudreau_auth')) {
          document.documentElement.setAttribute('data-gated', '');
        }
      } catch (e) {
        document.documentElement.setAttribute('data-gated', '');
      }
    })();
  </script>
</head>
<body class="{{ page.page_class }}">

  <div class="container">

    {% include masthead.html %}

    {{ content }}

    <hr class="rule">

    <footer class="footer">
      <span>&copy; 2026 Zack Gaudreau</span>
    </footer>

  </div>

  <script src="{{ '/js/main.js' | relative_url }}"></script>

  <div id="gate" role="dialog" aria-modal="true" aria-label="Password required">
    <form id="gate-form">
      <h1>password</h1>
      <input type="password" id="gate-input" autocomplete="current-password" />
      <button type="submit">enter</button>
    </form>
  </div>
</body>
</html>
```

- [ ] **Step 4: Commit**

```bash
git add _layouts/default.html
git commit -m "feat: add password gate overlay and auth check"
```

---

### Task 3: Gate handler in `main.js`

**Files:**
- Modify: `js/main.js`

- [ ] **Step 1: Verify the hash constant before writing code**

Run this in a terminal to confirm the SHA-256 hash of `salmon`:

```bash
node -e "crypto.subtle.digest('SHA-256', new TextEncoder().encode('salmon')).then(b => console.log([...new Uint8Array(b)].map(x=>x.toString(16).padStart(2,'0')).join('')))"
```

Expected output:
```
aeaa2cec33e27d65690e726e1710d3f4a99a2bf0ae9a3bd9087488f1dfb4d38d
```

- [ ] **Step 2: Add the gate handler to `main.js`**

Append the following to the end of `js/main.js` (outside the existing `DOMContentLoaded` listener):

```javascript
(function () {
  const HASH = 'aeaa2cec33e27d65690e726e1710d3f4a99a2bf0ae9a3bd9087488f1dfb4d38d';
  const form = document.getElementById('gate-form');
  if (!form) return;

  form.addEventListener('submit', async function (e) {
    e.preventDefault();
    const input = document.getElementById('gate-input');
    const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(input.value));
    const hash = [...new Uint8Array(buf)].map(x => x.toString(16).padStart(2, '0')).join('');

    if (hash === HASH) {
      try { localStorage.setItem('zgaudreau_auth', '1'); } catch (_) {}
      document.documentElement.removeAttribute('data-gated');
    } else {
      input.classList.add('shake');
      input.addEventListener('animationend', function () {
        input.classList.remove('shake');
        input.value = '';
        input.focus();
      }, { once: true });
    }
  });
})();
```

- [ ] **Step 3: Commit**

```bash
git add js/main.js
git commit -m "feat: add password gate handler with SHA-256 auth"
```

---

### Task 4: End-to-end verification and push

- [ ] **Step 1: Start the Jekyll server locally**

```bash
bundle exec jekyll serve
```

Open `http://localhost:4000` in a browser.

- [ ] **Step 2: Verify gate appears on first load**

With no `zgaudreau_auth` key in localStorage (use an incognito window, or clear it via DevTools → Application → Local Storage), the gate overlay should cover the entire page. The site content should not be visible at all.

- [ ] **Step 3: Verify wrong password shakes**

Type any wrong password and press Enter. The input should shake and clear. The gate should remain.

- [ ] **Step 4: Verify correct password unlocks**

Type `salmon` and press Enter. The gate should disappear and the site content should be visible.

- [ ] **Step 5: Verify persistence**

Close and reopen the tab (not incognito). Navigate to `/blog/` and `/projects/`. The gate should not appear.

- [ ] **Step 6: Verify light/dark theme still works**

While authed, toggle the theme button. Light/dark should still switch as before.

- [ ] **Step 7: Push**

```bash
git push
```
