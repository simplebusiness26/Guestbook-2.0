---
name: Agent foundation
description: Permanent documentation files that govern all future work on Guestbook
---

## What exists

Five root-level markdown files added as the agent foundation:

- `AGENTS.md` — mandatory reading for every agent; workflow rules, architecture, what not to do
- `LAUNCH_SCOPE.md` — v1 in/out of scope; definition of done
- `TESTING_CHECKLIST.md` — 21-section manual test checklist; run relevant sections after every change
- `SECURITY.md` — env var requirements, RLS policy SQL, auth guard requirements, key rotation order
- `LAUNCH_ISSUES.md` — 16 issues (ISSUE-001 through ISSUE-016), prioritised P0/P1/P2

## Critical rule from AGENTS.md

One file at a time → save → verify saved → wait for build → check logs → screenshot → only then proceed.

**Why:** Owner is non-technical and phone-only. A broken app must be fixed before any other change.

## How to apply

Read AGENTS.md at the start of every session. Check LAUNCH_ISSUES.md for current status. Update issue status when resolving. Do not close an issue without end-to-end testing.
