# Seqily — Manhwa/Manga/Manhua/Webcomic Review Platform — Handoff

_Last updated: 2026-07-17_

A blog + review/community site for webcomics. Users browse comics, rate & review them,
favorite them, track reading status, comment, report, and admins manage the catalog and
moderation queue. **Deployed and live at `seqily.vercel.app`.** This document hands off
the current state so anyone (or any new session) can pick up the work.

---

## 0. Read this first if you're a new session

1. This file + the repo-root **`CLAUDE.md`** are the source of truth — re-read both
   before proposing changes, don't rely on chat memory.
2. **This is a teaching project** — write snippets for the developer to paste in
   themselves; don't Edit/Write application code directly unless explicitly asked to.
3. **§9 (Known issues) has an unresolved performance investigation** — page loads are
   reported slow on *both* localhost and the live Vercel site, on the *second* visit to
   a page (not just the first). That rules out dev-compile and cold-start as the sole
   causes. The investigation was mid-flight (DB round-trip was measured and is fast —
   36ms warm) when the developer redirected to other work. Pick this back up before
   assuming any DB/pool change will fix it.
4. **Comic detail pages live at `/[slug]`, not `/comic/[slug]`** — `(comic)` is a route
   group. This has caused repeated bugs. See CLAUDE.md §"Operational rules" #6.
5. There are currently **uncommitted changes in the working tree on `main`** (see §10)
   from the most recent session — verify `git status` before assuming a clean baseline.

---

## 1. How to run

```powershell
cd my-app
npm install
npm run dev            # http://localhost:3000
```

Requires `my-app/.env` with: `DATABASE_URL`, `AUTH_SECRET`, `ADMIN_EMAIL`,
`ADMIN_PASSWORD`, `BLOB_READ_WRITE_TOKEN`.

- **Database is hosted Prisma Postgres** (`db.prisma.io`) — the `DATABASE_URL` points to
  a live DB with real data (real registered users, ~9-14 comics, real reviews/comments).
  Be careful with destructive commands.
- **Image uploads use Vercel Blob** (not local disk — Vercel's serverless filesystem is
  read-only). `BLOB_READ_WRITE_TOKEN` is required locally too, or upload buttons will
  fail (the "paste an image URL" fallback still works without it).
- On first server boot, `src/instrumentation.ts` **auto-seeds an admin** (from
  `ADMIN_EMAIL`/`ADMIN_PASSWORD`) and **seeds comics** from mock data — both idempotent.
- Log in as the admin (`ADMIN_EMAIL`) to reach `/admin/*`.

### ⚠️ Operational rules (hard-won — read these)

See **`CLAUDE.md`**'s "🔴 OPERATIONAL RULES" section — it's the canonical list (schema
push method, restart-after-generate, the `/[slug]` routing rule, the Blob requirement,
etc.) and is kept in sync there so it isn't duplicated in two places.

---

## 2. Tech stack

- **Next.js 16** (App Router). Middleware file is `src/proxy.ts`.
- **Prisma v7** with the **`prisma-client` generator** → output at repo-root
  **`generated/prisma`** (imported via the `@prisma-generated` alias for the full
  client, or `@prisma-enums` for the import-free enums-only file — safe in client
  components), using the **`@prisma/adapter-pg`** driver adapter.
- **PostgreSQL** (hosted Prisma Postgres).
- **Auth.js / NextAuth v5 (beta)** — Credentials provider, JWT sessions, no DB session
  table.
- **React + Tailwind + TypeScript**, **Zod** validation (now an explicit `package.json`
  dependency — was previously only transitively installed, a real deploy risk that's
  been fixed), **bcrypt** (cost 12) with password-strength rules.
- **Vercel Blob** (`@vercel/blob`) for cover/avatar uploads.
- **Vercel** hosting — Root Directory `my-app`, `images.unoptimized: true` in
  `next.config.ts` (so both Blob URLs and pasted external image URLs render without
  needing a domain allowlist).

### Path aliases (`tsconfig.json`)
```jsonc
"@/*": ["./src/*"]
"@prisma-generated": ["./generated/prisma/client"]   // full client, SERVER-ONLY
"@prisma-enums": ["./generated/prisma/enums"]        // enums, safe for client too
```

