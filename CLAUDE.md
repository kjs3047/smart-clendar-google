# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Smart Calendar is a unified full-stack TypeScript application built with Next.js 15 App Router, featuring Google OAuth authentication and PostgreSQL database integration. **Successfully migrated from separate React + Express architecture to unified Next.js.**

## Core Development Commands

### Unified Development (Next.js)
```bash
# Install dependencies
npm install

# Development server (runs on http://localhost:3000)
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Prisma commands
npx prisma generate         # Generate Prisma client
npx prisma migrate dev       # Run database migrations
npx prisma migrate dev --name init    # Initialize database
```

### Legacy Commands (No longer used)
```bash
# These commands are no longer used after Next.js migration
# cd server && npm run dev  # OLD: Separate backend server
# npm run dev (in root)     # OLD: Separate frontend server
```

## Architecture & Code Standards

### Project Structure (Next.js Unified)
```
smart-calendar/
├── app/                    # Next.js App Router
│   ├── api/               # API Routes (replaces Express server)
│   │   ├── auth/          # Authentication endpoints
│   │   │   ├── google/    # Google OAuth routes
│   │   │   ├── logout/    # Logout endpoint
│   │   │   └── user/      # User info endpoint
│   │   └── v1/            # API v1 endpoints
│   │       ├── events/    # Event CRUD operations
│   │       ├── categories/ # Category management
│   │       └── task-templates/ # Task template management
│   ├── globals.css        # Global styles (Tailwind)
│   ├── layout.tsx         # Root layout component
│   └── page.tsx           # Main calendar page
├── components/            # React components
│   ├── ui/               # Reusable UI components (Dialog, Icons)
│   ├── EventModal.tsx    # Event creation/editing
│   ├── KanbanModal.tsx   # Task management board
│   └── AdminSettingsModal.tsx # Category/template management
├── lib/                  # Utilities and configurations
│   ├── auth.ts          # Authentication helpers
│   ├── db.ts            # Prisma database client
│   ├── api.ts           # Frontend API client
│   ├── middleware.ts    # Authentication middleware
│   └── constants.ts     # Application constants
├── prisma/              # Database schema and migrations
│   └── schema.prisma    # Database schema
├── types.ts             # TypeScript type definitions
└── next.config.js       # Next.js configuration
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
- Next.js API Routes for authentication endpoints
- Session-based authentication with cookie-session
- Protected routes require `withAuth` middleware
- Frontend checks `currentUser` state before protected actions
- All API endpoints under `/api/v1` require authentication

## Environment Setup

### Required Environment Variables (.env.local in project root)
```env
# Database
DATABASE_URL="postgresql://postgres:password@localhost:5432/smart_calendar"

# Google OAuth
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
GOOGLE_CALLBACK_URL="http://localhost:3000/api/auth/google/callback"

# Session
COOKIE_SESSION_SECRET="your-super-secret-session-key"

# Application
NODE_ENV=development
```

### Database Setup
1. Install PostgreSQL
2. Create database: `CREATE DATABASE smart_calendar;`
3. Run migrations: `npx prisma migrate dev --name init`

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

### Task Template System (Updated 2025-01-27)
- **Duplicate Content Prevention**: Pre-validation prevents saving duplicate template content
- **User-Friendly Error Messages**: Specific error messages showing which content is duplicated
- **Improved Developer Experience**: Separation of user errors from system errors in console
- **Database Constraint Handling**: Proper handling of Prisma unique constraint violations
- **Validation**: Server-side validation with client-side error handling

### Error Handling Patterns
- **ALWAYS** use try/catch for async operations
- **ALWAYS** log system errors with `console.error` (but not user errors like duplicates)
- **ALWAYS** show user-friendly Korean error messages
- **ALWAYS** provide specific error context when possible (e.g., which item is duplicated)
- Handle 401 errors by redirecting to login
- Separate user errors (duplicates, validation) from system errors in logging

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

### Task Template Issues (Updated 2025-01-27)
- **Duplicate Content Error**: If you see "중복된 내용의 태스크 템플릿이 있습니다", remove duplicate template entries
- **Validation Errors**: Check that subcategories are properly selected before saving templates
- **Database Constraints**: Unique constraint on (userId, subCategoryId, content) prevents duplicates

## Important Notes

- **Migration Complete**: Successfully migrated from React+Express to unified Next.js architecture
- **Single Port**: Application now runs on port 3000 only (no separate frontend/backend)
- **Modern Stack**: Next.js 15 App Router with React 19 and TypeScript
- Korean language is used for user-facing messages and UI text
- The application supports real-time data sync between frontend and backend
- Component-based architecture with strict TypeScript enforcement
- Enhanced error handling with user-friendly messages and developer debugging separation