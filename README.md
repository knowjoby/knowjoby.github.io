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

### 3. Stand up the OAuth proxy (so the /admin login works)

Decap needs a tiny OAuth handler. The free way is Netlify:

1. Go to https://app.netlify.com → **Add new site → Import from Git** → pick **any**
   placeholder repo (you can fork `decaporg/decap-cms` or use an empty repo).
   The site doesn't host anything — it only handles login.
2. In **Site settings → Identity** — skip; we don't use Netlify Identity.
3. In **Site settings → Access & security → OAuth → Install provider** →
   choose **GitHub** → paste the **Client ID** and **Client Secret** from a
   GitHub OAuth app you create here:
   - https://github.com/settings/developers → **New OAuth App**
   - Homepage URL: `https://knowjoby.github.io`
   - Authorization callback URL: `https://<your-netlify-subdomain>.netlify.app/.netlify/identity/callback`
     (Netlify shows the exact URL in the OAuth setup screen — use that one.)
4. Note your Netlify subdomain — e.g. `knowjoby-blog-auth.netlify.app`.

### 4. Wire the proxy into the CMS

Edit `admin/config.yml` and replace:

```yaml
base_url: https://REPLACE-ME.netlify.app
```

with your real Netlify subdomain, then commit and push.

### 5. Use it

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
