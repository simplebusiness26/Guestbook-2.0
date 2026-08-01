# Guestbook — Security Requirements & Environment Variables

> **Current status: NOT production-safe.**  
> This document records what must be fixed before public launch and how to fix it correctly.

---

## Environment Variables Required

The app needs these variables in production. Currently they are hardcoded in source — that must change.

| Variable | Description | Where to get it | Current status |
|---|---|---|---|
| `SUPABASE_URL` | Supabase project URL | Supabase dashboard → Settings → API | ❌ Hardcoded in `services/supabase.js` |
| `SUPABASE_ANON_KEY` | Supabase anon/public key | Supabase dashboard → Settings → API | ❌ Hardcoded in `services/supabase.js` |
| `SESSION_SECRET` | Session signing secret | Already set as Replit Secret | ✅ Set (unused by app currently) |

### How to fix the credential exposure

1. Store `SUPABASE_URL` and `SUPABASE_ANON_KEY` as Replit Secrets (ask the agent to use the environment-secrets skill)
2. Update `services/supabase.js` to read from `process.env`:

```js
// Replace the hardcoded values with:
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;
```

> **Important:** Expo requires the `EXPO_PUBLIC_` prefix for environment variables to be included in the client bundle. Variables without this prefix are stripped at build time and will be `undefined` in the app.

3. Update the `.env` file to use the `EXPO_PUBLIC_` prefix:
```
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

4. Rebuild the app after making this change and verify Supabase connects correctly before committing.

---

## Supabase Row Level Security (RLS)

### Current state
🔴 **RLS is not enabled on any table.** Any person with the anon key (which is public in the source code) can execute arbitrary SELECT, INSERT, UPDATE, and DELETE on every table using the Supabase REST API directly.

### Required policies before launch

For each table, add policies following this pattern. **Do not apply these to the live database until the changes have been reviewed and tested in a staging environment.**

#### `profiles`
```sql
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Anyone can read any profile (for public profile pages)
CREATE POLICY "Public profiles are viewable by everyone"
  ON profiles FOR SELECT USING (true);

-- Users can only update their own profile
CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE USING (auth.uid() = id);

-- Users can insert their own profile on signup
CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
```

#### `businesses`
```sql
ALTER TABLE businesses ENABLE ROW LEVEL SECURITY;

-- Anyone can read businesses
CREATE POLICY "Businesses are publicly readable"
  ON businesses FOR SELECT USING (true);

-- Authenticated users can create businesses
CREATE POLICY "Authenticated users can create businesses"
  ON businesses FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Only owner can update
CREATE POLICY "Owners can update their business"
  ON businesses FOR UPDATE USING (auth.uid() = owner_id);
```

#### `properties`
```sql
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;

-- Same pattern as businesses
CREATE POLICY "Properties are publicly readable"
  ON properties FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create properties"
  ON properties FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Owners can update their property"
  ON properties FOR UPDATE USING (auth.uid() = owner_id);
```

#### `reviews`
```sql
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Anyone can read reviews
CREATE POLICY "Reviews are publicly readable"
  ON reviews FOR SELECT USING (true);

-- Authenticated users can create reviews
CREATE POLICY "Authenticated users can create reviews"
  ON reviews FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Only author can update/delete their review
CREATE POLICY "Users can manage their own reviews"
  ON reviews FOR UPDATE USING (auth.uid() = user_id);
```

#### `claims`
```sql
ALTER TABLE claims ENABLE ROW LEVEL SECURITY;

-- Only authenticated users can see claims
CREATE POLICY "Authenticated users can view claims"
  ON claims FOR SELECT USING (auth.role() = 'authenticated');

-- Authenticated users can submit claims
CREATE POLICY "Authenticated users can submit claims"
  ON claims FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Only admins can approve/reject (update status)
-- Requires is_admin check via a join or a database function
```

> ⚠️ The `claims` admin policy requires a way to check `is_admin` from within a policy. Options: use a Postgres function, a separate `admins` table, or Supabase custom claims via JWT. Discuss with the owner before implementing.

---

## Auth route protection

Currently no screens check authentication before rendering. Minimum guards needed:

| Route | Minimum requirement |
|---|---|
| `/admin/claims` | Must be authenticated AND `is_admin = true` |
| `/admin/dashboard` | Must be authenticated AND `is_admin = true` |
| `/manager/dashboard` | Must be authenticated AND `account_type = 'manager'` |
| `/business/add` | Must be authenticated |
| `/property/add` | Must be authenticated |
| `/business/review/:id` | Must be authenticated |
| `/property/review/:id` | Must be authenticated |
| `/profile/edit` | Must be authenticated AND own the profile |

Implementation: add a check at the top of each screen using `supabase.auth.getSession()` and redirect to `/auth/login` if not met. Follow the mandatory one-file-at-a-time workflow in `AGENTS.md`.

---

## Security checklist for launch

- [ ] `SUPABASE_URL` stored as Replit Secret, not in source code
- [ ] `SUPABASE_ANON_KEY` stored as Replit Secret, not in source code
- [ ] `services/supabase.js` reads from `process.env.EXPO_PUBLIC_SUPABASE_URL` and `process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY`
- [ ] App rebuilt and tested after credential move — Supabase connection confirmed working
- [ ] RLS enabled on all tables in Supabase dashboard
- [ ] All required RLS policies applied and tested
- [ ] Admin and manager routes reject unauthenticated/unauthorised access
- [ ] Built JS bundle inspected — Supabase credentials no longer visible in `dist/_expo/static/js/web/entry-*.js`
- [ ] Supabase anon key rotated after removing from source (old key was public in git history)

---

## Notes on the anon key

The Supabase anon key is designed to be public — it grants only the access that RLS policies allow. **However**, because RLS is currently disabled, the exposed key currently grants unrestricted database access. The fix sequence is:

1. Enable RLS and apply policies first
2. Then move credentials to secrets
3. Then rotate the anon key (since it was committed to git history)

Do not rotate the key before enabling RLS, or the app will break before you can reconnect it.
