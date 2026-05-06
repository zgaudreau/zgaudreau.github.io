# Personal Site Scaffold — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Scaffold zgaudreau.com — a personal zine-style hub site with a homepage, blog listing, blog post template, and projects gallery.

**Architecture:** Six static HTML files sharing one stylesheet (`style.css`) and one JS file (`js/main.js`). CSS is organized into labeled sections (tokens → reset → base → layout → components → responsive). No build step, no framework, no dependencies beyond Google Fonts.

**Tech Stack:** Vanilla HTML5, CSS3 (custom properties), vanilla JS. Google Fonts: Cormorant Garamond, Lora, Courier Prime. Deployed via GitHub Pages.

---

> **Local development note:** Absolute paths like `/projects/` work when deployed but not when opening files directly. Run a local server with `python -m http.server 8000` from the repo root, then visit `http://localhost:8000`.

---

## File Map

| File | Responsibility |
|------|---------------|
| `CNAME` | GitHub Pages custom domain |
| `style.css` | All styles — single file, labeled sections |
| `js/main.js` | Mobile nav toggle only |
| `index.html` | Homepage: editorial two-column layout |
| `blog/index.html` | Blog post listing |
| `blog/post-template.html` | Template for individual blog posts |
| `projects/index.html` | Project gallery grid |
| `assets/images/` | Placeholder directory for images |
| `assets/fonts/` | Placeholder directory for self-hosted fonts |

---

## Task 1: CNAME and directory structure

**Files:**
- Create: `CNAME`
- Create: `assets/images/.gitkeep`
- Create: `assets/fonts/.gitkeep`

- [ ] **Step 1: Create the CNAME file**

```
zgaudreau.com
```

Write that single line to `CNAME` in the repo root (no trailing newline issues — just the domain).

- [ ] **Step 2: Create placeholder asset directories**

Git doesn't track empty directories. Create `.gitkeep` files so the directories are committed:

```
assets/images/.gitkeep
assets/fonts/.gitkeep
```

Both files are empty.

- [ ] **Step 3: Create the js/ directory**

Create `js/main.js` with an empty comment for now — it gets real content in Task 6:

```javascript
// main.js — initialized in Task 6
```

- [ ] **Step 4: Commit**

```bash
git add CNAME assets/ js/
git commit -m "scaffold: add CNAME, asset dirs, and JS placeholder"
```

---

## Task 2: style.css — complete stylesheet

**Files:**
- Create: `style.css`

This is the entire stylesheet written in one task. All six sections in order.

- [ ] **Step 1: Write style.css**

