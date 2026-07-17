# Project: Webcomic/Manhwa/Manga/Manhua Review Platform ("Seqily")

A blog and review/community site for webcomics — browse, search, rate, review, favorite,
track reading status, comment, and moderate. The app lives in **`my-app/`**. Live at
**seqily.vercel.app**.

---

## ⚠️ CURRENT BUILD STATE — READ FIRST

This is a **teaching project**: the developer is learning full-stack Next.js. **The
developer types the code — give clear, complete, correct snippets for them to paste in.
Do not use Edit/Write to implement application code directly.** Only edit files directly
if the developer explicitly asks you to make the change yourself. Explain non-trivial
changes, prefer small reviewable diffs, and do not autonomously refactor large areas.

**Always re-check this file and `handoff.md` before proposing or writing any change** —
don't rely on memory from earlier in a session. Re-read the current copies at the repo
root if there's any doubt about a rule.

**After building a backend feature, automatically wire it to the frontend in the same
task** — don't stop after the API and ask whether to continue. Backend + frontend ship
together. Still confirm genuine design choices (fields, UX, which triggers) — just don't
ask *whether* to do the frontend at all.

See **`handoff.md`** (repo root) for the full feature-by-feature status, known bugs, and
next-steps roadmap.

### Environment / versions
- **Next.js 16** (App Router, Turbopack for dev via `--webpack` flag is actually
  disabled — `dev` script is `next dev --webpack`). Middleware file is **`src/proxy.ts`**
  (Next 16 renamed `middleware.ts` → `proxy.ts`).
- **Prisma v7**, **`prisma-client` generator**, output to repo-root **`generated/prisma`**
  (via `@prisma-generated` alias), **`@prisma/adapter-pg`** driver adapter.
- **PostgreSQL** — hosted Prisma Postgres (`db.prisma.io`); `DATABASE_URL` is a **live DB
  with real data** (real users, comics, reviews — not a throwaway dev DB).
- **Auth.js / NextAuth v5 (beta)** — Credentials + JWT, no DB session table, no Prisma
  adapter.
- **Vercel Blob** (`@vercel/blob`) for image uploads (covers + avatars) — local
  filesystem writes don't work on Vercel's read-only serverless filesystem, so uploads
  go through `put()` to a **public** Blob store.
- OS: **Windows / PowerShell.** Give PowerShell commands.

### 🔴 OPERATIONAL RULES (do not skip)
1. **Schema changes: use `npx prisma db push`, NEVER `npx prisma migrate dev`.** There is
   **no `prisma/migrations` folder** (schema-first workflow). `migrate dev` will detect
   "drift" and offer to **reset/drop the database**. Adding/removing enum values or
   nullable columns via `db push` is safe.
2. **After every merge/pull/schema change: `npx prisma generate` + FULLY RESTART the dev
   server (Ctrl+C, not hot reload).** The generated client can go stale → runtime
   `Unknown argument '...'` errors, or a field silently reading as `undefined` (this
   happened with `isActive` — it made every user look "deactivated" until a restart).
