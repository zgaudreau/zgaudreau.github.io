# Jekyll Content Management Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Convert the existing static HTML scaffold to Jekyll so new blog posts and project pages are created by dropping a markdown file, with GitHub Pages building automatically on push.

**Architecture:** Jekyll layouts wrap existing HTML/CSS structure; existing files get YAML frontmatter and Liquid template tags replacing hardcoded content; a shared masthead include eliminates duplication. No visual changes — all CSS class names and style.css are unchanged.

**Tech Stack:** Jekyll (GitHub Pages native), Liquid templating, YAML frontmatter, Ruby/Bundler (local development only)

---

## File Map

**Create:**
- `_config.yml` — site settings, permalink config, collection registration
- `Gemfile` — pins to github-pages gem for local development parity
- `_includes/masthead.html` — shared nav partial (extracted from current index.html)
- `_layouts/default.html` — base page wrapper (head, masthead include, footer, scripts)
- `_layouts/post.html` — blog post wrapper (extends default)
- `_layouts/project.html` — project detail wrapper (extends default)
- `_posts/2026-05-06-welcome.md` — first sample blog post
- `_projects/cnc-router.md` — first sample project with `featured: true`

**Modify:**
- `index.html` — add frontmatter; replace hardcoded featured/sidebar content with Liquid
- `blog/index.html` — add frontmatter; replace hardcoded post list with Liquid loop
- `projects/index.html` — add frontmatter; replace hardcoded project cards with Liquid loop
- `.gitignore` — add Jekyll build artifacts

**Delete:**
- `blog/post-template.html` — superseded by `_layouts/post.html`

---

### Task 1: Jekyll config, Gemfile, and .gitignore

**Files:**
- Create: `_config.yml`
- Create: `Gemfile`
- Modify: `.gitignore`

- [ ] **Step 1: Create `_config.yml`**

```yaml
title: zgaudreau.com
url: https://zgaudreau.com
baseurl: ""
permalink: /blog/:title/
collections:
  projects:
    output: true
    permalink: /projects/:name/
exclude:
  - Gemfile
  - Gemfile.lock
  - docs/
  - vendor/
```

- [ ] **Step 2: Create `Gemfile`**

```ruby
source "https://rubygems.org"

gem "github-pages", group: :jekyll_plugins
```

This pins Jekyll and all plugins to the exact versions GitHub Pages uses, so local builds match production.

- [ ] **Step 3: Update `.gitignore`**

Current contents of `.gitignore`:
```
.superpowers/
```

Replace with:
```
.superpowers/
_site/
.jekyll-cache/
.jekyll-metadata
.bundle/
vendor/
```

- [ ] **Step 4: Verify (optional — requires Ruby/Bundler)**

If Ruby is installed locally, run:
```
bundle install
```
Expected: Dependencies installed to `vendor/bundle/`. No errors.

If Ruby is not installed locally, skip to Task 2 — GitHub Pages will build automatically on push. Verify after pushing in Task 10.

- [ ] **Step 5: Commit**

```
git add _config.yml Gemfile .gitignore
git commit -m "feat: add Jekyll config and Gemfile"
```

---

### Task 2: Masthead include

**Files:**
- Create: `_includes/masthead.html`

The masthead HTML is currently duplicated in every page. Extract it once into `_includes/masthead.html`. The active nav state is detected via `page.url` so it works automatically on every page.

- [ ] **Step 1: Create `_includes/masthead.html`**

```html
<header class="masthead">
  <div class="masthead__top">
    <a href="/">zgaudreau.com</a>
    <span>vol. 1 &middot; 2026</span>
  </div>
  <hr class="rule rule--heavy">
  <button class="nav-toggle" id="nav-toggle" aria-expanded="false" aria-controls="main-nav">Menu</button>
  <nav class="masthead__nav" id="main-nav">
    <a href="/projects/"{% if page.url contains '/projects/' %} class="active"{% endif %}>Projects</a>
    <a href="/blog/"{% if page.url contains '/blog/' %} class="active"{% endif %}>Blog</a>
    <a href="/#about">About</a>
  </nav>
  <hr class="rule">
</header>
```

