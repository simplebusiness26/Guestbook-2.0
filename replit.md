# Guestbook

A travel discovery platform connecting Airbnb guests with local towns.

## Stack

- **Frontend:** React Native + Expo (Expo Router, file-based routing)
- **Backend:** Supabase (auth, database, storage)
- **Database:** PostgreSQL (schema in `database/schema.sql`)

## How to run

The app is exported as a static web build and served with `serve`:

```
# 1. Build (only needed after code changes)
npx expo export --platform web

# 2. Serve
npx serve dist --listen 5000
```

The `Start application` workflow runs step 2 automatically. Re-run step 1 whenever you change app code, then restart the workflow.

## Project structure

```
app/           Expo Router screens (file-based routes)
  auth/        Login, signup, verify
  business/    Business owner dashboard
  property/    Property owner dashboard
  admin/       Admin claims review
components/    Shared UI components
hooks/         Custom React hooks (useColors)
services/      Supabase client (supabase.js)
utils/         Helpers (QR code, location)
database/      SQL schema
```

## Supabase

Credentials are hardcoded in `services/supabase.js`. The `.env` file
(`SUPABASE_URL`, `SUPABASE_KEY`) is present but unused by the app code.

## Replit proxy fix

`metro.config.js` rewrites the `Host` header on every Metro request to
`localhost:5000`. This is required because Replit's preview proxy forwards
requests with an external host header that Metro's built-in origin check
would otherwise reject, causing a blank/loading preview.

## User preferences

- Keep existing project structure and stack.
