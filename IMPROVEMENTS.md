# Improvement Sprint — Change Log

This document records all changes made during the 7-day improvement sprint following the evaluation review. Each section explains **what was changed**, **why**, and **what problem it solves**.

---

## Evaluation Feedback Summary

| Area | Issue Identified |
|------|-----------------|
| UI/UX | Needs refinement to meet expected frontend standards |
| API Integration | Requires better clarity and completeness |
| Code Structure | Can be further improved for maintainability |
| Documentation | Basic — needs enhancement |
| Git Practices | Can be more structured and disciplined |
| Testing | No tests exist |

---

## Day 1 — Code Structure & Dev Tooling Foundation

**Date:** 2026-05-12

### 1.1 Added ESLint + Prettier

**Files added:**
- `client/eslint.config.js`
- `client/.prettierrc`

**Scripts added to `client/package.json`:**
```json
"lint": "eslint src --ext .ts,.tsx",
"lint:fix": "eslint src --ext .ts,.tsx --fix",
"format": "prettier --write src"
```

**Why:** There was no code formatter or linter configured. This caused inconsistent formatting across all 44 frontend source files and no automatic detection of accessibility or React Hooks violations.

**ESLint plugins configured:**
- `@typescript-eslint` — TypeScript-aware linting, warns on `any` types
- `eslint-plugin-react` + `react-hooks` — React best practices, exhaustive deps
- `eslint-plugin-jsx-a11y` — Accessibility violations (ARIA, alt text, click events)
- `eslint-config-prettier` — Disables formatting rules that conflict with Prettier

---

### 1.2 Eliminated Duplicate Axios Instance

**Before:** Two identical axios instances existed:
- `client/src/common/axiosInstance.ts` (used by all services)
- `client/src/api/axios.ts` (used by `ForgotPasswordPage`)

**After:**
- `axiosInstance.ts` is the single source of truth
- `api/axios.ts` re-exports from `axiosInstance.ts`: `export { api as default } from '../common/axiosInstance'`

**Why:** Two separate instances meant any change to interceptors had to be made in two places. This caused the response interceptor (added below) to potentially be missed for some requests.

---

### 1.3 Added Centralized Response Interceptor

**File changed:** `client/src/common/axiosInstance.ts`

**Before:** Every service file had a `try/catch` that called `console.error` and rethrew the error. Errors were never shown to the user in a normalized way.

```typescript
// Old pattern in every service (15 instances):
try {
  const response = await api.get('/ads');
  return response.data;
} catch (error) {
  console.error('Error fetching ads:', error);
  throw error;
}
```

**After:** One response interceptor in `axiosInstance.ts` handles all HTTP error codes:

| Status | Behavior |
|--------|----------|
| 401 | Clears token from localStorage, redirects to `/login` |
| 403 | Throws `"You don't have permission to do this."` |
| 404 | Throws server message or `"The requested resource was not found."` |
| 400 / 422 | Extracts NestJS ValidationPipe message array, throws first message |
| Any other | Throws server message or `"Something went wrong. Please try again."` |

All services now have clean, single-line implementations with no `try/catch` and no `console.error`.

---

### 1.4 Removed `any` Types from All Redux Thunks

**Files changed:**
- `client/src/store/slices/adsSlice.ts`
- `client/src/store/slices/authSlice.ts`
- `client/src/store/slices/categoriesSlice.ts`
- `client/src/store/slices/favouritesSlice.ts`

**Before:** All 8 async thunks were typed as `any`:
```typescript
export const fetchAllAdsHandler: any = createAsyncThunk(...)
```

**After:** Proper RTK generic signatures:
```typescript
export const fetchAllAdsHandler = createAsyncThunk<PaginatedAds, AdFilters>(
  'ads/fetchAll',
  (filters, { rejectWithValue }) =>
    fetchAllAds(filters).catch((err: Error) => rejectWithValue(err.message))
);
```

**Also fixed:** The `rejected` cases in all slices previously did nothing. They now populate `state.error` with the rejection message so pages can display it to users:
```typescript
.addCase(fetchAllAdsHandler.rejected, (state, action) => {
  state.loading = false;
  state.error = (action.payload as string) ?? 'Failed to load ads.';
});
```

---

### 1.5 Created Shared `types/index.ts`

**File added:** `client/src/types/index.ts`

**Exports:**
- `Ad` — Full ad interface with all fields (status as union type `'active' | 'sold' | 'inactive'`)
- `AuthUser` — Authenticated user shape
- `Category` — Hierarchical category with optional subcategories
- `Favourite` — Favourite record with typed `ad: Ad` (was `ad: any`)
- `PaginatedAds` — Paginated response shape

**Why:** Each slice and several pages defined their own local `interface Ad` or `interface AuthUser`. This meant types could drift out of sync. One canonical source prevents that.

---

### 1.6 Added JSDoc to All Service Functions

**Files changed:**
- `client/src/services/ads.service.ts`
- `client/src/services/auth.service.ts`
- `client/src/services/categories.service.ts`
- `client/src/services/favourites.service.ts`
- `client/src/services/upload.service.ts`

Every exported function now has a `/** ... */` JSDoc block with `@param`, `@returns`, and `@throws`. This enables IDE hover tooltips and makes the API contract explicit.

---

### 1.7 Added Commitlint for Conventional Commits

**Files added:**
- `.commitlintrc.json` — Enforces `feat/fix/chore/refactor/docs/test/style/perf` prefixes
- `.husky/commit-msg` — Git hook that runs commitlint on every commit

