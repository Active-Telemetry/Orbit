# Orbit — Level 1 Science PWA build

This folder is a complete, installable web app. It needs no build step —
just static hosting.

## Files

- `index.html` — entry point, loads React/Babel from a CDN and your app
- `app.jsx` — the whole app (content, screens, logic)
- `manifest.json` — app name, icons, colours for the home-screen install
- `sw.js` — service worker: caches the app so it opens offline
- `icons/` — app icons (192, 512, maskable, Apple touch icon, favicon)
  — not included in this update; carry over your existing icons folder

## Hosting it

Service workers (and "Add to Home Screen" on iOS) require **HTTPS**
(localhost is exempt, for testing). Easiest free options:

- **GitHub Pages** — push this folder to a repo, enable Pages, done.
- **Netlify / Vercel drop** — drag the folder onto their web dashboard.
- **Cloudflare Pages** — same idea, drag-and-drop deploy.

## Installing on iPhone

1. Open the hosted URL in **Safari** (must be Safari, not Chrome, for
   the install prompt to work on iOS).
2. Tap the **Share** icon → **Add to Home Screen**.
3. It launches full-screen, with its own icon, no browser chrome.

## Updating it later

`app.jsx` has `APP_VERSION` near the top, and `sw.js` has a matching
`APP_VERSION` constant. When you change the app:

1. Bump both version strings to the same new value.
2. Redeploy.
3. The service worker detects the new cache name, fetches the update in
   the background, and activates it next time the app is opened. The
   version number in Settings confirms the update landed.

## Local testing

```
cd pwa
python3 -m http.server 8080
```

Then open `http://localhost:8080` — service workers are allowed on
localhost even without HTTPS, so install/offline behaviour can be
tested before deploying anywhere.