- [ ] **Step 2: Commit**

```
git add _includes/masthead.html
git commit -m "feat: add shared masthead include"
```

---

### Task 3: Default layout

**Files:**
- Create: `_layouts/default.html`

The default layout is the full HTML page shell. Every other layout extends this one using `layout: default` in its frontmatter. It includes the masthead partial and renders `{{ content }}` for the page body.

- [ ] **Step 1: Create `_layouts/default.html`**

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
</body>
</html>
```

- [ ] **Step 2: Commit**

```
git add _layouts/default.html
git commit -m "feat: add default layout"
```

---

### Task 4: Post layout

**Files:**
- Create: `_layouts/post.html`

The post layout extends default and wraps the markdown content in the existing article-header/article-body/article-nav HTML structure. `{{ content }}` renders the markdown body.

- [ ] **Step 1: Create `_layouts/post.html`**

```html
---
layout: default
---
<main>
  <header class="article-header">
    <span class="tag">{{ page.category | upcase }}</span>
    <h1 class="article-header__title">{{ page.title }}</h1>
    <p class="article-header__meta">{{ page.date | date: "%B %-d, %Y" }}</p>
  </header>

  <hr class="rule rule--heavy">

  <div class="article-body">
    {{ content }}
  </div>

  <hr class="rule">

  <nav class="article-nav" aria-label="Post navigation">
    {% if page.previous.url %}<a href="{{ page.previous.url }}">&larr; Previous</a>{% endif %}
    {% if page.next.url %}<a href="{{ page.next.url }}">Next &rarr;</a>{% endif %}
  </nav>
</main>
```

Note: `%-d` (day without leading zero) works on Linux/macOS and on GitHub Pages. If running Jekyll locally on Windows, use `%d` instead (gives zero-padded day like "06") — the difference is cosmetic.

- [ ] **Step 2: Commit**

```
git add _layouts/post.html
git commit -m "feat: add post layout"
```

---

### Task 5: Project layout

**Files:**
- Create: `_layouts/project.html`

The project layout is structurally identical to the post layout but shows a status badge instead of a date, and omits previous/next navigation (projects are not date-ordered).

- [ ] **Step 1: Create `_layouts/project.html`**

```html
---
layout: default
---
<main>
  <header class="article-header">
    <span class="tag">{{ page.category | upcase }}</span>
    <h1 class="article-header__title">{{ page.title }}</h1>
    <p class="article-header__meta">
      <span class="section-label">{{ page.status | upcase }}</span>
    </p>
  </header>

  <hr class="rule rule--heavy">

  <div class="article-body">
    {{ content }}
  </div>
</main>
```

- [ ] **Step 2: Commit**

```
git add _layouts/project.html
git commit -m "feat: add project layout"
```

---

### Task 6: Convert index.html to Liquid template

**Files:**
- Modify: `index.html`

Add frontmatter and replace the hardcoded featured project block and recent posts sidebar with Liquid. The about section stays static — it's personal copy, not content from a collection.

The default layout now handles `<head>`, masthead, footer, and scripts — so those are removed from `index.html`. Only the `<main>` content and the about section remain.

- [ ] **Step 1: Replace the full contents of `index.html`**

```html
---
layout: default
page_class: page-home
---
<main>
  <div class="editorial-grid">

    {% assign featured = site.projects | where: "featured", true | first %}
    {% if featured %}
    <section aria-label="Featured project">
      <span class="tag">{{ featured.category | upcase }}</span>
      <h1 class="featured__title">{{ featured.title }}</h1>
      <p class="featured__desc">{{ featured.description }}</p>
      <a href="{{ featured.url }}" class="featured__link">Read more &rarr;</a>
    </section>
    {% else %}
    <section aria-label="Featured project">
      <span class="tag">Projects</span>
      <h1 class="featured__title">Nothing featured yet</h1>
      <p class="featured__desc">Add <code>featured: true</code> to a project in <code>_projects/</code>.</p>
      <a href="/projects/" class="featured__link">View all projects &rarr;</a>
    </section>
    {% endif %}

    <aside aria-label="Recent posts and about">
      <p class="section-label">Recent Posts</p>
      <div class="recent-posts">
        {% for post in site.posts limit: 5 %}
        <article class="recent-post">
          <span class="recent-post__date">{{ post.date | date: "%b %Y" }}</span>
          <a href="{{ post.url }}" class="recent-post__title">{{ post.title }}</a>
        </article>
        {% else %}
        <p style="color: var(--color-muted); font-size: var(--text-sm);">No posts yet.</p>
        {% endfor %}
      </div>

      <hr class="rule">

      <p class="section-label">About</p>
      <p class="about-blurb">I'm Zack &mdash; a maker and tinkerer. I build things with wood, plastic, and code. This is where I keep notes on what I'm working on.</p>
      <a href="/#about" class="featured__link">More about me &rarr;</a>
    </aside>

  </div>
