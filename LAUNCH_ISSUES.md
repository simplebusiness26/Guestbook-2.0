# Guestbook — Launch Issue List

> Prioritised list of issues to resolve before public launch.  
> Based on the audit completed 2026-07-31.  
> Update status as issues are resolved. Do not close an issue without testing the fix end-to-end.

---

## How to read this list

- **P0 — Blocker**: App cannot launch publicly without this fix
- **P1 — Important**: App works but has a significant gap that affects users
- **P2 — Polish**: Minor issues; can ship but should be addressed soon after launch

---

## P0 — Blockers

### ISSUE-001 · No Row Level Security on Supabase
**Status:** ❌ Open  
**Impact:** Any person with an internet connection can read, overwrite, or delete any row in any table using the public Supabase anon key and the REST API.  
**Fix:** Enable RLS on all tables and write explicit policies. See `SECURITY.md` for the exact SQL.  
**Test:** After applying, verify the app still reads/writes data correctly for each account type. Verify that a direct REST API call without a valid JWT is rejected.  
**Files:** Supabase dashboard only — no app code changes needed for RLS itself.

---

### ISSUE-002 · Supabase credentials hardcoded in source
**Status:** ❌ Open  
**Impact:** The Supabase URL and anon key are visible in `services/supabase.js` and in the compiled JS bundle at `dist/_expo/static/js/web/entry-*.js`. Anyone who views the source or the bundle can extract them.  
**Fix:** Move to Replit Secrets with `EXPO_PUBLIC_` prefix. See `SECURITY.md` for exact steps.  
**Do this after** ISSUE-001 (RLS) is applied — do not rotate the key until RLS is live.  
**Files:** `services/supabase.js`, `.env`, Replit Secrets panel.

---

### ISSUE-003 · `app/auth/verify.js` does not exist
**Status:** ❌ Open  
**Impact:** After signup, Supabase sends a verification email. The app declares `/auth/verify` in `_layout.js` and navigates there after signup, but the file doesn't exist. New users hit a blank/broken screen.  
**Fix:** Create `app/auth/verify.js` — a simple screen telling the user to check their email, with a "Back to Login" button.  
**Files:** Create `app/auth/verify.js`. Add `<Stack.Screen name="auth/verify" />` is already in `_layout.js` — no change needed there.

---

### ISSUE-004 · QR scanner (`app/scan.js`) is a placeholder
**Status:** ❌ Open  
**Impact:** The QR scan screen is a core guest-facing feature (guests scan a QR code at a property to leave a review). The screen currently shows only a title and placeholder text — no camera, no scanning.  
**Fix:** Implement using `expo-camera` (already installed). Request camera permission, show a viewfinder, decode QR codes, and navigate to the correct `/business/:id` or `/property/:id` route.  
**Note:** Needs a web fallback (camera not available in browser) — show a manual URL input or a message directing users to use the mobile app.  
**Files:** `app/scan.js` (full implementation needed).

---

### ISSUE-005 · `app/property/edit.js` not parameterised
**Status:** ❌ Open  
**Impact:** Manager dashboard navigates to `/property/edit/${id}` but `app/property/edit.js` has no route parameter. The edit form loads but has no way to know which property to load, breaking property editing for all managers.  
**Fix:** Rename `app/property/edit.js` to `app/property/edit/[id].js` (mirroring the existing `app/business/edit/[id].js` pattern) and update it to read the `id` param from `useLocalSearchParams()`.  
**Files:** `app/property/edit.js` → `app/property/edit/[id].js`.

---

### ISSUE-006 · No auth guards on admin and manager routes
**Status:** ❌ Open  
**Impact:** Anyone who knows the URL can access `/admin/claims` and approve ownership requests for any business or property.  
**Fix:** Add session checks at the top of each protected screen. Redirect to `/auth/login` if no session. Redirect to `/` if session exists but role is wrong.  
**Fix one file at a time, test after each.**  
**Files:** `app/admin/claims.js`, `app/admin/dashboard.js`, `app/manager/dashboard.js`, `app/business/add.js`, `app/property/add.js`.

---

