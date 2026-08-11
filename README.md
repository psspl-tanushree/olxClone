# OLX Clone

A full-stack classifieds platform replicating core OLX India (olx.in) functionality. Users can register, post ads with images and location, search/filter listings, save favourites, chat with sellers in real time, and promote ads via Razorpay payments. Includes a full admin panel with role-based access.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + TypeScript + Vite |
| Styling | Tailwind CSS (custom OLX theme) |
| State Management | Redux Toolkit |
| Routing | React Router v6 |
| Backend | NestJS + TypeScript |
| Database | PostgreSQL 15 |
| ORM | Sequelize + sequelize-typescript |
| Authentication | JWT + bcrypt |
| File Storage | Cloudinary |
| Maps | Leaflet.js |
| Payments | Razorpay |
| Email | Nodemailer (SMTP) |
| Real-time | Socket.io (WebSocket) |
| API Docs | Swagger / OpenAPI at `/api/docs` |
| DevOps | Docker Compose (PostgreSQL) |

---

## Features

### User Features
1. **Authentication** — Register, login with JWT, forgot password via OTP email
2. **Ad Management** — Post ads with up to 5 images (Cloudinary), Leaflet map location picker, edit/delete own ads
3. **Search & Discovery** — Keyword search + category + city + price range filters with pagination
4. **Favourites** — Save and unsave ads; view saved ads dashboard
5. **Real-time Messaging** — WebSocket-powered buyer–seller chat per ad
6. **Ad Promotion** — Pay via Razorpay to feature an ad for 7 or 30 days
7. **Profile Management** — Update name, city, phone, avatar

### Admin Features
8. **Admin Panel** — Role-based dashboard with: user management, ad moderation, category management, payment tracking, stats overview

---

## Architecture Overview

```
Browser (port 5173)
    │
    ├── Vite Dev Server (/api proxy)
    │       │
    │       └── NestJS API (port 3000)
    │               ├── Auth Module       (JWT, OTP email)
    │               ├── Users Module      (profile CRUD)
    │               ├── Ads Module        (CRUD, search, filters)
    │               ├── Categories Module (hierarchical tree)
    │               ├── Favourites Module (toggle save)
    │               ├── Messages Module   (REST + WebSocket gateway)
    │               ├── Payments Module   (Razorpay order/verify)
    │               ├── Upload Module     (Cloudinary via Multer)
    │               └── Admin Module      (role-guarded stats/management)
    │                       │
    │               PostgreSQL (port 5432)
    │
    └── Socket.io (WebSocket on same port 3000)
```

**JWT Flow:** `POST /auth/login` → `{ access_token }` → stored in `localStorage` → injected into every request via Axios request interceptor (`Authorization: Bearer <token>`). Expired/invalid tokens (401) are caught by the Axios response interceptor, which clears storage and redirects to `/login` automatically.

---

## Prerequisites

- Node.js v18+
- npm v9+
- PostgreSQL 15 (or use Docker)
- Git

---

## Installation

### 1. Clone the repository
```bash
git clone https://github.com/psspl-tanushree/olxClone.git
cd olxClone
```

### 2. Install all dependencies
```bash
npm run install:all
```

### 3. Set up environment variables

**Server** — create `server/.env`:
```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=olx_clone
DB_USER=postgres
DB_PASS=yourpassword

# Auth
JWT_SECRET=your_jwt_secret_min_32_chars

# Cloudinary (image uploads)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Razorpay (ad promotion payments)
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxx
RAZORPAY_KEY_SECRET=your_razorpay_secret

# Email (OTP password reset)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password

PORT=3000
```

**Client** — create `client/.env`:
```env
VITE_API_URL=http://localhost:3000
VITE_SOCKET_URL=http://localhost:3000
```

### 4. Start PostgreSQL

Using Docker:
```bash
docker-compose up -d
```

Or manually create a database named `olx_clone`.

### 5. Run database migrations and seed data
```bash
cd server
npx sequelize-cli db:migrate
npx sequelize-cli db:seed:all
```

---

## Running the Application

```bash
# Start both frontend and backend concurrently
npm run dev

# Frontend only (port 5173)
cd client && npm run dev

# Backend only (port 3000, hot reload)
cd server && npm run start:dev
```

Access the app at `http://localhost:5173`
API docs (Swagger) at `http://localhost:3000/api/docs`

---

## API Quick Reference

### Authentication

**Login**
```http
POST /api/auth/login
Content-Type: application/json

{ "email": "user@example.com", "password": "password123" }
```
```json
{ "access_token": "eyJhbG...", "user": { "id": 1, "name": "John", "email": "...", "role": "user" } }
```

**Register**
```http
POST /api/auth/register
Content-Type: application/json

{ "name": "John Doe", "email": "user@example.com", "password": "password123", "phone": "9876543210", "city": "Mumbai" }
```

### Ads

**Search / List ads**
```http
GET /api/ads?search=iphone&categoryId=3&city=Mumbai&minPrice=5000&maxPrice=80000&page=1&limit=20
Authorization: Bearer <token>  (optional)
```
```json
{ "data": [...], "total": 42, "page": 1, "limit": 20 }
```

**Post an ad**
```http
POST /api/ads
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "iPhone 15 Pro Max",
  "description": "6 months old, excellent condition",
  "price": 85000,
  "categoryId": 3,
  "images": ["https://res.cloudinary.com/..."],
  "city": "Mumbai",
  "state": "Maharashtra",
  "lat": 19.0760,
  "lng": 72.8777
}
```

**Upload images** (call before posting an ad)
```http
POST /api/upload/images
Authorization: Bearer <token>
Content-Type: multipart/form-data

files: [image1.jpg, image2.jpg]   (max 5 files)
```
```json
{ "urls": ["https://res.cloudinary.com/demo/image/upload/..."] }
```