```css
/* ============================================================
   TOKENS
   ============================================================ */
:root {
  /* Colors */
  --color-paper: #f5f0e8;
  --color-ink: #1a1a1a;
  --color-accent: #c0392b;
  --color-rule: #d4cfc4;
  --color-muted: #888;

  /* Typography */
  --font-display: 'Cormorant Garamond', Georgia, serif;
  --font-body: 'Lora', Georgia, serif;
  --font-mono: 'Courier Prime', 'Courier New', monospace;

  /* Type scale */
  --text-xs:   0.75rem;
  --text-sm:   0.875rem;
  --text-base: 1rem;
  --text-lg:   1.25rem;
  --text-xl:   1.5rem;
  --text-2xl:  2rem;
  --text-3xl:  2.75rem;
  --text-4xl:  3.5rem;

  /* Spacing */
  --space-xs: 0.5rem;
  --space-sm: 1rem;
  --space-md: 1.5rem;
  --space-lg: 2.5rem;
  --space-xl: 4rem;

  /* Layout */
  --max-width: 900px;
}

/* ============================================================
   RESET
   ============================================================ */
*, *::before, *::after {
  box-sizing: border-box;
}

body, h1, h2, h3, h4, p, ul, ol, figure {
  margin: 0;
  padding: 0;
}

ul, ol { list-style: none; }

img {
  max-width: 100%;
  display: block;
}

/* ============================================================
   BASE
   ============================================================ */
body {
  background-color: var(--color-paper);
  color: var(--color-ink);
  font-family: var(--font-body);
  font-size: var(--text-base);
  line-height: 1.6;
  -webkit-font-smoothing: antialiased;
}

h1, h2, h3, h4 {
  font-family: var(--font-display);
  font-weight: 600;
  line-height: 1.15;
}

h1 { font-size: var(--text-4xl); }
h2 { font-size: var(--text-3xl); }
h3 { font-size: var(--text-2xl); }
h4 { font-size: var(--text-xl); }

a {
  color: inherit;
  text-decoration: none;
  border-bottom: 1px solid currentColor;
}

a:hover { color: var(--color-accent); }

/* ============================================================
   LAYOUT
   ============================================================ */
.container {
  max-width: var(--max-width);
  margin: 0 auto;
  padding: 0 var(--space-md);
}

.rule {
  border: none;
  border-top: 1px solid var(--color-rule);
  margin: var(--space-md) 0;
}

.rule--heavy { border-top-color: var(--color-ink); }

/* Masthead */
.masthead { padding: var(--space-md) 0 0; }

.masthead__top {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  font-family: var(--font-mono);
  font-size: var(--text-xs);
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: var(--color-muted);
  padding-bottom: var(--space-xs);
}

.masthead__top a {
  border-bottom: none;
  color: var(--color-ink);
  font-weight: 700;
}

.masthead__nav {
  display: flex;
  gap: var(--space-md);
  font-family: var(--font-mono);
  font-size: var(--text-xs);
  letter-spacing: 0.15em;
  text-transform: uppercase;
  padding: var(--space-xs) 0;
}

.masthead__nav a {
  border-bottom: none;
  color: var(--color-muted);
}

.masthead__nav a:hover,
.masthead__nav a.active { color: var(--color-ink); }

.nav-toggle {
  display: none;
  background: none;
  border: 1px solid var(--color-ink);
  cursor: pointer;
  font-family: var(--font-mono);
  font-size: var(--text-xs);
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: var(--color-ink);
  padding: 2px 8px;
}

/* Editorial two-column grid (homepage) */
.editorial-grid {
  display: grid;
  grid-template-columns: 3fr 2fr;
  gap: var(--space-xl);
  padding: var(--space-lg) 0;
}

/* ============================================================
   COMPONENTS
   ============================================================ */
.tag {
  font-family: var(--font-mono);
  font-size: var(--text-xs);
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--color-accent);
  display: inline-block;
  margin-bottom: var(--space-xs);
  border-bottom: none;
}

.section-label {
  font-family: var(--font-mono);
  font-size: var(--text-xs);
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--color-muted);
  margin-bottom: var(--space-sm);
}

/* Featured project block (homepage left column) */
.featured__title {
  font-size: var(--text-4xl);
  font-style: italic;
  margin-bottom: var(--space-sm);
}

.featured__desc {
  color: var(--color-muted);
  margin-bottom: var(--space-md);
  line-height: 1.7;
}

.featured__link {
  font-family: var(--font-mono);
  font-size: var(--text-sm);
  letter-spacing: 0.1em;
}

/* Recent posts sidebar */
.recent-posts {
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
}

.recent-post { display: flex; flex-direction: column; gap: 2px; }

.recent-post__date {
  font-family: var(--font-mono);
  font-size: var(--text-xs);
  color: var(--color-muted);
  letter-spacing: 0.05em;
}

.recent-post__title {
  font-family: var(--font-display);
  font-size: var(--text-lg);
  font-weight: 600;
  border-bottom: none;
}

.recent-post__title:hover { color: var(--color-accent); }

.about-blurb {
  font-size: var(--text-sm);
  color: var(--color-muted);
  line-height: 1.7;
  margin-bottom: var(--space-sm);
}

/* Post entry (blog listing) */
.post-entry { padding: var(--space-md) 0; }

.post-entry__date {
  font-family: var(--font-mono);
  font-size: var(--text-xs);
  color: var(--color-muted);
  letter-spacing: 0.05em;
  margin-bottom: var(--space-xs);
}

.post-entry__title {
  font-family: var(--font-display);
  font-size: var(--text-2xl);
  font-weight: 600;
  display: block;
  border-bottom: none;
  margin-bottom: var(--space-xs);
}

.post-entry__title:hover { color: var(--color-accent); }

.post-entry__excerpt {
  font-size: var(--text-sm);
  color: var(--color-muted);
  line-height: 1.6;
  margin-top: var(--space-xs);
}

/* Projects grid */
.projects-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--space-lg);
  padding: var(--space-lg) 0;
}

.project-card {
  border-top: 2px solid var(--color-ink);
  padding-top: var(--space-sm);
}

.project-card__title {
  font-family: var(--font-display);
  font-size: var(--text-xl);
  font-weight: 600;
  margin-bottom: var(--space-xs);
}

.project-card__desc {
  font-size: var(--text-sm);
  color: var(--color-muted);
  line-height: 1.6;
  margin-bottom: var(--space-sm);
}

.project-card__status {
  font-family: var(--font-mono);
  font-size: var(--text-xs);
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: var(--color-muted);
}

/* Article (blog post) */
.article-header { padding: var(--space-lg) 0 var(--space-md); }

.article-header__title {
  font-size: var(--text-4xl);
  font-style: italic;
  margin-bottom: var(--space-sm);
}

.article-header__meta {
  font-family: var(--font-mono);
  font-size: var(--text-xs);
  color: var(--color-muted);
  letter-spacing: 0.05em;
}

.article-body {
  max-width: 680px;
  padding: var(--space-md) 0;
}

.article-body p {
  margin-bottom: var(--space-md);
  line-height: 1.8;
}

.article-body h2 {
  font-size: var(--text-2xl);
  margin: var(--space-lg) 0 var(--space-sm);
}

.article-body h3 {
  font-size: var(--text-xl);
  margin: var(--space-md) 0 var(--space-xs);
}

.article-nav {
  display: flex;
  justify-content: space-between;
  padding: var(--space-md) 0;
  font-family: var(--font-mono);
  font-size: var(--text-xs);
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

/* Footer */
.footer {
  padding: var(--space-md) 0 var(--space-lg);
  font-family: var(--font-mono);
  font-size: var(--text-xs);
  color: var(--color-muted);
  letter-spacing: 0.05em;
}

/* ============================================================
   PAGES
   ============================================================ */
/* Page-specific overrides scoped by body class if needed */

/* ============================================================
   RESPONSIVE
   ============================================================ */
@media (max-width: 640px) {
  h1,
  .featured__title,
  .article-header__title { font-size: var(--text-3xl); }

  h2 { font-size: var(--text-2xl); }

  .editorial-grid {
    grid-template-columns: 1fr;
    gap: var(--space-lg);
  }

  .projects-grid { grid-template-columns: 1fr; }

  .nav-toggle { display: block; }

  .masthead__nav {
    display: none;
    flex-direction: column;
    gap: var(--space-sm);
    padding: var(--space-sm) 0;
  }

  .masthead__nav.open { display: flex; }
}
```