---

## 3. Architecture — layered pattern

```
Route handler (route.ts)  →  Service  →  Repository  →  Prisma  →  Postgres
(I/O boundary + auth)      (rules)     (raw queries)
```

Unchanged from the original design. See `CLAUDE.md` for the full pattern writeup
(repository/service/route responsibilities, established conventions, error-handling
convention). Two additions worth calling out here since they came from real bugs this
session:

- **String-code errors must match exactly between service and route.** A
  `service.throw(new Error("Email already exists"))` checked against
  `err.message === "email already exists"` (route) never matches — it silently falls
  through to a generic 500. This actually happened and went unnoticed for a while.
  Prefer `SCREAMING_SNAKE_CASE` codes.
- **Enum-driven UI must import from `@prisma-enums`, never hand-copy the values.** Two
  separate hardcoded copies of `ComicStatus` (one in the comic create/edit forms, one in
  the catalog filter) drifted from the actual schema — the forms offered `COMING_SOON`
  but the Zod validator didn't accept it, so saving with that status silently failed
  validation. Fixed by deriving every status list from `Object.values(ComicStatus)`.

---

## 4. Feature status

| Area | Status | Notes |
|---|---|---|
| Register / Login / Logout | ✅ Real | Login redirects by role; password-strength meter on register; deactivated accounts blocked; friendly error messages (no more raw `CredentialsSignin`) |
| Admin auto-seed | ✅ Real | `instrumentation.ts` on boot |
| Route protection | ✅ Real | `src/proxy.ts` middleware + per-route `auth()` role checks |
| Dashboard (Hero, Featured, Highest Rated, Recently Added, Browse-by-Genre, Community Reviews) | ✅ Real | All 6 sections wired to DB; cached via `revalidate = 60` |
| Series catalog (`/comicseries`) | ✅ Real | Combination filters (status+type+genre), 4 sorts, text search (`?q=`), URL-driven |
| Live search autocomplete | ✅ Real | Navbar search → `/api/search`, debounced dropdown + Enter-to-catalog fallback |
| Comic detail page | ✅ Real (SSG + ISR) | `generateStaticParams` + `revalidate = 60`; real Sources tab |
| Reviews (create/edit/delete) | ✅ Real | Upsert; delete recalculates average; owner-gated UI; report button |
| Comments (2-level threaded) | ✅ Real | Under reviews only (not directly on comics); create/edit/delete; triggers notifications |
| Reports & moderation | ✅ Real | File on review/comment; admin queue at `/admin/reviews`; Dismiss / Remove |
| Notifications | ✅ Real (partial) | Bell + page real; `NEW_COMMENT_REPLY` + `COMIC_STATUS_CHANGE` wired; `ADMIN_ANNOUNCEMENT` unused |
| Favorites | ✅ Real | Toggle + page |
| Reading list | ✅ Real | 6-status picker + page |
| Image upload (cover + avatar) | ✅ Real | Vercel Blob (public), + paste-URL fallback on both |
| Admin: comic CRUD | ✅ Real | Category + genre dropdowns now DB-driven (were hardcoded); full `ComicStatus` enum; sources |
| Admin: comics list | ✅ Real | |
| Admin: category management | ✅ Real | Full CRUD, search, in-use delete guard |
| Admin: genre management | ✅ Real | Full CRUD, in-use delete guard |
| Admin: user management | ✅ Real | Role, deactivate/reactivate, delete — self-lockout & last-admin guards |
| Admin dashboard | ✅ Real | Real counts, real pending-report count (linked), real recent comics |
| Admin profile | ✅ Real | Real stats; "Edit preferences" removed (wasn't a real feature) |
| Profile (user) | ✅ Real | Edit username/bio/avatar/password (strength meter); live stats |
| Genre pills (clickable) | ✅ Real | Dashboard "Browse by Genre" + comic-page sidebar genres both link to filtered catalog |
| Admin ⇄ User nav switch | ✅ Real | Shield icon (user navbar, admins only) ↔ Home icon (admin navbar) |
| Branding | ✅ Real | Logo + favicon replaced (`public/logo.png`, `src/app/icon.png`) |
| Admin announcements | ⬜ Not built | `ADMIN_ANNOUNCEMENT` type exists, no broadcast UI/trigger |
| Forgot password / reset | 🛑 Deferred | Scoped, then explicitly dropped by developer — do not resume without asking |

---

## 5. Backend inventory

**Repositories** (`src/app/lib/repositories/`): `user`, `comic`, `comic-cat.repo`,
`genre`, `review`, `favorite`, `reading-list`, `comment`, `report`, `notification`.

**Services** (`src/app/lib/services/`): `user`, `comic`, `genre`, `category`, `review`,
`favorite`, `reading-list`, `comment`, `report`, `notification`.

**Validators** (`src/app/lib/validators/`): `user.schema`, `comic.schema`,
`genre.schema`, `category.schema`, `review.schema`, `reading-list.schema`,
`comment.schema`, `report.schema`.

**API routes** (`src/app/api/`) — 22 route handlers:

| Route | Methods | Auth |
|---|---|---|
| `auth/[...nextauth]` | GET/POST | — |
| `users` | POST (register), GET (list) | public / — |
| `users/[id]` | GET, **PATCH** (owner-only profile update) | — / owner |
| `admin/users/[id]` | **PATCH** (role/isActive), **DELETE** | admin |
| `upload` | POST | admin |
| `upload/avatar` | POST | any authed user |
| `comics` | POST (create) | admin |
| `comics/[id]` | PATCH (edit, incl. sources), DELETE | admin |
| `reviews` | POST (upsert), GET (by `?slug=`) | POST=auth, GET=public |
| `reviews/[id]` | **DELETE** | owner |
| `comments` | **GET** (by `?reviewId=`), **POST** | GET=public, POST=auth |
| `comments/[id]` | **PATCH**, **DELETE** | owner |
| `reports` | **POST** (file), **GET** (list) | POST=auth, GET=admin |
| `reports/[id]` | **PATCH** (dismiss/remove) | admin |
| `notifications` | **GET**, **PATCH** (mark all read) | auth |
| `notifications/[id]` | **PATCH** (mark one read) | auth |
| `favorites` | GET (status), POST (add), DELETE (remove) — by slug | auth (GET tolerant) |
| `reading-list` | GET (status), POST (set status), DELETE — by slug | auth (GET tolerant) |
| `genres` | GET (list, public), POST (create) | POST=admin |
| `genres/[id]` | PATCH (rename), DELETE (guarded) | admin |
| `categories` | **GET** (list, public), **POST** (create) | POST=admin |
| `categories/[id]` | **PATCH** (rename), **DELETE** (guarded) | admin |
| `search` | **GET** (`?q=`) | public |

(Bold = added/changed this session.)

**Key services/behaviors to know:**
- `Favorite`, `Review`, `ReadingList` all use the compound unique `userId_comicId` for
  upsert/lookup.
- `comicService` / `reviewService`: `averageRating = round(avg(Review.rating))`,
  rewritten on every review create/update **and delete**.
- Category/genre resolution: forms send **names**; services slugify + find-or-create the
  `ComicCategory`/`Genre` rows and link via `ComicGenre`. On edit,
  `deleteMany + create` replaces the set. **The comic forms' dropdowns fetch these live
  from `/api/categories` and `/api/genres`** — don't hardcode.
- `commentService.createComment`: two-level threading — replying to a reply re-parents
  onto the original top-level comment. Fires a best-effort `NEW_COMMENT_REPLY`
  notification to the owner of what was replied to (never to yourself).
- `reportService.removeReportedContent`: deletes the underlying review/comment (admin
  override, not owner-gated) — this cascade-deletes the `Report` row too, by schema
  design. `dismissReport` just flips status, keeping the record.
- `comicService.updateComic`: when `publicationStatus` actually changes, fires
  `COMIC_STATUS_CHANGE` notifications to everyone who favorited the comic or has it in
  their reading list (deduped).
- `notificationService.listForUser`: resolves each notification's `relatedId` (a
  `comicId`) to a `/[slug]` deep link.
