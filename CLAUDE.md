# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Smart Calendar is a full-stack TypeScript application with React 19 frontend and Node.js/Express backend, featuring Google OAuth authentication and PostgreSQL database integration.

## Core Development Commands

### Frontend Development
```bash
# Install dependencies
npm install

# Development server (runs on http://localhost:5173)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Backend Development
```bash
# Navigate to server directory
cd server

# Install dependencies
npm install

# Development server with auto-reload (runs on http://localhost:3001)
npm run dev

# Build TypeScript
npm run build

# Production server
npm start

# Prisma commands
npm run prisma:generate    # Generate Prisma client
npm run prisma:migrate     # Run database migrations
npx prisma migrate dev --name init    # Initialize database
```

## Architecture & Code Standards

### Project Structure
```
smart-calendar/
├── App.tsx                 # Main React application
├── components/             # React components
│   ├── ui/                 # Reusable UI components (Dialog, Icons)
│   ├── EventModal.tsx      # Event creation/editing
│   ├── KanbanModal.tsx     # Task management board
│   └── AdminSettingsModal.tsx  # Category/template management
├── types.ts               # TypeScript type definitions
├── constants.ts           # Application constants
├── server/
│   ├── src/
│   │   ├── index.ts       # Express server entry
│   │   ├── db.ts          # Prisma database client
│   │   └── types.ts       # Server type definitions
│   ├── prisma/
│   │   └── schema.prisma  # Database schema
│   └── api_axios.ts       # Frontend API client
└── vite.config.ts         # Vite configuration
```

### TypeScript Standards
- **NEVER** use `any` type - use proper typing or `unknown`
- **ALWAYS** define explicit interfaces for component props (e.g., `ComponentNameProps`)
- **ALWAYS** type async function return values: `Promise<Event[]>`
- **ALWAYS** use existing types from `types.ts`

### React Patterns
- **ALWAYS** use PascalCase for component names and files
- **ALWAYS** include `isOpen: boolean` and `onClose: () => void` for modal components
- **ALWAYS** use `useCallback` for event handlers passed as props
- **ALWAYS** use `useMemo` for expensive calculations
- Modal components must follow the established `Dialog` wrapper pattern

### Styling Standards
- **ONLY** use Tailwind CSS classes - no inline styles or custom CSS files
- **ALWAYS** follow the established color system:
  - Primary: `bg-primary`, `text-primary`
  - Gray scale: `text-gray-900`, `text-gray-700`, `text-gray-500`
  - Danger: `text-red-600`, `hover:bg-red-50`

### API Patterns
- **ALWAYS** prefix API functions with `api` (e.g., `apiGetEvents`, `apiSaveEvent`)
- **ALWAYS** use async/await pattern with try/catch blocks
- **ALWAYS** validate user input and ownership on both frontend and backend
- **ALWAYS** use proper HTTP status codes (400, 401, 403, 404, 500)

### Database Operations
- **ONLY** use Prisma Client for database operations - no raw SQL
- **ALWAYS** check user ownership before modifying data
- **ALWAYS** use transactions for multiple related operations
- **ALWAYS** include proper relations in queries

## Authentication System

The application uses Google OAuth 2.0 for authentication:
- Session-based authentication with cookie-session
- Protected routes require `ensureAuthenticated` middleware
- Frontend checks `currentUser` state before protected actions
- All API endpoints under `/api/v1` require authentication

## Environment Setup

### Required Environment Variables (.env in server directory)
```env
# Database
DATABASE_URL="postgresql://postgres:password@localhost:5432/smart_calendar"

# Google OAuth
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
GOOGLE_CALLBACK_URL="http://localhost:3001/api/auth/google/callback"

# Session
COOKIE_SESSION_SECRET="your-super-secret-session-key"

# Server
PORT=3001
NODE_ENV=development
FRONTEND_URL="http://localhost:5173"
```

### Database Setup
1. Install PostgreSQL
2. Create database: `CREATE DATABASE smart_calendar;`
3. Run migrations: `cd server && npx prisma migrate dev --name init`

## Key Features & Domain Logic

### Category System
- Hierarchical categories with optional subcategories
- Each category has a color for visual identification
- Default categories include: 업무, 휴가, 회의, 출장, 기념일, 개인

### Event Management
- Events belong to categories and optional subcategories
- Date format: YYYY-MM-DD, Time format: HH:mm
- Events with "업무" category and subcategory enable Kanban board

### Kanban Board
- Only available for work events (업무 category) with subcategories
- Task statuses: ToDo, InProgress, Done
- Tasks can have comments with author and timestamp
- Task templates can be defined per subcategory

### Error Handling Patterns
- **ALWAYS** use try/catch for async operations
- **ALWAYS** log errors with `console.error`
- **ALWAYS** show user-friendly Korean error messages
- Handle 401 errors by redirecting to login

## Testing & Quality

- Follow TypeScript strict mode settings
- No TypeScript errors or warnings should be ignored
- Use proper null/undefined handling
- Validate all external data with type guards

## Security Considerations

- All user data operations require authentication
- User ownership validation before data modification
- Input sanitization on both frontend and backend
- Secure session configuration for production
- No sensitive data in error messages

## Common Troubleshooting

### Database Connection Issues
- Ensure PostgreSQL is running
- Verify DATABASE_URL format in .env
- Check if database exists

### Google OAuth Issues
- Verify Client ID and Secret in .env
- Check redirect URI matches exactly
- Ensure Google+ API is enabled

### Port Conflicts
- Frontend default: 5173 (configured in vite.config.ts)
- Backend default: 3001 (configured in .env PORT)

## Important Notes

- This project has extensive Cursor rules in `.cursor/rules/` directory with detailed patterns
- Korean language is used for user-facing messages and UI text
- The application supports real-time data sync between frontend and backend
- Component-based architecture with strict TypeScript enforcement