- [ ] **Step 2: Commit**

```bash
git add style.css
git commit -m "scaffold: add complete stylesheet with design tokens"
```

---

## Task 3: index.html — homepage

**Files:**
- Create: `index.html`

- [ ] **Step 1: Write index.html**

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Zack Gaudreau</title>
  <link rel="stylesheet" href="style.css">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400;1,600&family=Courier+Prime:ital,wght@0,400;0,700;1,400&family=Lora:ital,wght@0,400;0,500;1,400&display=swap" rel="stylesheet">
</head>
<body class="page-home">

  <div class="container">

    <header class="masthead">
      <div class="masthead__top">
        <a href="/">zgaudreau.com</a>
        <span>vol. 1 &middot; 2026</span>
      </div>
      <hr class="rule rule--heavy">
      <button class="nav-toggle" id="nav-toggle" aria-expanded="false" aria-controls="main-nav">Menu</button>
      <nav class="masthead__nav" id="main-nav">
        <a href="/projects/" class="active">Projects</a>
        <a href="/blog/">Blog</a>
        <a href="#about">About</a>
      </nav>
      <hr class="rule">
    </header>

    <main>
      <div class="editorial-grid">

        <section aria-label="Featured project">
          <span class="tag">3D Printing</span>
          <h1 class="featured__title">Project Title Goes Here</h1>
          <p class="featured__desc">A short description of the featured project goes here. Two or three sentences that give a sense of what it is and why it was worth building.</p>
          <a href="/projects/" class="featured__link">View all projects &rarr;</a>
        </section>

        <aside aria-label="Recent posts and about">
          <p class="section-label">Recent Posts</p>
          <div class="recent-posts">
            <article class="recent-post">
              <span class="recent-post__date">May 2026</span>
              <a href="/blog/" class="recent-post__title">Post title goes here</a>
            </article>
            <article class="recent-post">
              <span class="recent-post__date">Apr 2026</span>
              <a href="/blog/" class="recent-post__title">Another post title</a>
            </article>
            <article class="recent-post">
              <span class="recent-post__date">Mar 2026</span>
              <a href="/blog/" class="recent-post__title">Third post title</a>
            </article>
          </div>

          <hr class="rule">

          <p class="section-label">About</p>
          <p class="about-blurb">I'm Zack — a maker and tinkerer. I build things with wood, plastic, and code. This is where I keep notes on what I'm working on.</p>
          <a href="#about" class="featured__link">More about me &rarr;</a>
        </aside>

      </div>
    </main>

    <hr class="rule rule--heavy">

    <section id="about" style="padding: var(--space-lg) 0;">
      <h2>About</h2>
      <p style="max-width: 680px; margin-top: var(--space-md); line-height: 1.8;">More about Zack goes here. Who you are, what you make, what this site is about. Written in first person, conversational tone. A few sentences is enough.</p>
    </section>

    <hr class="rule">

    <footer class="footer">
      <span>&copy; 2026 Zack Gaudreau</span>
    </footer>

  </div>

  <script src="js/main.js"></script>