- `userService.adminUpdateUser` / `adminDeleteUser`: guard against self-demotion,
  self-deactivation, self-deletion, and removing the last remaining admin.
- Image uploads (`/api/upload`, `/api/upload/avatar`) call `@vercel/blob`'s `put()`
  with `access: "public"` — requires the connected Blob store to itself be public (see
  §8).

---

## 6. Data model changes from the original locked schema

Four approved, additive deviations (all via `npx prisma db push`, each explicitly
confirmed with the developer before applying):

1. **`Comic.alternativeName String?`** — nullable, from before this session's work.
2. **`NotificationType`**: added `COMIC_STATUS_CHANGE` (needed for the favorited/
   reading-list status-change notification trigger — no existing value fit).
3. **`ReportReason`**: fully replaced to match the developer's requested reason list.
   Was `SPAM, HARASSMENT, SPOILER, OFF_TOPIC, OTHER` → now `SPAM, HARASSMENT,
   HATE_SPEECH, INAPPROPRIATE_CONTENT, MISINFORMATION, COPYRIGHT_VIOLATION, OTHER`.
   Safe because no `Report` rows existed at the time of the change.
4. **`User.isActive Boolean @default(true)`** — powers admin deactivate/reactivate;
   checked in `userService.authenticate()` to block deactivated logins.

