# Smart Calendar

A full-stack calendar application with Google OAuth authentication and PostgreSQL database.

## 🚀 Quick Setup

### Prerequisites

- Node.js (v18 or higher)
- PostgreSQL (v12 or higher)
- Google Cloud Console account

### 1. Environment Setup

#### Frontend (Root directory)

```bash
npm install
```

#### Backend (Server directory)

```bash
cd server
npm install
```

### 2. Database Setup

1. **Install PostgreSQL** if not already installed
2. **Create database**:
   ```sql
   CREATE DATABASE smart_calendar;
   ```

### 3. Environment Variables

Create `.env` file in the `server` directory:

```env
# Database Configuration
DATABASE_URL="postgresql://postgres:your_password@localhost:5432/smart_calendar"

# Google OAuth Configuration
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
GOOGLE_CALLBACK_URL="http://localhost:3001/api/auth/google/callback"

# Session Configuration
COOKIE_SESSION_SECRET="your-super-secret-session-key-change-this-in-production"

# Server Configuration
PORT=3001
NODE_ENV=development
FRONTEND_URL="http://localhost:5173"
```

### 4. Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google+ API
4. Create OAuth 2.0 credentials:
   - Application type: Web application
   - Authorized redirect URIs: `http://localhost:3001/api/auth/google/callback`
5. Copy Client ID and Client Secret to `.env` file

### 5. Database Migration

```bash
cd server
npx prisma migrate dev --name init
```

### 6. Start the Application

#### Terminal 1 - Backend

```bash
cd server
npm run dev
```

#### Terminal 2 - Frontend

```bash
npm run dev
```

### 7. Access the Application

- Frontend: http://localhost:5173
- Backend API: http://localhost:3001

## 🔧 Features

- ✅ Google OAuth Authentication
- ✅ PostgreSQL Database Integration
- ✅ Calendar Event Management
- ✅ Category & Subcategory System
- ✅ Kanban Board for Tasks
- ✅ Task Templates
- ✅ Real-time Data Sync

## 🛠️ Technology Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS, Vite
- **Backend**: Node.js, Express, TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: Google OAuth 2.0
- **Session Management**: Cookie-based sessions

## 📁 Project Structure

```
smart-calendar/
├── components/          # React components
├── hooks/              # Custom React hooks
├── server/             # Backend server
│   ├── src/            # Server source code
│   ├── prisma/         # Database schema
│   └── .env            # Environment variables
├── types.ts            # TypeScript type definitions
├── constants.ts        # Application constants
└── server/api_axios.ts # API client
```

## 🚨 Troubleshooting

### Database Connection Issues

- Ensure PostgreSQL is running
- Check DATABASE_URL format in `.env`
- Verify database exists: `smart_calendar`

### Google OAuth Issues

- Verify Client ID and Secret in `.env`
- Check redirect URI matches exactly
- Ensure Google+ API is enabled

### Port Conflicts

- Backend: Change PORT in `.env` (default: 3001)
- Frontend: Change in `vite.config.ts` (default: 5173)

### TypeScript Errors

- Run `npx prisma generate` in server directory
- Ensure all dependencies are installed

## 🔒 Security Notes

- Change `COOKIE_SESSION_SECRET` in production
- Use HTTPS in production
- Set `NODE_ENV=production` in production
- Use strong database passwords
- Regularly update dependencies
