# OLX Clone

A full-stack web portal replicating core OLX India (olx.in) functionality. This project allows users to buy and sell items locally through a classifieds platform with features like user authentication, ad posting, searching, and messaging.

## 🚀 Tech Stack

- **Frontend:** React 18 + TypeScript + Vite + Tailwind CSS
- **Backend:** NestJS + TypeScript
- **Database:** PostgreSQL
- **ORM:** Sequelize + sequelize-typescript
- **Authentication:** JWT + bcrypt (@nestjs/jwt, @nestjs/passport)
- **File Storage:** Cloudinary (ad images)
- **Maps:** Leaflet.js (location picking)
- **State Management:** Zustand
- **Version Control:** Git

## ✨ Features

### Core Functionality
1. **User Management**
   - User registration and login with JWT authentication
   - Profile management

2. **Ad Management**
   - Browse ads by category and city
   - Post new ads with images, location, and details
   - Edit and delete own listings
   - Ad detail pages with seller contact information

3. **Search & Discovery**
   - Advanced search with filters (category, price range, city)
   - Browse by categories

4. **User Interaction**
   - Save favorite ads
   - Send messages to sellers
   - View own ads dashboard

5. **UI/UX**
   - Responsive mobile-first design
   - OLX-inspired interface

### Categories Supported
- Cars
- Motorcycles
- Mobile Phones
- Electronics
- Furniture
- Jobs
- Real Estate
- Fashion

## 🛠️ Prerequisites

Before running this application, make sure you have the following installed:

- Node.js (v16 or higher)
- npm or yarn
- PostgreSQL
- Git

## 📦 Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd olx-clone
   ```

2. **Install dependencies:**
   ```bash
   npm run install:all
   ```

## ⚙️ Environment Setup

1. **Database Setup:**
   - Create a PostgreSQL database named `olx_clone`
   - Update database credentials in `server/.env`

2. **Environment Variables:**

   Create a `.env` file in the `server/` directory with the following variables:
   ```env
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=olx_clone
   DB_USER=postgres
   DB_PASS=yourpassword
   JWT_SECRET=your_jwt_secret
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   PORT=3000
   ```

3. **Database Migrations:**
   ```bash
   cd server
   npx sequelize-cli db:migrate
   npx sequelize-cli db:seed:all
   ```

## 🚀 Running the Application

### Development Mode
```bash
# Start both frontend and backend concurrently
npm run dev

# Or run them separately:
# Backend only
cd server && npm run start:dev

# Frontend only
cd client && npm run dev
```

### Production Build
```bash
npm run build
```

## 📁 Project Structure

```
olx-clone/
├── client/                  # React frontend (Vite)
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/           # Page components
│   │   ├── services/        # API service functions
│   │   ├── store/           # Zustand state management
│   │   └── api/             # Axios configuration
├── server/                  # NestJS backend
│   ├── src/
│   │   ├── auth/            # Authentication module
│   │   ├── users/           # User management
│   │   ├── ads/             # Ads management
│   │   ├── categories/      # Categories management
│   │   ├── favourites/      # Favorites functionality
│   │   ├── messages/        # Messaging system
│   │   ├── upload/          # File upload handling
│   │   ├── database/        # Database configuration & models
│   │   └── common/          # Shared utilities
│   └── uploads/             # Uploaded files directory
├── docker-compose.yml       # Docker configuration
└── package.json            # Root package.json with scripts
```

## 🗄️ Database Models

- **User** — id, name, email, phone, passwordHash, city, avatar, createdAt
- **Category** — id, name, slug, icon, parentId
- **Ad** — id, title, description, price, images (JSONB), categoryId, userId, city, state, lat, lng, status, views, createdAt
- **Favourite** — userId, adId
- **Message** — id, senderId, receiverId, adId, body, createdAt

## 🧪 Testing

```bash
npm test
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 Commit Convention

```
feat: add category filter to search
fix: resolve image upload 500 error
chore: update sequelize migration for messages
```

## 📄 License

This project is for educational purposes as part of the PSSPL AI Acceleration Month evaluation.

## 👥 Authors

- Tanushree Charvey

## 🙏 Acknowledgments

- OLX India for the inspiration
- PSSPL AI Acceleration Month program