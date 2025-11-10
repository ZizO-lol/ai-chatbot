# Next.js to Vite + React + Express Migration - Status Report

## Overview
This migration converts the AI Chatbot application from Next.js to a Vite + React frontend with Express backend, using Prisma instead of Drizzle ORM.

## ✅ Completed Work

### Infrastructure Setup
- ✅ **Vite configuration** - Set up with React plugin and TypeScript
- ✅ **Express server** - Basic server with middleware and route structure
- ✅ **Prisma schema** - Converted from Drizzle ORM schema
- ✅ **Build configuration** - Separate tsconfig for client and server
- ✅ **Package.json** - Updated scripts and dependencies

### Directory Structure
```
/home/runner/work/ai-chatbot/ai-chatbot/
├── src/                    # Frontend code
│   ├── components/         # All UI components (65+ files)
│   ├── lib/               # Utilities and helpers
│   ├── hooks/             # React hooks
│   ├── pages/             # Route pages (Login, Register, Chat)
│   ├── main.tsx           # App entry point
│   ├── App.tsx            # Main app component with routing
│   └── globals.css        # Tailwind styles
├── server/                # Backend code
│   ├── routes/            # API route handlers
│   ├── middleware/        # Auth middleware
│   ├── config/            # Passport configuration
│   └── index.ts           # Express server
├── prisma/                # Database
│   └── schema.prisma      # Prisma schema
├── vite.config.ts         # Vite configuration
└── index.html             # HTML entry point
```

### Compatibility Layer
Created wrapper components and utilities to replace Next.js APIs:

1. **`src/components/Link.tsx`** - Replaces `next/link`
2. **`src/components/Image.tsx`** - Replaces `next/image`
3. **`src/lib/navigation.ts`** - Replaces `next/navigation` hooks
4. **`src/lib/auth.ts`** - Replaces `next-auth` types
5. **`src/lib/auth-context.tsx`** - Authentication provider

### Automated Import Replacement
- ✅ Created `scripts/replace-imports.js` to automate import conversions
- ✅ Converted 65+ component files automatically
- ✅ Removed all "use client" and "use server" directives

### Authentication
- ✅ Express + Passport.js setup
- ✅ Local strategy for email/password auth
- ✅ Guest user support
- ✅ Session management
- ✅ Auth routes: login, register, logout, guest, me

### Frontend Pages
- ✅ LoginPage - User authentication UI
- ✅ RegisterPage - User registration UI
- ✅ ChatPage - Chat interface (placeholder)
- ✅ ProtectedRoute - Route guard component
- ✅ RootLayout - Main layout wrapper

## 🚧 Work In Progress / Remaining

### TypeScript Errors (~40 remaining)
Main categories of errors:

1. **Missing artifact modules** (~8 errors)
   - Need to create: `@/artifacts/code/client`, `@/artifacts/code/server`
   - Need to create: `@/artifacts/text/client`, `@/artifacts/text/server`
   - Need to create: `@/artifacts/image/client`
   - Need to create: `@/artifacts/sheet/client`, `@/artifacts/sheet/server`

2. **Server actions imports** (~5 errors)
   - `@/app/(chat)/actions` - needs to be converted to API calls
   - `@/app/(auth)/auth` - needs auth utility functions

3. **React 18 compatibility** (~3 errors)
   - `useOptimistic` - not in React 18, needs polyfill or removal
   - `useFormStatus` - from React DOM, needs alternative

4. **Drizzle to Prisma migration** (~20 errors)
   - All files in `src/lib/db/` still use Drizzle ORM
   - Need to rewrite queries to use Prisma Client
   - Files: `queries.ts`, `schema.ts`, `utils.ts`, `migrate.ts`

5. **Missing dependencies** (~5 errors)
   - `next/form` - needs replacement or removal
   - `@vercel/functions` - geolocation API replacement needed
   - `bcrypt-ts` - already replaced with `bcrypt`

### API Route Implementation
Current status: **Stub routes only**

Routes to implement:
- `/api/chat` - AI chat streaming endpoint
- `/api/chat/:id/stream` - Resume chat stream
- `/api/document` - Document CRUD operations
- `/api/suggestions` - Suggestion management
- `/api/vote` - Vote on messages
- `/api/history` - Chat history
- `/api/files/upload` - File upload handling

### Database Layer Migration
**Status**: Not started - **CRITICAL PATH**

Files needing conversion from Drizzle to Prisma:
- `src/lib/db/queries.ts` - ~500 lines of database queries
- `src/lib/db/utils.ts` - Database utilities
- `src/lib/db/migrate.ts` - Migration runner

Key changes needed:
```typescript
// OLD (Drizzle)
import { db } from './index';
import { user, chat } from './schema';
const result = await db.select().from(user).where(eq(user.email, email));

// NEW (Prisma)
import { prisma } from '@/server';
const result = await prisma.user.findUnique({ where: { email } });
```

### AI Streaming Infrastructure
**Status**: Not started - **CRITICAL PATH**

The AI chat functionality uses Vercel AI SDK with streaming responses. Needs:
1. Adapt streaming for Express instead of Next.js API routes
2. Handle server-sent events (SSE) properly
3. Maintain resumable streams
4. Port AI tools (create-document, update-document, etc.)

### Testing
**Status**: Not started

- Playwright tests need updating for new URLs
- Authentication flow testing
- API endpoint testing
- Build and deployment testing

## 📊 Effort Estimates

| Category | Estimated Time | Priority | Status |
|----------|---------------|----------|---------|
| Database migration | 2-3 days | HIGH | Not started |
| AI streaming | 1 day | HIGH | Not started |
| Missing artifact modules | 4 hours | MEDIUM | Not started |
| Server actions conversion | 1 day | MEDIUM | Not started |
| TypeScript fixes | 4 hours | MEDIUM | Partial |
| API route implementation | 2 days | HIGH | Stubs only |
| Testing & validation | 1 day | HIGH | Not started |
| Documentation | 2 hours | LOW | Not started |

**Total estimated remaining work: 6-8 days**

## 🎯 Next Steps (Priority Order)

1. **Migrate database queries** (src/lib/db/*)
   - Start with `queries.ts`
   - Update all functions to use Prisma
   - Test each function as you go

2. **Implement chat API endpoint**
   - Port streaming logic from Next.js route
   - Test AI responses work correctly

3. **Create missing artifact modules**
   - Code editor artifact
   - Text editor artifact
   - Image artifact
   - Sheet artifact

4. **Convert server actions to API calls**
   - Create action utility functions
   - Update components to call APIs

5. **Fix remaining TypeScript errors**

6. **Test and validate**

## 📝 Notes

### Dependencies Added
- express, cors, cookie-parser, express-session
- passport, passport-local
- @prisma/client, prisma
- vite, @vitejs/plugin-react
- react-router-dom
- concurrently (for running dev servers)
- bcrypt (replacing bcrypt-ts)

### Dependencies to Remove (After completion)
- next, next-auth, next-themes (keep next-themes for now)
- drizzle-orm, drizzle-kit, postgres
- @vercel/analytics, @vercel/blob, @vercel/functions, @vercel/otel
- server-only

### Known Issues
1. Some components still reference server actions - need API conversion
2. Database layer completely needs rewrite
3. File upload system needs new storage solution
4. Geolocation API needs alternative to Vercel Functions

## 🔗 References
- Original Next.js structure: `app/` directory
- Vite docs: https://vitejs.dev/
- Prisma docs: https://www.prisma.io/
- Express docs: https://expressjs.com/
- Passport.js docs: http://www.passportjs.org/
