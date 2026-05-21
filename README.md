# knowjoby.github.io

Personal blog. Jekyll (Minimal Mistakes theme) on GitHub Pages, with a custom
single-page admin at `/admin/` that posts directly to GitHub via the Contents API.

No Netlify, no Decap, no OAuth proxy. The admin is a pure static page that
holds a GitHub Personal Access Token in `localStorage` and uses it to commit
new posts.

---

## /admin/ — one-time setup

1. Open **https://knowjoby.github.io/admin/**.
2. The setup view links to GitHub → **Settings → Developer settings →
   Personal access tokens → Fine-grained tokens → Generate new token**.
3. Create the token with:
   - **Repository access:** Only select repositories → `knowjoby/knowjoby.github.io`
   - **Repository permissions:** Contents → **Read and write**
   - (No other permissions needed.)
4. Paste the token (`github_pat_…`) into the admin and click **Save & sign in**.

The token is stored only in your browser's `localStorage` for this origin.
Sign out (or clear site data) to remove it. To rotate: revoke the token at
GitHub, generate a new one, paste again.

## Writing posts

- **Via /admin/**: + New post → fill title, date, body in Markdown → Publish.
  Commits `_posts/YYYY-MM-DD-slug.md` to `main`, GitHub Pages rebuilds in ~1 min.
- **Via git directly**: drop a file in `_posts/` named `YYYY-MM-DD-slug.md`:

  ```yaml
  ---
  title: "Your title"
  date: 2026-05-21
  tags: [notes]
  ---

  Body in Markdown.
  ```

  Then `git push`.

## Running locally (optional)

```bash
bundle install
bundle exec jekyll serve
# → http://127.0.0.1:4000
```

## Bootstrap (already done — kept for reference)

The repo was created and pushed via the GitHub UI + SSH. GitHub Pages is
configured under **Settings → Pages → Deploy from a branch → main /(root)**.