_(All other models — `ComicCategory`, `Genre`, `ComicGenre`, `ComicSource`, `Favorite`,
`ReadingList` — are unchanged from the locked schema plus the deviations above. Every
model listed in the locked schema now has real, wired-up code — nothing left
schema-only.)_

---

## 7. Notable bugs found & fixed this session

Worth knowing about even though they're resolved — some reveal patterns to watch for
elsewhere in the codebase:

1. **`/comic/${slug}` links 404'd** — 7 files linked to a route that doesn't exist
   (`(comic)` is a route group; the real URL is `/[slug]`). Fixed everywhere; see
   CLAUDE.md rule #6.
2. **`api/notifications.ts/` folder** — the route folder was literally named with a
   `.ts` extension baked into the *folder name*, so it resolved to
   `/api/notifications.ts` instead of `/api/notifications`. All notification fetches
   were silently 404ing. Renamed.
3. **Registration duplicate-email/username errors never displayed** — service/route
   error-string mismatch (see §3). Fixed with matching `EMAIL_TAKEN`/`USERNAME_TAKEN`
   codes; also updated the three user-facing messages per the developer's requested
   wording.
4. **Login showed the raw `"CredentialsSignin"` NextAuth code** — `res.error ||
   "fallback"` never falls through because `res.error` is truthy. Fixed by always using
   a fixed friendly message.
5. **`ComicStatus` drift** — the comic create/edit forms and the catalog's status filter
   were each a separately hand-typed array that didn't match the schema/validator (the
   forms offered `COMING_SOON`, the validator rejected it). Fixed by deriving all three
   from `@prisma-enums`.
6. **Category dropdown was hardcoded** (`Manhwa/Manga/Manhua/Webcomics`) instead of
   reading `/api/categories` — meant Category Management edits never showed up in the
   comic forms. Fixed to match the genre dropdown's existing (correct) pattern.
