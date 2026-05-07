# Jekyll Content Management — zgaudreau.com

**Date:** 2026-05-06  
**Status:** Approved

## Overview

Convert the existing static HTML scaffold to Jekyll so new blog posts and project pages are created by dropping a markdown file into the repo. GitHub Pages builds and deploys automatically on push — no CI pipeline or manual build step required.

The visual output is identical to the current scaffold. All existing CSS class names, `style.css`, and `js/main.js` are unchanged. Only the content source changes: hardcoded placeholder HTML becomes Liquid templates pulling from markdown files.

## Directory Structure

```
_config.yml                — site settings, permalink config, collection registration
_layouts/
  default.html             — masthead + footer wrapper; all pages extend this
  post.html                — extends default; wraps content in article-header/article-body/article-nav
  project.html             — extends default; same article structure with project-specific fields
_includes/
  masthead.html            — shared nav partial used by all layouts
_posts/
  YYYY-MM-DD-title.md      — one file per blog post (Jekyll naming convention required)
_projects/
  project-name.md          — one file per project; each generates its own detail page
index.html                 — homepage (Liquid template; replaces hardcoded content)
blog/
  index.html               — post listing (Liquid loop over site.posts)
projects/
  index.html               — project grid (Liquid loop over site.projects)
style.css                  — unchanged
js/
  main.js                  — unchanged
assets/                    — unchanged
CNAME                      — unchanged
```

## Configuration (`_config.yml`)

```yaml
title: zgaudreau.com
url: https://zgaudreau.com
permalink: /blog/:title/
collections:
  projects:
    output: true
    permalink: /projects/:name/
```

## Blog Posts

Location: `_posts/YYYY-MM-DD-title.md` (Jekyll requires this naming convention)  
Generated URL: `/blog/:title/` (e.g. `/blog/on-woodgrain-selection/`)  
Layout: `post.html`

Frontmatter fields:
```yaml
---
layout: post
page_class: page-blog
title: "On woodgrain selection"
date: 2026-05-06
category: woodworking
excerpt: "One-sentence teaser shown on the listing page."
---
```

Full post content follows in markdown.

## Projects Collection

Location: `_projects/project-name.md`  
Generated URL: `/projects/:name/` (e.g. `/projects/cnc-router/`)  
Layout: `project.html`

Frontmatter fields:
```yaml
---
layout: project
page_class: page-projects
title: "CNC Router From Scratch"
category: woodworking
status: ongoing
description: "Built a 3-axis router using salvaged parts and a lot of patience."
featured: true
---
```

Full project writeup follows in markdown. `status` accepts: `ongoing`, `complete`, `archived`. `featured: true` designates the project shown in the homepage hero block (only one project should have this set at a time).

## Layouts

### `_layouts/default.html`

Wraps every page. Contains:
- Google Fonts `<link>` tag
- `<link rel="stylesheet" href="/style.css">`
- `_includes/masthead.html`
- `{{ content }}` block
- Page footer
- `<script src="/js/main.js"></script>`

The `body` element receives a `class` from the page's frontmatter (`page_class`) so page-specific CSS rules (e.g. `body.page-home`) continue to work.

### `_layouts/post.html`

```
---
layout: default
---
<main>
  <header class="article-header">
    <span class="tag">{{ page.category | upcase }}</span>
    <h1 class="article-header__title">{{ page.title }}</h1>
    <p class="article-header__meta">
      <time>{{ page.date | date: "%B %-d, %Y" }}</time>
    </p>
  </header>
  <hr class="rule rule--heavy">
  <div class="article-body">{{ content }}</div>
  <hr class="rule">
  <nav class="article-nav">
    {% if page.previous.url %}<a href="{{ page.previous.url }}">← Previous</a>{% endif %}
    {% if page.next.url %}<a href="{{ page.next.url }}">Next →</a>{% endif %}
  </nav>
</main>
```

### `_layouts/project.html`

Same structure as `post.html`. The category tag, title, and status badge pull from frontmatter instead of page metadata. No previous/next navigation (projects are not ordered).

### `_includes/masthead.html`

Extracted from the current `index.html` masthead. Nav links use `page.url` to apply the `active` class:

```liquid
<a href="/blog/" {% if page.url contains '/blog/' %}class="active"{% endif %}>Blog</a>
```

## Updated List Pages

### `index.html` — Homepage

```liquid
{% assign featured = site.projects | where: "featured", true | first %}
```

Featured block renders `featured.title`, `featured.category`, `featured.description`, and links to `featured.url`.

```liquid
{% for post in site.posts limit: 5 %}
```

Sidebar post list renders `post.title`, `post.date`, and links to `post.url`.

### `blog/index.html` — Post Listing

```liquid
{% for post in site.posts %}
  <article class="post-entry">
    <time class="post-entry__date">{{ post.date | date: "%B %-d, %Y" }}</time>
    <h2 class="post-entry__title"><a href="{{ post.url }}">{{ post.title }}</a></h2>
    <span class="tag">{{ post.category | upcase }}</span>
    <p class="post-entry__excerpt">{{ post.excerpt }}</p>
  </article>
  <hr class="rule">
{% endfor %}
```

### `projects/index.html` — Project Grid

```liquid
{% for project in site.projects %}
  <article class="project-card">
    <span class="tag">{{ project.category | upcase }}</span>
    <h3 class="project-card__title">
      <a href="{{ project.url }}">{{ project.title }}</a>
    </h3>
    <p class="project-card__desc">{{ project.description }}</p>
    <span class="project-card__status section-label">{{ project.status | upcase }}</span>
  </article>
{% endfor %}
```

## Authoring Workflow

To publish a new blog post:
1. Create `_posts/YYYY-MM-DD-post-title.md` with required frontmatter
2. Write content in markdown
3. `git add`, `git commit`, `git push` — GitHub Pages builds and deploys automatically

To add a new project:
1. Create `_projects/project-name.md` with required frontmatter
2. Write project writeup in markdown
3. Push — new page available at `/projects/project-name/`

To feature a project on the homepage:
1. Set `featured: true` in that project's frontmatter
2. Remove `featured: true` from any previously featured project
3. Push

## Out of Scope

- Pagination (no limit on post/project count for now)
- Tag/category index pages
- RSS feed
- Search
- Comments
- Image galleries or asset management