### ISSUE-007 · All dependency versions pinned to `"latest"`
**Status:** ❌ Open  
**Impact:** A fresh `npm install` on any machine will pull whatever version is current that day. A major Expo SDK update will silently break the app.  
**Fix:** Run `npx expo install --check` to get the correct versions for the current SDK, then pin all packages to exact versions in `package.json`.  
**Files:** `package.json`, `package-lock.json`.

---

## P1 — Important

### ISSUE-008 · `database/schema.sql` does not match live database
**Status:** ❌ Open  
**Impact:** The schema file is an earlier version that is missing `profiles`, `claims`, `owner_id` columns, and all the columns the app actually uses. It is impossible to recreate the database from the repo.  
**Fix:** Export the current live schema from Supabase (Dashboard → Database → Schema → Export) and replace `database/schema.sql`. Do not run this against the live database — it is documentation only.  
**Files:** `database/schema.sql`.

---

### ISSUE-009 · `manager/dashboard` and `admin/dashboard` not declared in `_layout.js`
**Status:** ❌ Open  
**Impact:** Both screens resolve via Expo Router's filesystem routing, but without Stack declarations they get no header configuration, back-button control, or transition options. Behaviour may differ between platforms.  
**Fix:** Add `<Stack.Screen name="manager/dashboard" />` and `<Stack.Screen name="admin/dashboard" />` to `app/_layout.js`.  
**Files:** `app/_layout.js`.

---

### ISSUE-010 · Stale "Welcome to xplorer" copy in signup flow
**Status:** ❌ Open  
**Impact:** The app is called Guestbook but the signup screen uses the old name "xplorer". Unprofessional for a public launch.  
**Fix:** Search `app/auth/signup.js` for "xplorer" and replace with "Guestbook".  
**Files:** `app/auth/signup.js`.

---

### ISSUE-011 · Phone number not stored in Supabase Auth metadata
**Status:** ❌ Open  
**Impact:** Phone number is collected at signup and stored in `profiles` only. If the `profiles` row is ever lost or regenerated from Auth, the phone number is unrecoverable.  
**Fix:** Pass phone (and full name) in the `data` object of `supabase.auth.signUp()` so it's stored in Auth metadata as a backup.  
**Files:** `app/auth/signup.js`.

---

### ISSUE-012 · QR code rendering unconfirmed on web
**Status:** ⚠️ Unverified  
**Impact:** `react-native-qrcode-svg` uses SVG and should work via `react-native-web`, but this has not been confirmed in the static web build. If it doesn't render, the QR display on property pages and dashboards is broken on web.  
**Fix:** Open the business dashboard and property dashboard in a desktop browser, and the property public page, and confirm QR codes render. If not, add a web-specific fallback using a plain SVG QR library.  
**Files:** Potentially `components/QRCodeGenerator.js`.

---

## P2 — Polish (post-launch)

### ISSUE-013 · `app/saved.js` status unknown
**Status:** ⚠️ Unverified  
**Notes:** Screen exists and is in the menu. Needs runtime testing to confirm it works or identify what's broken.

### ISSUE-014 · `app/place.js` appears to be legacy
**Status:** ⚠️ Unverified  
**Notes:** No navigation path into this screen from the current menu. May be safe to remove, or may be linked from somewhere not yet found. Do not delete without confirming.

### ISSUE-015 · Manager dashboard analytics sections are hardcoded placeholders
**Status:** ❌ Open — deferred to post-launch by design  
**Notes:** "Activities", "Events", and "Analytics" sections show "Upgrade to unlock". This is intentional for v1. Leave as-is.

### ISSUE-016 · No automated tests
**Status:** ❌ Open — deferred to post-launch  
**Notes:** Use `TESTING_CHECKLIST.md` manually until the app is stable enough to invest in automation.

---

## Resolved issues

| Issue | Resolution | Date |
|---|---|---|
| Merge conflict in `app/business/[id].js` | Resolved — kept "✓ Verified Business" | 2026-07-30 |
| Merge conflict in `app/property/[id].js` | Resolved — kept `account_type === "manager"` | 2026-07-30 |
| Expo workflow misconfigured (`serve dist` instead of Metro) | Fixed — now uses `node watch.js` with static export | 2026-07-30 |
| Metro host-check blocking Replit proxy | Fixed — `metro.config.js` rewrites Host/Origin; then switched to static serving | 2026-07-30 |
