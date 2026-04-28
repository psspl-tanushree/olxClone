# OLX Clone – Claude Code Project

## Project Overview
A full-stack web portal replicating core OLX India (olx.in) functionality, built as part of the PSSPL AI Acceleration Month practical evaluation (8-day sprint, starting 2026-04-28).

## Tech Stack
- **Frontend:** React 18 + TypeScript + Vite + Tailwind CSS
- **Backend:** NestJS + TypeScript
- **Database:** PostgreSQL
- **ORM:** Sequelize + sequelize-typescript
- **Auth:** JWT + bcrypt (@nestjs/jwt, @nestjs/passport)
- **File Storage:** Cloudinary (ad images)
- **Maps:** Leaflet.js (location picking)
- **Version Control:** Git

## Project Structure
```
olx-clone/
├── client/                  # React frontend (Vite)
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── hooks/
│   │   ├── store/           # Zustand state
│   │   └── api/             # Axios client
├── server/                  # NestJS backend
│   ├── src/
│   │   ├── auth/            # JWT auth module
│   │   ├── users/           # Users module
│   │   ├── ads/             # Ads module
│   │   ├── categories/      # Categories module
│   │   ├── favourites/      # Favourites module
│   │   ├── messages/        # Messages module
│   │   ├── upload/          # Cloudinary upload module
│   │   ├── database/        # Sequelize config & models
│   │   └── common/          # Guards, decorators, pipes
│   ├── test/
│   └── nest-cli.json
└── docker-compose.yml
```

## Core Features (Priority Order)
1. User registration & login (JWT auth)
2. Browse ads by category & city
3. Post a new ad (title, description, price, images, location)
4. Ad detail page with seller contact
5. Search with filters (category, price range, city)
6. My Ads dashboard (CRUD on own listings)
7. Favourites / saved ads
8. Responsive mobile-first UI matching OLX look & feel

## Key Categories to Implement
Cars, Motorcycles, Mobile Phones, Electronics, Furniture, Jobs, Real Estate, Fashion

## Database Models (Sequelize)
- **User** — id, name, email, phone, passwordHash, city, avatar, createdAt
- **Category** — id, name, slug, icon, parentId
- **Ad** — id, title, description, price, images (JSONB), categoryId, userId, city, state, lat, lng, status, views, createdAt
- **Favourite** — userId, adId
- **Message** — id, senderId, receiverId, adId, body, createdAt

## Development Commands
```bash
# Install all deps
npm run install:all

# Start dev servers (frontend + backend concurrently)
npm run dev

# Backend only
cd server && npm run start:dev

# Frontend only
cd client && npm run dev

# Database migrations (Sequelize CLI)
cd server && npx sequelize-cli db:migrate
cd server && npx sequelize-cli db:seed:all

# Build
npm run build

# Tests
npm test
```

## Environment Variables
See `.env.example` for all required vars. Copy to `.env` before running.

```
# server/.env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=olx_clone
DB_USER=postgres
DB_PASS=yourpassword
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
PORT=3000
```

## Git Commit Convention
```
feat: add category filter to search
fix: resolve image upload 500 error
chore: update sequelize migration for messages
```

## Evaluation Checklist
- [ ] Claude Code used throughout development
- [ ] Git history with meaningful commits
- [ ] Database migrations committed (Sequelize)
- [ ] NestJS modules structured per feature
- [ ] API documented (routes listed in README)
- [ ] All 8 core features working
- [ ] Mobile-responsive UI
- [ ] .env.example present (no secrets committed)