</main>

<hr class="rule rule--heavy">

<section id="about" style="padding: var(--space-lg) 0;">
  <h2>About</h2>
  <p style="max-width: var(--max-width-prose); margin-top: var(--space-md); line-height: 1.8;">More about Zack goes here. Who you are, what you make, what this site is about. Written in first person, conversational tone. A few sentences is enough.</p>
</section>
```

- [ ] **Step 2: Commit**

```
git add index.html
git commit -m "feat: convert homepage to Jekyll Liquid template"
```

---

### Task 7: Convert blog/index.html to Liquid template

**Files:**
- Modify: `blog/index.html`

Replace hardcoded post entries with a Liquid loop over `site.posts`. The `{% else %}` block handles the empty state gracefully.

- [ ] **Step 1: Replace the full contents of `blog/index.html`**

```html
---
layout: default
page_class: page-blog
title: Blog
---
<main>
  <h2 style="font-style: italic; margin: var(--space-md) 0;">Blog</h2>
  <hr class="rule">

  {% for post in site.posts %}
  <article class="post-entry">
    <p class="post-entry__date">{{ post.date | date: "%B %Y" }}</p>
    <a href="{{ post.url }}" class="post-entry__title">{{ post.title }}</a>
    <span class="tag">{{ post.category | upcase }}</span>
    <p class="post-entry__excerpt">{{ post.excerpt }}</p>
  </article>
  <hr class="rule">
  {% else %}
  <p style="color: var(--color-muted);">No posts yet.</p>
  {% endfor %}
</main>
```

- [ ] **Step 2: Commit**

```
git add blog/index.html
git commit -m "feat: convert blog listing to Jekyll Liquid template"
```

---

### Task 8: Convert projects/index.html to Liquid template

**Files:**
- Modify: `projects/index.html`

Replace hardcoded project cards with a Liquid loop over `site.projects`. Project titles link to each project's generated detail page.

- [ ] **Step 1: Replace the full contents of `projects/index.html`**

```html
---
layout: default
page_class: page-projects
title: Projects
---
<main>
  <h2 style="font-style: italic; margin: var(--space-md) 0;">Projects</h2>
  <hr class="rule">

  <div class="projects-grid">
    {% for project in site.projects %}
    <article class="project-card">
      <span class="tag">{{ project.category | upcase }}</span>
      <h3 class="project-card__title">
        <a href="{{ project.url }}">{{ project.title }}</a>
      </h3>
      <p class="project-card__desc">{{ project.description }}</p>
      <span class="project-card__status section-label">{{ project.status | upcase }}</span>
    </article>
    {% else %}
    <p style="color: var(--color-muted);">No projects yet.</p>
    {% endfor %}
  </div>
</main>
```

- [ ] **Step 2: Commit**

```
git add projects/index.html
git commit -m "feat: convert projects listing to Jekyll Liquid template"
```

---

### Task 9: Add sample content

**Files:**
- Create: `_posts/2026-05-06-welcome.md`
- Create: `_projects/cnc-router.md`

Sample content exercises both the post and project pipelines. The `cnc-router` project has `featured: true`, so it appears in the homepage hero block.

- [ ] **Step 1: Create `_posts/2026-05-06-welcome.md`**

```markdown
---
layout: post
page_class: page-post
title: "Welcome to the site"
date: 2026-05-06
category: meta
excerpt: "A quick hello and a note on what this site is for."
---

