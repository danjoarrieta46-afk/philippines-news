# Philippine News Hub 🇵🇭

A free, lightweight Philippines news aggregator using RSS feeds.

## Free deployment

This project is designed for GitHub Pages. GitHub Pages can host static HTML/CSS/JS sites from a repository on GitHub Free.

1. Create a free GitHub account.
2. Create a **public** repository, e.g. `philippines-news`.
3. Upload `index.html`, `style.css`, and `app.js`.
4. Open **Settings → Pages**.
5. Under "Build and deployment", choose **Deploy from a branch**, then `main` and `/ (root)`.
6. Save. GitHub will provide a `github.io` address.

## Important RSS note

RSS feeds can change or block cross-origin browser requests. The included demo uses `rss2json.com` as a public RSS-to-JSON bridge. Availability and limits of any public bridge can change.

For a more reliable setup while keeping the website itself free, move the RSS fetching to a free serverless function (Cloudflare Workers or GitHub Actions) and have the browser read your generated JSON.

Only display headlines/excerpts and link to the original publisher unless you have permission to republish more.