</body>
</html>
```

- [ ] **Step 2: Verify in browser**

Start a local server from the repo root:
```bash
python -m http.server 8000
```
Open `http://localhost:8000`. Check:
- Masthead renders with site name left, "vol. 1 · 2026" right
- Two heavy horizontal rules above/below nav
- Two-column layout: featured project left, sidebar right
- About section scrolls to correctly from the "More about me →" link
- Fonts load (Cormorant Garamond for headings, Lora for body, Courier Prime for labels)

- [ ] **Step 3: Commit**

```bash
git add index.html
git commit -m "scaffold: add homepage with editorial two-column layout"
```

---

## Task 4: blog/index.html — blog listing

**Files:**
- Create: `blog/index.html`

- [ ] **Step 1: Write blog/index.html**

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Blog &mdash; Zack Gaudreau</title>
  <link rel="stylesheet" href="../style.css">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400;1,600&family=Courier+Prime:ital,wght@0,400;0,700;1,400&family=Lora:ital,wght@0,400;0,500;1,400&display=swap" rel="stylesheet">
</head>
<body class="page-blog">

  <div class="container">

    <header class="masthead">
      <div class="masthead__top">
        <a href="/">zgaudreau.com</a>
        <span>vol. 1 &middot; 2026</span>
      </div>
      <hr class="rule rule--heavy">
      <button class="nav-toggle" id="nav-toggle" aria-expanded="false" aria-controls="main-nav">Menu</button>
      <nav class="masthead__nav" id="main-nav">
        <a href="/projects/">Projects</a>
        <a href="/blog/" class="active">Blog</a>
        <a href="/#about">About</a>
      </nav>
      <hr class="rule">
    </header>

    <main>
      <h2 style="font-style: italic; margin: var(--space-md) 0;">Blog</h2>
      <hr class="rule">

      <article class="post-entry">
        <p class="post-entry__date">May 2026</p>
        <a href="#" class="post-entry__title">Post title goes here</a>
        <span class="tag">3D Printing</span>
        <p class="post-entry__excerpt">One sentence that captures what this post is about. Keep it brief.</p>
      </article>
      <hr class="rule">

      <article class="post-entry">
        <p class="post-entry__date">Apr 2026</p>
        <a href="#" class="post-entry__title">Another post title</a>
        <span class="tag">Woodworking</span>
        <p class="post-entry__excerpt">One sentence that captures what this post is about. Keep it brief.</p>
      </article>
      <hr class="rule">

      <article class="post-entry">
        <p class="post-entry__date">Mar 2026</p>
        <a href="#" class="post-entry__title">Third post title</a>
        <span class="tag">AI</span>
        <p class="post-entry__excerpt">One sentence that captures what this post is about. Keep it brief.</p>
      </article>
      <hr class="rule">
    </main>

    <footer class="footer">
      <span>&copy; 2026 Zack Gaudreau</span>
    </footer>

  </div>

  <script src="../js/main.js"></script>
