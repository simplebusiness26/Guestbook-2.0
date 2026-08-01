# Guestbook — Agent Instructions

> **Read this entire file before touching any code.**  
> These instructions are permanent. They override any general instincts about "cleaning up" or "improving" the codebase.

---

## What this app is

Guestbook is a React Native + Expo mobile app (served as a web preview on Replit) that connects Airbnb guests with local businesses and property owners. The live backend is a Supabase project with a PostgreSQL database.

The owner is **non-technical and phone-only**. Every change must leave the app in a working, testable state. If you break something, fix it before stopping.

---

## Architecture — do not change these without explicit permission

| Layer | Technology | Notes |
|---|---|---|
| Frontend | React Native + Expo SDK (latest) | File-based routing via Expo Router |
| Navigation | Expo Router (`app/` directory) | Stack navigator configured in `app/_layout.js` |
| Backend | Supabase (hosted) | URL + anon key in `services/supabase.js` |
| Database | PostgreSQL via Supabase | See `database/schema.sql` (note: schema is outdated — see SECURITY.md) |
| Web serving | Static export → `serve dist/` | Built with `npx expo export --platform web` |
| Dev workflow | `node watch.js` | Watches source files, rebuilds on save, serves on port 5000 |

---

## How to run the app

```
# The workflow does this automatically:
node watch.js

# Manual rebuild (if needed):
npx expo export --platform web
```

The `Start application` workflow runs `node watch.js`, which:
1. Builds `dist/` via `npx expo export --platform web`
2. Starts `serve dist --listen 5000`
3. Watches `app/`, `components/`, `hooks/`, `services/`, `utils/` and rebuilds on any file save

---

## Mandatory workflow for every change

**Follow this exactly. Do not skip steps.**

1. Make one focused change (one file or one logical unit)
2. Save the file
3. Verify the file is saved (read it back and confirm)
4. Wait for `watch.js` to rebuild (check workflow logs for `[watch] Build complete`)
5. Check browser/workflow logs for errors
6. If errors: fix them before touching any other file
7. Take a screenshot to confirm the preview still loads
8. Only then proceed to the next change

> The owner reviews the app on a phone. A blank screen or crash is a blocker that must be resolved immediately.

---

## What you must NOT do

- ❌ Do not alter the live Supabase database schema, RLS policies, or data
- ❌ Do not redesign any screen or change any UI layout
- ❌ Do not rename or move any existing route files
- ❌ Do not add new npm packages without checking compatibility with the current Expo SDK version
- ❌ Do not change the Supabase URL or anon key in `services/supabase.js` (see SECURITY.md for the right fix)
- ❌ Do not proceed to feature work if there are unresolved errors
- ❌ Do not change the serving architecture (static export → serve) without discussion
- ❌ Do not run `npm audit fix --force` — it will break Expo SDK version alignment

---

## Account types (confirmed from code)

| Type | How set | Access |
|---|---|---|
| `explorer` | Default signup choice | Browse map, write reviews, save places |
| `manager` | Signup choice | Manager dashboard, claim businesses/properties |
| Admin | `is_admin = true` set manually in DB | `/admin/claims`, `/admin/dashboard` |

Routes are **not** protected by auth guards in code — any URL is currently accessible without login. Do not add auth guards without also testing every affected route end-to-end.

---

## Key files and what they do

```
app/_layout.js          Stack navigator — all named routes declared here
app/index.js            Home screen + auth gate
app/menu.js             Role-based navigation menu
services/supabase.js    Supabase client (credentials hardcoded — see SECURITY.md)
components/Header.js    Shared header used on all screens
components/QRCodeGenerator.js  QR code rendering component
watch.js                Replit dev watcher (build + serve)
database/schema.sql     OUTDATED schema — does not match live DB
LAUNCH_ISSUES.md        Prioritised list of issues to fix before launch
TESTING_CHECKLIST.md    Manual test checklist — run after every significant change
SECURITY.md             Security requirements and environment variable docs
LAUNCH_SCOPE.md         What is and is not in scope for v1 public launch
```

---

## Known issues — do not work around, fix properly

See `LAUNCH_ISSUES.md` for the full prioritised list. The top blockers are:

1. No RLS on Supabase — database is publicly writable
2. Supabase credentials hardcoded in source
3. `app/auth/verify.js` does not exist
4. `app/scan.js` is a placeholder — QR scanning not implemented
5. `app/property/edit.js` is not parameterised (manager dashboard navigation broken)

---

## Testing

Before marking any task complete, run the relevant sections of `TESTING_CHECKLIST.md` manually and confirm no regressions. There are no automated tests — you are the safety net.

---

## Asking for clarification

If a requested change could affect a route, a Supabase table, or an existing screen's behaviour — stop and ask before implementing. The owner is non-technical; changes that seem minor in code can break the app on their phone.
