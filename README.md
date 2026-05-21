# knowjoby.github.io

Personal blog. Jekyll (Minimal Mistakes theme) on GitHub Pages, with Decap CMS
for a GitHub-authenticated admin UI at `/admin/`.

---

## How to ship this — one-time setup

### 1. Push to GitHub

```bash
cd ~/blog-knowjoby.github.io
git init
git add .
git commit -m "Initial blog scaffold"
git branch -M main
gh repo create knowjoby/knowjoby.github.io --public --source=. --push
```

(Or create the repo `knowjoby.github.io` in the GitHub UI and `git push` to it.)

### 2. Turn on GitHub Pages

GitHub repo → **Settings → Pages** → Source: **Deploy from a branch** →
Branch: `main` / `/ (root)` → Save.

After ~1 minute the site is live at **https://knowjoby.github.io**.

### 3. OAuth proxy (how /admin login works)

Decap CMS's GitHub backend needs an OAuth proxy. We use **Netlify's hosted
endpoint** at `https://api.netlify.com/auth` — no server code to deploy.

Current setup:
- Netlify project `knowjoby-blog-auth` holds the GitHub OAuth provider
  (Site settings → Access & security → OAuth → Install provider → GitHub).
- GitHub OAuth App (`Ov23liDN9uKWS28woYwW`) callback URL is
  `https://api.netlify.com/auth/done`.
- `admin/config.yml` sets `base_url: https://api.netlify.com`,
  `auth_endpoint: auth`, `site_id: knowjoby-blog-auth.netlify.app`.
  The `site_id` is **load-bearing** — it tells Netlify which project's OAuth
  provider to use. Without it, Decap defaults to `knowjoby.github.io` and
  Netlify returns 404.

**To rotate the GitHub OAuth secret:**
1. GitHub → Settings → Developer settings → OAuth Apps → pick the app →
   **Generate a new client secret**, copy it.
2. Netlify → `knowjoby-blog-auth` site → Access & security → OAuth →
   GitHub provider → **Edit** → paste new secret → Save.
3. Revoke the old secret on GitHub. No code change needed.

**If you ever move off Netlify:** stand up any OAuth proxy that speaks
Decap's protocol (e.g. self-hosted Netlify Function from
`decaporg/decap-cms` examples, or a Cloudflare Worker like
`sterlingwes/decap-proxy`). Then in `admin/config.yml` set `base_url` to
the new origin, drop or repurpose `site_id`, and update the GitHub OAuth
App's callback URL to the new proxy's `/auth/done` (or equivalent).

### 4. Use it

Go to **https://knowjoby.github.io/admin/** → click **Login with GitHub** →
authorize → you land in the Decap editor. New post → write → **Publish**.
Decap commits a Markdown file into `_posts/`, GitHub Pages rebuilds, post is live.

---

## Writing posts without the CMS

Just drop a file into `_posts/` named `YYYY-MM-DD-slug.md` with this front-matter:

```yaml
---
title: "Your title"
date: 2026-05-21
categories: [notes]
tags: [whatever]
---

Body in Markdown.
```

`git push` and it's live.

---

## Running locally (optional)

```bash
bundle install
bundle exec jekyll serve
# → http://127.0.0.1:4000
```
