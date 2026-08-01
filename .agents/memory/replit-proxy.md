---
name: Replit proxy fix
description: Why Metro dev server doesn't work on Replit and what the working solution is
---

## The problem

Replit's preview pane proxies requests through an external domain (e.g. `abc.replit.dev`). Metro's built-in security check validates the `Host` and `Origin` headers and rejects anything not from `localhost`. This causes the preview to show "running" forever — the HTML loads but the JS bundle returns a 500.

## The fix (in use)

Static export + plain file server:

1. `npx expo export --platform web` — builds to `dist/`
2. `serve dist --listen 5000` — plain HTTP server, no host checking

`watch.js` at the project root automates this: initial build → starts serve → watches source files with chokidar → rebuilds on save.

**Why:** A plain static file server has no origin validation. Metro's dev server does, and rewriting headers in `metro.config.js` (attempted) did not fully resolve it across all request types.

## How to apply

Never switch back to `expo start --web` as the workflow command. If faster iteration is needed during development, the `watch.js` rebuild (~15s) is the accepted trade-off. Hot reload is not available in this setup.