7. **`isActive` read as `undefined` right after the schema change** — not a code bug,
   but a process one: the running dev server had a stale generated Prisma client (the
   field didn't exist in memory yet), so every user showed "Deactivated" until a full
   restart. `prisma generate` does not hot-reload into an already-running server.
8. **Local `fs.writeFile` uploads broke on Vercel** — serverless filesystem is
   read-only. Migrated both upload routes to Vercel Blob.
9. **`P2037: TooManyConnections` in production** — see §9, only partially resolved.
10. **Comic detail page was pure SSG with no revalidation** — rating/favorite counts and
    admin edits were frozen at build time in production (dev always looked fine because
    dev re-renders every request). Added `revalidate = 60`.
11. **One comic's cover is a product-page URL, not an image URL** ("SSS-Class Suicide
    Hunter" → `travellingman.com/products/...`) — renders as a black box since it's
    HTML, not an image. Needs a real cover uploaded/pasted; flagged, not auto-fixed (an
    og:image-extraction feature was discussed and explicitly declined in favor of just
    re-uploading).

---

## 8. Vercel deployment — current state

**Live at `seqily.vercel.app`.** Already deployed and working, with the following
resolved along the way:

- Root Directory set to `my-app`.
- Env vars (`DATABASE_URL`, `AUTH_SECRET`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`,
  `BLOB_READ_WRITE_TOKEN`) all set in Production + Preview.
- Blob store had to be **recreated as Public** — the first store was private by default
  (no toggle to change after creation) and rejected the app's public-access uploads.
- `NextAuth` "Server error / problem with the server configuration" on first deploy was
  because env vars were added *after* the first build — env vars only take effect on
  the *next* deploy, not retroactively. Always redeploy after adding/changing env vars.
- `images.unoptimized: true` set in `next.config.ts` so both Blob URLs and pasted
  external image URLs render without a `next/image` domain allowlist.

---

## 9. ⚠️ Known issues — unresolved, needs follow-up

### 9a. Page-load slowness (OPEN — investigation interrupted)
The developer reported pages taking a long time to load, on navigation (not just first
visit). Investigation so far:
- Ruled out: dev-server first-compile (would only affect localhost) and Vercel cold
  starts (would only affect the *first* hit) — **the developer confirmed the *second*
  visit to the same page is also slow, on both localhost and the live site.** That's an
  important, unresolved clue.
- Measured: the database itself is fast. A cold connection costs ~560ms (paid once per
  process), but a warm query is ~36ms, and 6 sequential warm queries take ~200ms. So the
  DB is very unlikely to be the bottleneck once a connection is established.
- Tested and **ruled out** as the cause: the `max: 1` Prisma pool cap (added for
  `P2037`, see 9b) — parallel queries were measured *slower* than sequential on this DB
  (238ms vs 203ms for 6 queries), because opening each new pooled connection costs
  ~500ms. So `max: 1` is not the source of the slowness; don't "fix" it by raising the
  pool size expecting a speedup.
- **Not yet investigated:** actual per-page render profiling (which component/query is
  slow), whether `images: { unoptimized: true }` (no image optimization/resizing at
  all) is bloating page weight, whether it's consistent across *all* pages or specific
  to certain ones (e.g. pages with many `force-dynamic` DB calls), and Vercel function
  region vs. database region (a mismatch would add fixed latency to every query
  regardless of pool size — this was suggested but never actually checked).
- **Next steps for whoever picks this up:** (1) confirm exact reproduction steps — which
  page(s), is it truly every navigation or specific ones; (2) check Vercel Function
  region vs. DB region; (3) profile an actual page load (Network tab / Vercel's request
  timing) rather than isolated DB benchmarks; (4) check whether `unoptimized: true`
  images are the weight culprit — if so, a targeted fix (resize on upload, or scope
  `unoptimized` to only the domains that need it) may be better than a blanket setting.

### 9b. `P2037: TooManyConnections` — mitigated, not root-fixed
Production hit connection-pool exhaustion (`prisma_migration` role error, suggesting
`DATABASE_URL` is the **direct/unpooled** connection, not the pooled one). Root cause:
serverless spins up many function instances, each opening its own connection pool
(default `max: 10`), which multiplies past the DB's connection limit fast.

**Current mitigation** (`src/app/lib/prisma.ts`): pool capped to `max: 1`,
`idleTimeoutMillis: 10_000`. This reduced peak connections ~10× and the errors have not
recurred since, but it's a band-aid — under high enough concurrent load it could still
exhaust connections (just at a higher traffic threshold than before).

**Proper fix, not yet done:** switch to Prisma's **pooled** connection endpoint.
Vercel's env vars already include `PRISMA_DATABASE_URL` (a `prisma+postgres://...`
Accelerate URL) as an alternative to the direct `DATABASE_URL` currently in use — that's
exactly what's meant to be used from serverless functions. Migrating `prisma.ts` to use
it (likely via `@prisma/extension-accelerate` or reconfiguring the adapter) would let the
pool size go back up safely and could also help with §9a if connection overhead is part
of the slowness. This needs a deliberate migration, not a blind swap — flag it to the
developer before touching it.

### 9c. Minor / cosmetic
- 24 unused empty stub files (listed in CLAUDE.md) — safe to delete, never gotten to.
- One comic ("SSS-Class Suicide Hunter") has a broken cover image URL (see §7 item 11).

---

## 10. Uncommitted work — check before continuing

As of this handoff, `main` has **uncommitted changes in the working tree** (verify with
`git status` — don't assume they're already shipped or already discarded):

- `package.json` / `package-lock.json` — added `zod` as an explicit dependency (was
  previously only transitively resolved).
- `tsconfig.json` — added the `@prisma-enums` alias.
- `comic.schema.ts`, `admin/comics/create/page.tsx`,
  `admin/comics/[id]/edit/EditComicForm.tsx` — `ComicStatus` now derived from
  `@prisma-enums` instead of hardcoded (fixes the `COMING_SOON` validation bug).
- `comicseries/page.tsx`, `comicseries/DirectoryControls.tsx` — status filter also
  enum-derived now.
- `api/users/route.ts`, `api/users/[id]/route.ts`, `user.service.ts`,
  `user.schema.ts` — the error-message/code fixes from §7 item 3, plus the requested
  wording ("An account with this email already exists.", "Username is already taken.",
  "Invalid Email Address. Try Again").
- `components/forms/LoginForm.tsx` — the `CredentialsSignin` fix from §7 item 4.
- `Footer.tsx`, `src/proxy.ts` — small developer-made fixes (a dead `/user/favorites`
  link corrected to `/favorites`, and `/comicseries/:path*` added to the middleware
  matcher). Not made by the assistant this session — verify intent if unclear.

None of this is committed yet. Review with `git diff`, then commit when ready:
```powershell
cd my-app
git add -A
git commit -m "fix: enum-driven ComicStatus everywhere; register/login error messages; add zod dependency"
git push
```

---

## 11. Suggested next steps

Roughly in priority order:

1. **Resolve §9a (page-load slowness)** — the most user-visible open issue. Needs real
   profiling, not more guessing.
2. **Commit the pending work in §10**, then redeploy so the live site picks up the
   `ComicStatus`/error-message fixes.
3. **Consider §9b's proper fix** (pooled `PRISMA_DATABASE_URL`) once §9a is understood —
   they may be related.
4. **Fix "SSS-Class Suicide Hunter"'s cover** — re-upload or paste a real image URL.
5. **Admin announcements** — the last unused `NotificationType` value. Needs an admin
   broadcast form + a fan-out create across all users.
6. **Clean up the 24 unused stub files** — cosmetic, low-risk, whenever there's a lull.
7. **Fix the `.gitignore` rule** for `generated/prisma` (see CLAUDE.md rule #3) and add
   `/public/uploads/` (legacy local-upload leftovers, no longer written to but old
   files may still be sitting there).
8. Revisit **forgot-password/reset** only if the developer explicitly asks again — it's
   deliberately deferred, not forgotten.

---

## 12. Where things live (quick map)

```
my-app/
├─ prisma/schema.prisma          # schema + the 4 documented deviations (§6)
├─ generated/prisma/             # Prisma client (build output; regenerate after merges)
├─ next.config.ts                # reactCompiler, images.unoptimized
├─ src/
│  ├─ instrumentation.ts         # boot seeds (admin + comics)
│  ├─ proxy.ts                   # middleware (route protection)
│  └─ app/
│     ├─ lib/{auth.ts,auth.config.ts,prisma.ts,slug.ts,timeAgo.ts,
│     │        repositories,services,validators}
│     ├─ api/…                   # 22 route handlers (see §5 table)
│     ├─ (auth)/{login,register,logout}          # forgot-password removed
│     ├─ (comic)/[id]/           # comic detail — ROUTE GROUP, real URL is /[slug]
│     ├─ (user)/{dashboard,favorites,reading-list,profile,reading-list,
│     │           reviews,notifications,settings}
│     ├─ comicseries/            # catalog: page.tsx + DirectoryControls (client)
│     ├─ admin/{comics,genres,categories,users,reviews,dashboard,profile,…}
│     └─ components/{sections,cards,forms,layout}
```