**Why:** The evaluation specifically flagged "git practices can be more structured." Commitlint ensures every commit since Day 1 follows the Conventional Commits format, making the git log readable as a changelog.

**Allowed commit types:**
```
feat     — New feature
fix      — Bug fix
refactor — Code restructure (no behavior change)
docs     — Documentation only
test     — Adding or fixing tests
chore    — Build tools, dependencies, config
style    — Formatting (no logic change)
perf     — Performance improvement
ci       — CI/CD configuration
revert   — Reverts a previous commit
```

---

### 1.8 Updated Documentation (README.md)

**File changed:** `README.md`

**Errors corrected:**
- Line 14: `"State Management: Zustand"` → `"State Management: Redux Toolkit"` (the project uses Redux, not Zustand)
- Project structure comment `"Zustand state management"` → `"Redux Toolkit slices"`
- Payment model was missing from Database Models table
- Razorpay, SMTP, and Socket.io features were not listed in Features section
- Admin panel (5 pages) was not mentioned anywhere

**New sections added:**
- **Architecture Overview** — text diagram showing Browser → Vite → NestJS → PostgreSQL flow and JWT auth flow
- **API Quick Reference** — request/response examples for login, ad search, image upload
- **Client environment variables** — `VITE_API_URL` and `VITE_SOCKET_URL` (were missing entirely)
- **Development Commands** — lint, format, migration commands
- **Troubleshooting** — 5 common issues with solutions

---

## Planned (Days 2–7)

### Day 2 — Accessibility & Mobile UX
- Add `ErrorBoundary` component (currently crashes show blank white screen)
- Add ARIA labels to all interactive elements (only 1 exists in the whole app currently)
- Add mobile hamburger navigation (authenticated links invisible on mobile)
- Replace `window.confirm()` delete dialog with styled `ConfirmModal` component

### Day 3 — API Integration & Data Flow
- Replace all hardcoded `http://localhost:3000` URLs (found in 5 files) with `VITE_*` env vars
- Add error states to Admin pages (currently crash silently if API fails)
- Surface Redux `error` state to users on Search, MyAds, Favourites pages
- Extract custom hooks (`useAds`, `useAdDetail`, `useMyAds`, `useFavourites`) to remove repeated dispatch+selector+useEffect patterns

### Day 4 — Form Validation & Mobile Responsiveness
- Migrate `PostAdPage` from raw `useState` to `react-hook-form` (Login/Register already use it)
- Strengthen `RegisterPage` validation (add email regex, Indian phone number pattern, password strength indicator)
- Fix `SearchPage` mobile filter: change inline toggle to fixed overlay drawer
- Add keyboard navigation (ArrowUp/Down/Enter/Escape) to Navbar dropdowns

### Day 5 — Documentation
- Create `CONTRIBUTING.md` with branch naming, PR checklist, code style guidelines
- Add JSDoc to all custom hooks

### Day 6 — Visual Polish & Consistency
- Add Tailwind `@layer components` classes (`.input-field`, `.btn-primary`, `.btn-secondary`)
- Standardize empty states across all pages (replace emoji with Lucide icons)
- Add "SOLD" overlay to AdCard for sold listings
- Wire Redux error state to `toast.error()` calls on Search and AdDetail pages

### Day 7 — Testing Setup
- Configure Vitest + `@testing-library/react` (Vite-native, zero extra config)
- Write tests for `resolveImageUrl` utility
- Write tests for `formatDate` utility
- Write component tests for `AdCard` (price format, favourite button, sold overlay)
- Write `PrivateRoute` redirect test (unauthenticated → `/login`)

---

## Files Changed in Day 1

```
client/
├── eslint.config.js                   ← NEW: ESLint 9 flat config
├── .prettierrc                        ← NEW: Prettier rules
├── package.json                       ← UPDATED: added lint/format scripts, "type":"module"
└── src/
    ├── types/index.ts                 ← NEW: shared Ad, AuthUser, Category, Favourite, PaginatedAds
    ├── common/axiosInstance.ts        ← UPDATED: added response interceptor
    ├── api/axios.ts                   ← UPDATED: now re-exports from axiosInstance (no duplication)
    ├── services/
    │   ├── ads.service.ts             ← UPDATED: removed try/catch+console.error, added JSDoc
    │   ├── auth.service.ts            ← UPDATED: removed try/catch+console.error, added JSDoc, typed updateMe
    │   ├── categories.service.ts      ← UPDATED: removed try/catch+console.error, added JSDoc
    │   ├── favourites.service.ts      ← UPDATED: removed try/catch+console.error, added JSDoc
    │   ├── messages.service.ts        ← FIXED: removed double semicolon
    │   └── upload.service.ts          ← UPDATED: removed try/catch+console.error, added JSDoc
    └── store/slices/
        ├── adsSlice.ts                ← UPDATED: removed `any`, proper generics, populates state.error
        ├── authSlice.ts               ← UPDATED: removed `any`, proper generics, uses shared AuthUser
        ├── categoriesSlice.ts         ← UPDATED: removed `any`, proper generics, uses shared Category
        └── favouritesSlice.ts         ← UPDATED: removed `any`, proper generics, uses shared Favourite

Root/
├── README.md                          ← UPDATED: corrected errors, added architecture + API docs + troubleshooting
├── IMPROVEMENTS.md                    ← NEW: this file
├── .commitlintrc.json                 ← NEW: conventional commit rules
└── .husky/commit-msg                  ← NEW: git hook to run commitlint
```