---

## Project Structure

```
olxClone/
├── client/                      # React frontend (Vite, port 5173)
│   ├── src/
│   │   ├── admin/               # Admin panel pages & layout
│   │   ├── components/          # Reusable UI: Navbar, Footer, AdCard, PromoteModal, PrivateRoute, ConfirmModal, ErrorBoundary
│   │   ├── hooks/               # Custom React hooks (useAds, useAdDetail, useMyAds, useFavourites)
│   │   ├── pages/               # Route pages (12 pages)
│   │   ├── services/            # API service functions (6 services, JSDoc-documented)
│   │   ├── store/               # Redux Toolkit slices (ads, auth, categories, favourites)
│   │   ├── types/               # Shared TypeScript interfaces (Ad, AuthUser, Category, Favourite)
│   │   ├── utils/               # Helpers: imageUrl, formatDate
│   │   ├── common/              # axiosInstance (with request + response interceptors)
│   │   └── api/                 # Re-exports axiosInstance for backward compatibility
│   ├── eslint.config.js         # ESLint flat config (TypeScript + React + a11y + Prettier)
│   ├── .prettierrc              # Prettier formatting rules
│   └── package.json
├── server/                      # NestJS backend (port 3000)
│   ├── src/
│   │   ├── auth/                # JWT auth, OTP password reset, Nodemailer
│   │   ├── users/               # User profile CRUD
│   │   ├── ads/                 # Ad CRUD, search, filters, pagination
│   │   ├── categories/          # Category hierarchy management
│   │   ├── favourites/          # Toggle save/unsave
│   │   ├── messages/            # Buyer–seller messaging + Socket.io gateway
│   │   ├── payments/            # Razorpay order creation & verification
│   │   ├── upload/              # Cloudinary image upload (Multer)
│   │   ├── admin/               # Role-guarded admin endpoints
│   │   ├── database/            # Models, migrations (8), seeders
│   │   └── common/              # JwtAuthGuard, CurrentUser decorator
│   └── package.json
├── .commitlintrc.json           # Conventional commit enforcement
├── docker-compose.yml           # PostgreSQL 15 container
├── IMPROVEMENTS.md              # Change log for the improvement sprint
└── package.json                 # Root scripts (install:all, dev, build)
```

---

## Database Models

| Model | Key Fields |
|-------|-----------|
| User | id, name, email, phone, passwordHash, city, avatar, role, resetOtp, resetOtpExpiry |
| Category | id, name, slug, icon, parentId (self-referential hierarchy) |
| Ad | id, title, description, price, images (JSONB), categoryId, userId, city, state, lat, lng, status, views, featured, featuredUntil |
| Favourite | userId, adId |
| Message | id, senderId, receiverId, adId, body |
| Payment | id, userId, adId, razorpayOrderId, razorpayPaymentId, amount, plan, status |

**Migrations run order:**
```
20260428000001-create-users
20260428000002-create-categories
20260428000003-create-ads
20260428000004-create-favourites
20260428000005-create-messages
20260428000006-add-reset-otp-to-users
20260428000007-add-featured-to-ads
20260428000008-create-payments
```

---

## Development Commands

```bash
# Root level
npm run install:all      # Install all dependencies (root + client + server)
npm run dev              # Start both servers concurrently
npm run build            # Build both client and server for production

# Client (cd client)
npm run lint             # ESLint check
npm run lint:fix         # ESLint auto-fix
npm run format           # Prettier format all src files

# Server (cd server)
npx sequelize-cli db:migrate          # Run pending migrations
npx sequelize-cli db:seed:all         # Seed category data
npx sequelize-cli db:migrate:undo     # Rollback last migration
npm run test                          # Run Jest tests
```

---

## Troubleshooting

**Socket connection fails (real-time chat not working)**
- Check that `VITE_SOCKET_URL` in `client/.env` matches the backend port (`http://localhost:3000`)
- Ensure the NestJS server is running before connecting

**Images not loading after upload**
- Verify `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, and `CLOUDINARY_API_SECRET` are set in `server/.env`
- For local (non-Cloudinary) uploads, set `VITE_API_URL=http://localhost:3000` in `client/.env`

**401 Unauthorized on all requests**
- JWT token may have expired — clear `localStorage` (`token` and `auth_user` keys) and log in again
- Or the `JWT_SECRET` in `server/.env` may have changed since the token was issued

**Database migration errors**
```bash
cd server
npx sequelize-cli db:migrate:undo:all   # Roll back all
npx sequelize-cli db:migrate            # Re-run from scratch
```

**CORS errors in browser**
- Ensure `client origin` in `server/src/main.ts` matches your Vite dev server URL (default: `http://localhost:5173`)

**`npm run dev` fails — port already in use**
```bash
lsof -ti:3000 | xargs kill   # Free port 3000 (backend)
lsof -ti:5173 | xargs kill   # Free port 5173 (frontend)
```

---

## Git Commit Convention

This project uses [Conventional Commits](https://www.conventionalcommits.org/) enforced by `commitlint` + `husky`:

```
feat: add real-time notification badge to navbar
fix: resolve 401 redirect loop on token expiry
refactor: extract custom hooks for data fetching
docs: add API quick reference to README
test: add vitest unit tests for AdCard component
chore: add eslint and prettier configuration
style: standardize input field focus styles
perf: lazy-load AdDetailPage images
```

---

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for branch naming, PR checklist, and code style guidelines.

---

## License

Educational project — PSSPL AI Acceleration Month.

**Author:** Tanushree Charvey