</body>
</html>
```

- [ ] **Step 2: Verify in browser**

Open `http://localhost:8000/blog/`. Check:
- Masthead identical to homepage; "Blog" nav link is active (darker)
- Post entries stack vertically with rules between them
- Each entry: date (mono, muted) → title (large serif) → tag (red, mono) → excerpt (small, muted)
- Footer present

- [ ] **Step 3: Commit**

```bash
git add blog/index.html
git commit -m "scaffold: add blog listing page"
```

---

## Task 5: blog/post-template.html — post template

**Files:**
- Create: `blog/post-template.html`

- [ ] **Step 1: Write blog/post-template.html**

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Post Title &mdash; Zack Gaudreau</title>
  <link rel="stylesheet" href="../style.css">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400;1,600&family=Courier+Prime:ital,wght@0,400;0,700;1,400&family=Lora:ital,wght@0,400;0,500;1,400&display=swap" rel="stylesheet">
</head>
<body class="page-post">

  <div class="container">

    <header class="masthead">
      <div class="masthead__top">
        <a href="/">zgaudreau.com</a>
        <span>vol. 1 &middot; 2026</span>
      </div>
      <hr class="rule rule--heavy">
      <button class="nav-toggle" id="nav-toggle" aria-expanded="false" aria-controls="main-nav">Menu</button>
      <nav class="masthead__nav" id="main-nav">
        <a href="/projects/">Projects</a>
        <a href="/blog/" class="active">Blog</a>
        <a href="/#about">About</a>
      </nav>
      <hr class="rule">
    </header>

    <main>
      <header class="article-header">
        <span class="tag">Category</span>
        <h1 class="article-header__title">Post Title Goes Here</h1>
        <p class="article-header__meta">May 6, 2026</p>
      </header>

      <hr class="rule rule--heavy">

      <div class="article-body">
        <p>Opening paragraph goes here. This is the introduction to the post. Write in a conversational, first-person tone.</p>

        <p>Second paragraph continues the thought. Lora renders beautifully at this size with generous line-height — let the type breathe.</p>

        <h2>A Section Heading</h2>

        <p>Content under the section heading. The article body is constrained to 680px for optimal reading line length.</p>

        <p>Another paragraph. Add as many as needed. Each one gets bottom margin automatically.</p>
      </div>
    </main>

    <hr class="rule">

    <nav class="article-nav" aria-label="Post navigation">
      <a href="#">&larr; Previous post</a>
      <a href="#">Next post &rarr;</a>
    </nav>

    <hr class="rule">

    <footer class="footer">
      <span>&copy; 2026 Zack Gaudreau</span>
    </footer>

  </div>

  <script src="../js/main.js"></script>
</body>
</html>
```

- [ ] **Step 2: Verify in browser**

Open `http://localhost:8000/blog/post-template.html`. Check:
- Tag and italic title render in article header
- Date in mono below the title
- Heavy rule separates header from body
- Body copy is constrained to ~680px and has generous line spacing
- `h2` inside article body renders smaller than the article title but still prominent
- Prev/Next nav at the bottom

- [ ] **Step 3: Commit**

```bash
git add blog/post-template.html
git commit -m "scaffold: add blog post template"
```

---

## Task 6: projects/index.html — projects gallery

**Files:**
- Create: `projects/index.html`

- [ ] **Step 1: Write projects/index.html**

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Projects &mdash; Zack Gaudreau</title>
  <link rel="stylesheet" href="../style.css">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400;1,600&family=Courier+Prime:ital,wght@0,400;0,700;1,400&family=Lora:ital,wght@0,400;0,500;1,400&display=swap" rel="stylesheet">
