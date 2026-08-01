# Guestbook — v1 Launch Scope

> This document defines what must be true for the app to launch publicly.  
> Do not add features from the "Out of scope" list without explicit owner approval.

---

## Must-have before public launch (blockers)

These are non-negotiable. The app cannot launch publicly without them.

### Security
- [ ] Supabase credentials removed from source code and stored as environment secrets
- [ ] Row Level Security enabled on all Supabase tables
- [ ] RLS policies written for: public reads, authenticated inserts, owner-only updates, admin-only claim transitions
- [ ] Admin and manager routes protected so only authenticated users with the right role can access them

### Auth flow
- [ ] `app/auth/verify.js` screen exists and handles post-signup email verification
- [ ] Signup "Welcome to xplorer" copy corrected to "Guestbook"
- [ ] Signup success reliably routes the user to the correct dashboard for their account type

### Core features
- [ ] QR scanner (`app/scan.js`) implemented — guests must be able to scan a QR code and land on the correct property or business page
- [ ] `app/property/edit.js` accepts a route parameter `[id]` so manager dashboard property editing works
- [ ] Manager dashboard navigation to property edit does not crash

### Stability
- [ ] All dependency versions pinned to exact numbers (no `"latest"`)
- [ ] `database/schema.sql` updated to match the live Supabase schema exactly
- [ ] `app/manager/dashboard` and `app/admin/dashboard` declared in `_layout.js`

---

## In scope for v1 (existing features to ship as-is)

These screens and flows exist and work well enough to ship, with the blockers above resolved:

- Home screen / auth gate
- Email/password signup and login (explorer and manager account types)
- Admin account type (manually assigned via database)
- Map view (native on mobile, list fallback on web)
- Business listings: view, create, claim, edit, reviews, owner responses
- Property listings: view, create, claim, edit, reviews, owner responses, QR display
- Guest property landing page
- QR code generation (business dashboard, property dashboard, property page)
- Manager dashboard: business and property lists
- Admin: claims review and ownership assignment
- Profile: view, edit, photo upload
- Public profiles

---

## Out of scope for v1 (do not build)

- Manager dashboard analytics / events / activities (currently shows "Upgrade to unlock" — leave as-is)
- Saved places (`app/saved.js`) — leave for v2 unless confirmed working
- `app/place.js` — legacy screen, leave untouched
- Push notifications
- Social login (Google, Apple)
- In-app messaging between guests and owners
- Payment or booking integration
- Native mobile app store submission (App Store / Google Play)
- Automated testing suite (manual checklist is the v1 standard)
- Search / filter beyond the existing map markers

---

## Definition of done for launch

The app is ready to launch when:

1. All items in the "Must-have" list above are checked
2. Every flow in `TESTING_CHECKLIST.md` passes on a real mobile device (or mobile-size browser)
3. No console errors appear during normal navigation
4. The Supabase dashboard shows RLS enabled on all tables
5. Credentials are confirmed to be out of the source code
6. The app loads and is usable on a phone browser without crashing
