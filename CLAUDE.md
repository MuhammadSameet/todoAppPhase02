# Frontend - Phase II Todo App

## Technology Stack
- **Framework**: Next.js 16+ (App Router)
- **Language**: TypeScript
- **Package Manager**: npm

## Project Structure
```
frontend/
├── package.json            # Dependencies
├── .env.local              # Environment variables
├── next.config.js          # Next.js configuration
├── tsconfig.json           # TypeScript configuration
└── src/
    ├── app/                # Next.js App Router pages
    │   ├── layout.tsx      # Root layout
    │   ├── page.tsx        # Root page (redirects)
    │   ├── login/
    │   │   └── page.tsx    # Login page
    │   ├── signup/
    │   │   └── page.tsx    # Signup page
    │   └── dashboard/
    │       └── page.tsx    # Dashboard (task management)
    ├── components/         # Reusable React components
    └── lib/
        └── api.ts          # API client for backend communication
```

## Setup Instructions

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create .env.local file:
   ```bash
   cp .env.example .env.local
   ```

3. Configure environment variables:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:8000
   BETTER_AUTH_SECRET=your-secret-key-here
   BETTER_AUTH_URL=http://localhost:3000
   ```

4. Run development server:
   ```bash
   npm run dev
   ```

5. Open browser: http://localhost:3000

## Pages

- `/login` - User login
- `/signup` - User registration
- `/dashboard` - Task management (requires authentication)

## API Client

All API requests include JWT token:
```typescript
Authorization: Bearer <jwt_token>
```

## Constitution Compliance

- ✅ Every function has docstring/comment
- ✅ All API responses are JSON
- ✅ Proper error handling
- ✅ No hardcoded secrets (uses .env.local)
- ✅ JWT authentication on all requests
- ✅ User isolation enforced