</head>
<body class="page-projects">

  <div class="container">

    <header class="masthead">
      <div class="masthead__top">
        <a href="/">zgaudreau.com</a>
        <span>vol. 1 &middot; 2026</span>
      </div>
      <hr class="rule rule--heavy">
      <button class="nav-toggle" id="nav-toggle" aria-expanded="false" aria-controls="main-nav">Menu</button>
      <nav class="masthead__nav" id="main-nav">
        <a href="/projects/" class="active">Projects</a>
        <a href="/blog/">Blog</a>
        <a href="/#about">About</a>
      </nav>
      <hr class="rule">
    </header>

    <main>
      <h2 style="font-style: italic; margin: var(--space-md) 0;">Projects</h2>
      <hr class="rule">

      <div class="projects-grid">

        <article class="project-card">
          <span class="tag">3D Printing</span>
          <h3 class="project-card__title">Project Name</h3>
          <p class="project-card__desc">Short description of what this project is, why it was interesting, and what you learned or built.</p>
          <span class="project-card__status">Ongoing</span>
        </article>

        <article class="project-card">
          <span class="tag">Woodworking</span>
          <h3 class="project-card__title">Project Name</h3>
          <p class="project-card__desc">Short description of what this project is, why it was interesting, and what you learned or built.</p>
          <span class="project-card__status">Complete</span>
        </article>

        <article class="project-card">
          <span class="tag">AI</span>
          <h3 class="project-card__title">Project Name</h3>
          <p class="project-card__desc">Short description of what this project is, why it was interesting, and what you learned or built.</p>
          <span class="project-card__status">Ongoing</span>
        </article>

        <article class="project-card">
          <span class="tag">Woodworking</span>
          <h3 class="project-card__title">Project Name</h3>
          <p class="project-card__desc">Short description of what this project is, why it was interesting, and what you learned or built.</p>
          <span class="project-card__status">Complete</span>
        </article>

      </div>
    </main>

    <hr class="rule">

    <footer class="footer">
      <span>&copy; 2026 Zack Gaudreau</span>
    </footer>

  </div>

  <script src="../js/main.js"></script>
</body>
</html>
```

- [ ] **Step 2: Verify in browser**

Open `http://localhost:8000/projects/`. Check:
- "Projects" nav link is active
- Two-column grid of project cards
- Each card: red tag → title (display serif) → description (body, muted) → status (mono, muted)
- Bold top border on each card (2px solid ink)

- [ ] **Step 3: Commit**

```bash
git add projects/index.html
git commit -m "scaffold: add projects gallery page"
```

---

## Task 7: js/main.js — mobile nav toggle

**Files:**
- Modify: `js/main.js`

- [ ] **Step 1: Write js/main.js**

```javascript
document.addEventListener('DOMContentLoaded', function () {
  const toggle = document.getElementById('nav-toggle');
  const nav = document.getElementById('main-nav');

  if (!toggle || !nav) return;

  toggle.addEventListener('click', function () {
    const isOpen = nav.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(isOpen));
    toggle.textContent = isOpen ? 'Close' : 'Menu';
  });
});
```

- [ ] **Step 2: Verify on narrow viewport**

Open `http://localhost:8000` in browser. Open DevTools → toggle device toolbar → set width to 375px (iPhone). Check:
- "Menu" button is visible; nav links are hidden
- Clicking "Menu" reveals the nav links stacked vertically; button text changes to "Close"
- Clicking "Close" collapses the nav again
- Repeat on `/blog/`, `/blog/post-template.html`, and `/projects/`

- [ ] **Step 3: Commit**

```bash
git add js/main.js
git commit -m "scaffold: add mobile nav toggle"
```

---

## Task 8: final check and push

- [ ] **Step 1: Full cross-page review**

With the server running (`python -m http.server 8000`), open each URL and verify:

| URL | Check |
|-----|-------|
| `http://localhost:8000` | Two-column layout, fonts load, About anchor works |
| `http://localhost:8000/projects/` | 2-col grid, "Projects" nav active |
| `http://localhost:8000/blog/` | Post list with rules, "Blog" nav active |
| `http://localhost:8000/blog/post-template.html` | Article body max-width, prev/next nav |

Resize each page to 375px wide and verify the mobile nav toggle works on all four.

- [ ] **Step 2: Update CLAUDE.md with stack**

Open `CLAUDE.md` and replace the `## Tech Stack` section body with:

```
Use vanilla HTML, CSS, and JavaScript. Include all CSS and JavaScript inline in a single file unless otherwise specified.

Fonts: Cormorant Garamond (display), Lora (body), Courier Prime (mono) — loaded from Google Fonts.
Design tokens defined in `:root` at the top of `style.css`.
```

- [ ] **Step 3: Final commit and push**

```bash
git add CLAUDE.md
git commit -m "scaffold: update CLAUDE.md with confirmed tech stack"
git push
```