3. **`generated/prisma` is currently committed**, and `.gitignore` has a wrong rule
   (`/src/generated/prisma` doesn't match the real `generated/prisma`). Merges can
   clobber the client. Recommend fixing `.gitignore` → `/generated`.
4. **Never put `"use client"` on anything that imports a service/repository/Prisma** — it
   bundles `pg`→`fs` into the browser (`Can't resolve 'fs'`). Server Components fetch;
   small `"use client"` islands handle interactivity + call API routes. **Exception:**
   `generated/prisma/enums.ts` has zero imports and is explicitly safe to import from
   client components (Prisma's own comment says so) — use the **`@prisma-enums`** alias
   for this (see below). Never import `@prisma-generated` (the full client) from a
   client component.
5. **`instrumentation.ts` is boot-only** — full restart required after changing it or its
   seeds.
6. **Comic detail pages live at `/[slug]` (root level), NOT `/comic/[slug]`.** The
   `(comic)` folder under `src/app/` is a Next.js **route group** — the parentheses mean
   it adds nothing to the URL. This caused a real, repeated bug: several pages linked to
   `/comic/${slug}`, which 404s. **Always link to `/${slug}` for a comic**, matching
   `FeaturedCoverSection.tsx`.
7. **Prisma pg pool is capped at `max: 1`** in `src/app/lib/prisma.ts` (see
   `handoff.md` §9 for why — production hit `P2037: TooManyConnections`). This is a
   band-aid, not a root fix. Don't raise it without reading that section first.
8. Uploaded images go through **Vercel Blob** (`public: access`), not local disk. Both
   `/api/upload` (admin-only, covers) and `/api/upload/avatar` (any user) need
   `BLOB_READ_WRITE_TOKEN` in the environment — set locally in `.env` and in Vercel.

### tsconfig path aliases
```jsonc
"@/*": ["./src/*"]                     // @/app/lib/... => src/app/lib/...
"@prisma-generated": ["./generated/prisma/client"]   // full client — SERVER ONLY
"@prisma-enums": ["./generated/prisma/enums"]        // enums only — safe for client components too
```
Prefer `@prisma-enums` over hand-copied string-literal arrays for any UI that lists enum
values (status dropdowns, filters). Hardcoded copies **will** drift from the schema —
this happened twice this session (`ComicStatus` in the comic forms rejected `COMING_SOON`
because the validator's hardcoded list didn't include it; the catalog's status filter was
a separately hand-typed list too). Always derive from `Object.values(SomeEnum)`.

---

## Guardrails — read before writing any code

- **Zero assumptions.** Don't add features/pages/endpoints/fields not explicitly
  discussed.
- **Stop and ask** if a task needs an undecided design choice.
- The database schema is **mostly locked**. Four documented deviations exist so far (see
  `handoff.md` §6) — each was explicitly approved, additive, and applied via
  `db push`. Do not add/rename/remove fields or enum values without explicit
  confirmation, even ones that look small.
- **Always include error handling** (developer's standing request): `try/catch` at
  **boundaries** — API routes (map to HTTP status), client fetch handlers (with `finally`
  to reset loading state), and `instrumentation.ts` seeds. Repositories and services
  **throw upward**; Server Components use graceful fallback or `notFound()`.
- **When a service throws a string-code error, make sure the exact string matches on
  both ends.** A case or wording mismatch between what a service throws and what a route
  checks for (`err.message === "..."`) fails silently into a generic 500 — this happened
  with registration's duplicate-email/username errors for a while. Prefer
  `SCREAMING_SNAKE_CASE` codes (`EMAIL_TAKEN`, `USER_NOT_FOUND`) to make mismatches easier
  to spot.
- **NextAuth's `res.error` from `signIn()` is a raw code** (e.g. `"CredentialsSignin"`),
  not a friendly message — never render it directly. Map it to your own copy.

---

## Tech Stack

- Backend: Next.js 16 App Router, **API Routes** (not Server Actions), TypeScript
- ORM: Prisma v7 (`prisma-client` generator + `@prisma/adapter-pg`)
- DB: PostgreSQL (hosted Prisma Postgres)
- Frontend: React, Tailwind, TypeScript
- Auth: Auth.js (NextAuth v5), Credentials, JWT
- Validation: Zod (make sure `zod` stays an **explicit** `package.json` dependency — it
  was missing for a while and only worked via a transitive install, which is a silent
  deploy risk) · Passwords: bcrypt cost 12, with strength rules on register/change
  (8+ chars, upper, lower, number)
- File storage: Vercel Blob (public access) for covers + avatars
- Hosting: Vercel (Root Directory = `my-app`)

---

## Architecture: Layered Pattern

```
Route (route.ts)  →  Service  →  Repository  →  Prisma  →  Postgres
(auth + I/O)        (rules)     (raw queries)
```

- **Repository** — one class per model, wraps Prisma only, throws raw errors.
- **Service** — business rules, cross-repository orchestration, hashing,
  `averageRating` recalculation; throws string codes (`SLUG_TAKEN`, `GENRE_IN_USE`,
  `COMIC_NOT_FOUND`, `EMAIL_TAKEN`, `USERNAME_TAKEN`, `USER_NOT_FOUND`, `FORBIDDEN`,
  `LAST_ADMIN`, ...).
- **Route** — thin: auth/role check → parse JSON → Zod validate → call service → map
  errors to status.
- **Server Components** call services directly. **Client islands** call API routes.

**Patterns established (reuse them):**
- Per-user data on SSG/ISR pages (favorite state, reading status, "am I the author of
  this review/comment") is fetched **client-side** via `/api/auth/session`, keeping the
  page itself cacheable.
- Compound-unique upsert via `userId_comicId` for `Favorite`, `Review`, `ReadingList`.
- Category/Genre: forms send **names** → service slugifies + find-or-creates + links
  `ComicGenre`. On edit, replace the set with `deleteMany + create`. **Both the comic
  create/edit forms' Category and Genre dropdowns fetch live from `/api/categories` and
  `/api/genres`** — never hardcode these lists (this was a real bug: the Category
  dropdown was hardcoded and drifted from what admins configured in Category
  Management).
- Slug generation: `src/app/lib/slug.ts` (`slugify` for title→slug, `normalizeSlugInput`
  for typing in the slug box). Live-updates the slug from the title until the admin
  edits the slug manually.
- SSG + ISR comic detail via `generateStaticParams` + `revalidate = 60`; server shell +
  `"use client"` island for interactivity. (Pure SSG with no revalidation froze
  rating/favorite counts and admin edits in production — always pair
  `generateStaticParams` with a `revalidate` on pages whose data can change.)
- Enum-backed dropdowns/filters (status, report reason, etc.) derive their options from
  `@prisma-enums`, not a hand-typed array — see the tsconfig section above.
- Comments are two-level threaded (`parentId`): a reply to a reply collapses onto the
  original top-level comment (enforced in `comment.service.ts`).
- Notifications are best-effort — a notification failure is caught and logged, never
  allowed to fail the action that triggered it (posting a comment, editing a comic).

---

## What is DONE ✅ (real DB-backed)

- **Auth**: register, login (role-based redirect), logout, admin auto-seed, `proxy.ts`
  route protection + per-route `auth()` role checks, deactivated-user login block,
  password-strength validation with a live meter (register + change-password).
- **Dashboard**: Hero (with truncated `line-clamp-5` synopsis), Featured Covers, Highest
  Rated, Recently Added, Browse-by-Genre (all genres, clickable → filtered catalog),
  Community Reviews (latest real reviews with avatars). Cached via `revalidate = 60`.
- **Series catalog / directory** (`/comicseries`): real DB-backed listing with
  **combination filtering** (Status AND Type AND Genre), 4 sort modes (Highest Rated,
  Most Reviewed, Recently Added, Title A–Z), and a `?q=` text search matching
  title/alt-name/author/genre. URL-param driven (shareable/bookmarkable). Genre pills
  everywhere (dashboard + comic sidebar) deep-link here with `?genre=slug`.
- **Live search autocomplete**: navbar search bar hits `GET /api/search` (debounced),
  shows a cover+title dropdown, click-through to the comic; Enter falls back to the full
  filtered catalog.
- **Comic detail** (SSG + ISR, `revalidate = 60`): real comic, alt name, sidebar
  (rating, status, author, clickable genres, favorites count, review count), and a real
  **Sources tab** (`ComicSource` model — admin pastes up to 4 links on the comic
  form, name auto-derived from the URL's domain).
- **Reviews**: create (upsert, 1/user/comic), **edit**, **delete** (with average
  recalculation on both), client-fetched list with reviewer avatars, owner-gated
  edit/delete UI, report button for others' reviews.
- **Comments**: threaded (2 levels) under reviews — create, edit, delete (owner-gated),
  reply. Triggers a `NEW_COMMENT_REPLY` notification to the review/comment owner
  (never to yourself).
- **Reports & moderation**: any user can report a review or comment
  (`SPAM`/`HARASSMENT`/`HATE_SPEECH`/`INAPPROPRIATE_CONTENT`/`MISINFORMATION`/
  `COPYRIGHT_VIOLATION`/`OTHER`). Admin moderation queue at `/admin/reviews` — real
  data, **Dismiss** (keeps a `DISMISSED` record) or **Remove** (deletes the content,
  which cascade-deletes the report).
- **Notifications**: real bell (unread badge, dropdown, mark-read, mark-all-read) +
  `/notifications` page. Triggers wired: `NEW_COMMENT_REPLY` (comment/reply on your
  stuff) and `COMIC_STATUS_CHANGE` (admin changes a comic's status → notifies everyone
  who favorited it or has it in their reading list). Deep-links to the related comic.
  `ADMIN_ANNOUNCEMENT` type exists in the schema but has **no trigger/UI yet**.
- **Favorites**: toggle + `/favorites` page.
- **Reading list**: bookmark status picker (6 statuses) + `/reading-list` page.
- **Image upload**: `POST /api/upload` (admin, covers) and `POST /api/upload/avatar`
  (any user, avatars) — both via **Vercel Blob**, public access. Both forms also accept
  a pasted image URL as an alternative to uploading.
- **Profile** (user): real data, **edit** (username/bio/profilePic, password change with
  strength meter — no current-password check by design), live stats (Completed/
  Reading/Favorites from real counts).
- **Admin comic CRUD**: create/edit (cover upload-or-URL, alt name, DB-driven category +
  genre dropdowns, auto-slug, official sources, status from the full `ComicStatus`
  enum), list, delete (cascade + confirm).
- **Category management**: full CRUD (`/admin/categories`) — create/rename/delete
  (guarded when a category is in use — every comic requires one), with search.
- **Genre management**: full CRUD (`/admin/genres`) — create/rename/delete (guarded
  when in use).
- **User management** (`/admin/users`): role change, **deactivate/reactivate**
  (`isActive`), **delete** — with guards preventing self-lockout (can't demote/
  deactivate/delete yourself) and removing the last admin.
- **Admin dashboard**: real counts (users, comics, reviews, favorites), real pending-
  report count (linked to the moderation queue), real recently-added comics.
- **Admin profile**: real account info + real activity stats (comics added, reports
  resolved, pending count). "Edit preferences" button removed (no such feature).
- **Admin ⇄ user navigation**: Shield icon in the user navbar (admins only) links to
  `/admin/dashboard`; Home icon ("View User Site") in the admin navbar links to
  `/dashboard`.
- **Branding**: logo at `public/logo.png` + `src/app/icon.png` (favicon), `BrandLogo`
  component shows the icon + "SEQILY" wordmark.

## Still MOCK / NOT built ⬜

- **Admin announcements** — `ADMIN_ANNOUNCEMENT` notification type exists, no broadcast
  UI or fan-out logic built yet. `admin/notifications/page.tsx` was an empty stub and
  has been deleted (not rebuilt).
- 24 unused empty component/data stub files never cleaned up (cosmetic only — confirmed
  via a passing build that none are imported anywhere): everything under
  `components/UI/*`, `components/cards/{DashboardCard,ReviewCard,UserCard}.tsx`,
  `components/forms/{ComicForm,CommentForm,ReviewForm}.tsx`,
  `components/layout/{AdminSidebar,MobileNav,UserMenu}.tsx`, `components/Hero.tsx`, and
  `data/{comic_category,favorites,genres,reviews,users}.tsx`.

## Deferred — DO NOT build without approval 🛑
- **Forgot-password / reset.** Was scoped once this session (token storage design +
  delivery method both discussed) and then explicitly **dropped by the developer** — do
  not resume without them re-raising it. If resumed, it still needs: a token-storage
  schema decision (dedicated table vs. fields on `User`) and a real delivery mechanism
  (no email provider is installed; a "log the link to console" dev-mode stand-in was
  proposed but never approved).
- Anything requiring a new locked-schema field/table beyond what's documented in
  `handoff.md` §6.

---

## Database Schema (IDs are `Int @default(autoincrement())`)

Generator: `prisma-client` → `../generated/prisma`; datasource `postgresql`.

**Four approved deviations from the original locked schema** (all via `db push`, all
additive) — full detail in `handoff.md` §6:
1. `Comic.alternativeName String?`
2. `NotificationType` enum: added `COMIC_STATUS_CHANGE`
3. `ReportReason` enum: replaced entirely — now `SPAM, HARASSMENT, HATE_SPEECH,
   INAPPROPRIATE_CONTENT, MISINFORMATION, COPYRIGHT_VIOLATION, OTHER` (dropped the
   original `SPOILER`/`OFF_TOPIC`)
4. `User.isActive Boolean @default(true)`

Enums: `Role {USER MODERATOR ADMIN}`, `ComicStatus {ONGOING COMPLETED CANCELLED DROPPED
MASS_RELEASED COMING_SOON HIATUS}`, `ReadingListStatus {READING PLAN_TO_READ COMPLETED
REREADING PAUSED DROPPED}`, `ReportStatus {PENDING REVIEWED DISMISSED ACTIONED}`,
`ReportReason` (see above), `NotificationType` (see above).

Models: `User, ComicCategory, Comic, Genre, ComicGenre, ComicSource, Review, Favorite,
ReadingList, Comment, Report, Notification`. Key points:
- `Comic.averageRating Int?` — **denormalized cache**; recalculated in `reviewService`
  (rounded avg of `Review.rating`, 1–5) on every review write **and** on review delete.
- `Review`, `Favorite`, `ReadingList` — `@@unique([userId, comicId])` (upsert via
  `userId_comicId`).
- `ComicGenre` — join table, `onDelete: Cascade`.
- `Comic` delete cascades reviews/favorites/comments/list entries/genre links/sources.
- `Comment.comicId|reviewId` — "exactly one of two" (enforced in
  `comment.schema.ts` via `.refine()`; in practice this app only ever sets `reviewId`
  — comments are always under a review, never directly on a comic, per product
  decision).
- `Report.reviewId|commentId` — same "exactly one" pattern, enforced in
  `report.schema.ts`.
- `Report` has `onDelete: Cascade` from both `Review` and `Comment` — **removing
  reported content also deletes its report row(s)**. This is intentional (see
  moderation flow above), not a bug.
- `User.isActive` — checked in `userService.authenticate()`; a deactivated user's
  login attempt returns `null` same as a wrong password (doesn't leak which reason).

---

## CRUD Quick Reference

| Entity | Create | Update | Delete |
|---|---|---|---|
| User | Register (public) | Owner profile ✅ (PATCH) / Admin ✅ (role, isActive) | Admin ✅ (guarded: not self, not last admin) |
| Comic | Admin ✅ | Admin ✅ (PATCH) | Admin ✅ (cascade) |
| Review | Auth ✅ (upsert) | Owner ✅ (upsert) | Owner ✅ |
| Comment | Auth ✅ (2-level threaded) | Owner ✅ | Owner ✅ / Admin ✅ (via report removal) |
| Favorite | Auth ✅ (toggle) | — | Owner ✅ |
| ReadingList | Auth ✅ | Owner ✅ (status) | Owner ✅ |
| Genre | Admin ✅ | Admin ✅ (rename) | Admin ✅ (guard if in use) |
| Category | Admin ✅ | Admin ✅ (rename) | Admin ✅ (guard if in use) |
| Report | Auth ✅ (file) | — | Admin ✅ (dismiss/resolve) |
| Notification | System-generated only | Owner ✅ (mark read) | — |

---

## Auth notes

- NextAuth v5, Credentials only, JWT sessions. Config split: **`auth.config.ts`**
  (Edge-safe: session/pages/callbacks, no DB) is spread into **`auth.ts`** (adds the
  Credentials provider with Prisma/bcrypt). `proxy.ts` uses `auth.config.ts` so
  middleware stays Edge-safe.
- `role` is on the JWT + session (`session.user.role`, still accessed via `as any` cast
  in most places — a `next-auth.d.ts` augmentation is a nice-to-have that was never
  done).
- **NextAuth's `signIn()` returns a raw error code** (`res.error`, e.g.
  `"CredentialsSignin"`) — LoginForm now maps this to a fixed friendly message rather
  than rendering it. Don't reintroduce `res.error || "fallback"` (that pattern silently
  shows the raw code, since `res.error` is truthy).
- `proxy.ts` matcher covers `/dashboard`, `/favorites`, `/profile`, `/reading-list`,
  `/reviews`, `/notifications`, `/settings`, `/admin/*`, `/comicseries/*`. **Per-route
  `auth()` role checks are the real boundary; middleware is UX.**
- Deactivated users (`isActive: false`) are blocked at `authenticate()` — same "invalid
  credentials" response as a wrong password.

---

## Deployment (Vercel) — already live

- **Root Directory = `my-app`** (the Next app is in a subfolder of the repo).
- **Env vars set in Vercel** (Production + Preview): `DATABASE_URL`, `AUTH_SECRET`,
  `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `BLOB_READ_WRITE_TOKEN`. All must match the values in
  local `my-app/.env` (same DB, same admin creds) except the Blob token, which is
  store-specific.
- **Blob store must be Public access** — a private store rejects the app's
  `access: "public"` uploads with `"Cannot use public access on a private store"`.
  Access is set at store creation time and can't be toggled after; if you ever need to
  recreate it, choose Public explicitly and reconnect the project (this replaces
  `BLOB_READ_WRITE_TOKEN`, which requires a redeploy).
- **Env var changes require a redeploy** to take effect — they're baked in at build
  time, not read live.
- See `handoff.md` §9 for the unresolved connection-pool / performance situation before
  touching `prisma.ts` or database-related env vars.