Hello. This is the first post on this site.

I built this place as a home for things I make — 3D prints, woodworking projects, AI experiments, and whatever else catches my attention. Not a professional portfolio, just a log.

## What to expect

Project write-ups with photos (eventually). Notes on things I figured out. The occasional opinion. Nothing polished.

If you know me, welcome. If you don't, hi — I'm Zack.
```

- [ ] **Step 2: Create `_projects/cnc-router.md`**

```markdown
---
layout: project
page_class: page-projects
title: "CNC Router From Scratch"
category: woodworking
status: ongoing
description: "Building a 3-axis CNC router from salvaged parts, linear rails, and a lot of patience."
featured: true
---

I've wanted a CNC router for a while but couldn't justify buying one. So I'm building one.

## The plan

Start with a simple 3-axis design: 600mm x 400mm work area, salvaged stepper motors from a dead 3D printer, and linear rails picked up secondhand. Control board is a GRBL-based CNC shield on an Arduino Uno.

## Progress

Frame assembled, X and Y axes moving. Z axis is next. Squaring everything up took longer than expected.

More updates as it comes together.
```

- [ ] **Step 3: Commit**

```
git add _posts/2026-05-06-welcome.md _projects/cnc-router.md
git commit -m "content: add first post and project"
```

---

### Task 10: Clean up and verify

**Files:**
- Delete: `blog/post-template.html`

`blog/post-template.html` was the static template for individual posts. It is now superseded by `_layouts/post.html` and can be removed.

- [ ] **Step 1: Delete `blog/post-template.html`**

```
git rm blog/post-template.html
```

- [ ] **Step 2: Build and verify locally (if Ruby/Bundler is available)**

```
bundle exec jekyll build
```

Expected output (no errors):
```
      Generating...
                    done in X.XXX seconds.
 Auto-regeneration: disabled. Use --watch to enable.
```

Check that key files were generated:
```
dir _site\index.html
dir _site\blog\welcome\index.html
dir _site\blog\index.html
dir _site\projects\cnc-router\index.html
dir _site\projects\index.html
```
All five should exist.

If Ruby is not available locally: skip to Step 3. GitHub Pages will build on push and report errors via the repository's Actions tab (look for "pages build and deployment" workflow).

- [ ] **Step 3: Commit the deletion**

```
git commit -m "chore: remove static post-template.html, superseded by Jekyll layout"
```

- [ ] **Step 4: Push and verify on GitHub Pages**

```
git push origin master
```

After ~30–60 seconds, visit:
- `https://zgaudreau.github.io/` — homepage with CNC Router featured and "Welcome to the site" in sidebar
- `https://zgaudreau.github.io/blog/` — blog listing with the welcome post
- `https://zgaudreau.github.io/blog/welcome/` — full post rendered with Lora body copy
- `https://zgaudreau.github.io/projects/` — project grid with CNC Router card linking to its detail page
- `https://zgaudreau.github.io/projects/cnc-router/` — project detail page

If the GitHub Pages build fails, check the Actions tab at `https://github.com/zgaudreau/zgaudreau.github.io/actions` for the error message.

---

## Authoring Reference (for after implementation)

**New blog post:**
1. Create `_posts/YYYY-MM-DD-post-title.md`
2. Add frontmatter: `layout: post`, `page_class: page-post`, `title`, `date`, `category`, `excerpt`
3. Write body in markdown
4. `git add`, `git commit`, `git push`

**New project:**
1. Create `_projects/project-name.md`
2. Add frontmatter: `layout: project`, `page_class: page-projects`, `title`, `category`, `status`, `description`
3. Write project detail in markdown
4. To feature it on the homepage: add `featured: true` (remove from any previous featured project)
5. `git add`, `git commit`, `git push`
