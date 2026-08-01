# Guestbook — Manual Testing Checklist

> Run the relevant sections after every significant change.  
> Test on a real phone or in a browser set to mobile viewport (375px wide).  
> Check browser/workflow console for errors after each step — a passing UI with a hidden console error still counts as a failure.

---

## How to use this checklist

- ✅ Pass — works as expected, no console errors
- ❌ Fail — broken, note the exact error and screen
- ⚠️ Partial — works but with warnings or minor issues
- N/A — feature not yet implemented (note which issue covers it)

Run date: ___________  
Tester: ___________  
App version / commit: ___________

---

## 1. App loads

- [ ] App opens at `/` (home screen) — "Guestbook" title and tagline visible
- [ ] "Explore Map", "Login", "Create Account" buttons visible
- [ ] No console errors on load

---

## 2. Sign Up — Explorer

- [ ] Tap "Create Account" → signup form appears
- [ ] Fill name, email, phone, password (min 6 chars), select "Explorer"
- [ ] Submit → no crash, success feedback shown
- [ ] Receive verification email (if email verification is enabled in Supabase)
- [ ] After verifying, logging in routes to explorer menu
- [ ] No console errors

---

## 3. Sign Up — Manager

- [ ] Same as above but select "Manager"
- [ ] After login, menu shows manager options
- [ ] Tapping manager option → `/manager/dashboard` loads
- [ ] Dashboard shows "My Businesses" and "My Properties" sections
- [ ] No console errors

---

## 4. Log In

- [ ] Tap "Login" → login form appears
- [ ] Enter valid credentials → success, routed to correct dashboard
- [ ] Enter wrong password → error message shown (no crash)
- [ ] Enter unknown email → error message shown (no crash)
- [ ] No console errors

---

## 5. Log Out

- [ ] From profile screen, tap sign out
- [ ] Redirected to home screen
- [ ] Login/Create Account buttons visible again
- [ ] No console errors

---

## 6. Map

- [ ] Tap "Explore Map" → map loads (native pins on mobile, list on web)
- [ ] Markers/listings visible
- [ ] Tapping a marker/listing → correct business or property page opens
- [ ] No console errors

---

## 7. Business listing — public view

- [ ] Navigate to a business page (`/business/:id`)
- [ ] Name, category, description visible
- [ ] Reviews section visible (or "no reviews yet" message)
- [ ] "Claim" button visible for unclaimed businesses (when logged in as manager)
- [ ] "Verified Business" pill visible for claimed/owned businesses
- [ ] No console errors

---

## 8. Business — create (manager)

- [ ] Logged in as manager → navigate to `/business/add`
- [ ] Fill in all fields → submit
- [ ] New business appears in manager dashboard
- [ ] No console errors

---

## 9. Business — edit (owner)

- [ ] From business dashboard, tap edit on an owned business
- [ ] Form pre-filled with existing data
- [ ] Edit a field → save → changes reflected on listing page
- [ ] No console errors

---

## 10. Business — reviews

- [ ] Navigate to a business page → tap "Write a Review"
- [ ] Review form loads (`/business/review/:id`)
- [ ] Fill rating + comment → submit
- [ ] Review appears on business page
- [ ] Business owner can respond (review-action screen)
- [ ] No console errors

---

## 11. Property listing — public view

- [ ] Navigate to a property page (`/property/:id`)
- [ ] Name, description visible
- [ ] QR code visible on property page
- [ ] "Write a Review" button visible
- [ ] No console errors

---

## 12. Property — create (manager)

- [ ] Logged in as manager → navigate to `/property/add`
- [ ] Fill in all fields → submit
- [ ] New property appears in manager dashboard
- [ ] No console errors

---

## 13. Property — edit (manager)

- [ ] From manager dashboard, tap edit on an owned property
- [ ] Correct property data loads in the edit form
- [ ] Edit a field → save → changes reflected on listing page
- [ ] No console errors

---

## 14. Property — reviews

- [ ] Guest navigates to a property page → taps "Write a Review"
- [ ] Review form loads
- [ ] Fill rating + comment + optional photo → submit
- [ ] Review appears on property page
- [ ] No console errors

---

## 15. QR code — generation

- [ ] Logged-in manager on business dashboard → QR code renders on screen
- [ ] Logged-in manager on property dashboard → QR code renders on screen
- [ ] QR code visible on the public property page

---

## 16. QR code — scanning (implement before testing)

- [ ] Open scan screen (`/scan`)
- [ ] Camera permission requested
- [ ] Point at a business or property QR code → correct listing page opens
- [ ] No console errors

> ⚠️ This test is N/A until `app/scan.js` is implemented (LAUNCH_ISSUES.md #4)

---

## 17. Admin — claims

- [ ] Logged in as admin → navigate to `/admin/claims`
- [ ] Pending claims listed
- [ ] Approve a claim → `owner_id` updated on the listing → claimant's dashboard shows the listing
- [ ] Reject a claim → listing remains unclaimed
- [ ] No console errors

---

## 18. Profile

- [ ] Navigate to `/profile` → name, email, photo visible
- [ ] Tap edit → form pre-filled
- [ ] Change photo → upload succeeds → new photo visible
- [ ] Save changes → updated on profile page
- [ ] No console errors

---

## 19. Public profile

- [ ] Navigate to `/profile/:id`
- [ ] Name and reviews visible
- [ ] No console errors

---

## 20. Navigation — back button / deep links

- [ ] Back button on every screen returns to the expected previous screen
- [ ] No screens get stuck in a navigation loop
- [ ] Refreshing a deep link URL (`/business/123`) loads the correct screen

---

## 21. Error states

- [ ] Navigating to a non-existent business ID shows a graceful "not found" message (not a crash)
- [ ] Navigating to `/admin/claims` while logged in as explorer shows an error or redirects (once auth guards are added)
- [ ] Losing network connection mid-session shows an error (not a crash)

---

## Regression checklist (run after any code change)

Minimum checks after any change — takes ~5 minutes:

- [ ] App loads at `/`
- [ ] Login works
- [ ] Map loads
- [ ] One business page loads
- [ ] One property page loads
- [ ] No new console errors vs. before the change
