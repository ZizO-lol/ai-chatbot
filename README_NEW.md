# AI Chatbot - Vite + React + Express

A modern AI chatbot application built with Vite, React, Express, and Prisma.

## Architecture

### Frontend (Vite + React)
- **Framework**: Vite + React 18 + TypeScript
- **Routing**: React Router v6
- **Styling**: Tailwind CSS v4 + shadcn/ui
- **UI Components**: Radix UI primitives
- **State Management**: React hooks + SWR
- **Theme**: next-themes (dark/light mode)

### Backend (Express)
- **Server**: Express.js + TypeScript
- **Authentication**: Passport.js (Local Strategy)
- **Database**: PostgreSQL + Prisma ORM
- **Sessions**: express-session
- **AI**: Vercel AI SDK

## Getting Started

### Prerequisites
- Node.js 18+ and npm/pnpm
- PostgreSQL database
- Redis (for caching, optional)

### Environment Variables
Create a `.env.local` file:

```bash
# Authentication
AUTH_SECRET=your-secret-key-here

# Database
POSTGRES_URL=postgresql://user:password@localhost:5432/dbname

# AI Gateway (if using)
AI_GATEWAY_API_KEY=your-ai-gateway-key

# Redis (optional)
REDIS_URL=redis://localhost:6379

# Server Port (optional, defaults to 3001)
PORT=3001

# Client URL (for CORS in production)
CLIENT_URL=http://localhost:3000
```

### Installation

```bash
# Install dependencies
npm install

# Generate Prisma Client
npm run db:generate

# Run database migrations (if you have an existing database)
npm run db:push

# Or initialize a new database
npm run db:migrate
```

### Development

The application uses two servers in development:

1. **Vite dev server** (frontend) - runs on port 3000
2. **Express server** (backend) - runs on port 3001

```bash
# Start both servers concurrently
npm run dev

# Or start them separately:

# Terminal 1: Start backend
npm run dev:server

# Terminal 2: Start frontend
npm run dev:client
```

Access the application at `http://localhost:3000`

### Building for Production

```bash
# Build both client and server
npm run build

# Start production server
npm start
```

In production, the Express server serves the built React app and handles API requests on the same port.

## Project Structure

```
├── src/                      # Frontend React code
│   ├── components/           # React components
│   │   ├── ui/              # shadcn/ui components
│   │   ├── Link.tsx         # Router Link wrapper
│   │   └── Image.tsx        # Image component
│   ├── lib/                 # Utilities and helpers
│   │   ├── auth.ts          # Auth types and functions
│   │   ├── auth-context.tsx # Auth context provider
│   │   ├── navigation.ts    # Routing hooks
│   │   └── utils.ts         # Utility functions
│   ├── hooks/               # Custom React hooks
│   ├── pages/               # Page components
│   │   ├── LoginPage.tsx
│   │   ├── RegisterPage.tsx
│   │   └── ChatPage.tsx
│   ├── main.tsx             # React entry point
│   ├── App.tsx              # Main app with routing
│   └── globals.css          # Global styles
│
├── server/                   # Backend Express code
│   ├── routes/              # API route handlers
│   │   ├── auth.ts          # Authentication routes
│   │   ├── chat.ts          # Chat endpoints
│   │   ├── document.ts      # Document endpoints
│   │   └── ...
│   ├── middleware/          # Express middleware
│   │   └── auth.ts          # Auth middleware
│   ├── config/              # Configuration
│   │   └── passport.ts      # Passport strategies
│   └── index.ts             # Express server setup
│
├── prisma/                   # Database
│   └── schema.prisma        # Prisma schema
│
├── public/                   # Static assets
├── scripts/                  # Utility scripts
├── index.html               # HTML entry point
├── vite.config.ts           # Vite configuration
├── tsconfig.json            # TypeScript config (client)
└── tsconfig.server.json     # TypeScript config (server)
```

## API Routes

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/logout` - User logout
- `GET /api/auth/guest` - Guest user creation
- `GET /api/auth/me` - Get current user

### Chat
- `POST /api/chat` - Create/send chat message
- `GET /api/chat/:id/stream` - Stream chat responses
- `GET /api/history` - Get chat history

### Documents
- `GET /api/document` - List documents
- `POST /api/document` - Create document
- `PUT /api/document/:id` - Update document
- `DELETE /api/document/:id` - Delete document

### Other
- `POST /api/vote` - Vote on message
- `GET /api/suggestions` - Get suggestions
- `POST /api/files/upload` - Upload file

## Database Schema

Using Prisma ORM with PostgreSQL:

- **User** - User accounts
- **Chat** - Chat conversations
- **Message_v2** - Chat messages (with parts and attachments)
- **Document** - Shared documents
- **Suggestion** - Document edit suggestions
- **Vote_v2** - Message votes
- **Stream** - Resumable stream tracking

## Authentication

Uses Passport.js with local strategy:
- Email/password authentication
- Guest user support (auto-generated email)
- Session-based authentication
- Protected routes via middleware

## Scripts

```bash
# Development
npm run dev              # Start both frontend and backend
npm run dev:client       # Start Vite only
npm run dev:server       # Start Express only

# Building
npm run build            # Build both client and server
npm run build:client     # Build React app only
npm run build:server     # Build Express server only

# Production
npm start                # Run production server

# Database
npm run db:generate      # Generate Prisma Client
npm run db:migrate       # Run migrations
npm run db:studio        # Open Prisma Studio
npm run db:push          # Push schema changes

# Code Quality
npm run lint             # Run linter
npm run format           # Format code

# Testing
npm test                 # Run Playwright tests
```

## Migration from Next.js

This project was migrated from Next.js to Vite + Express. See `MIGRATION_STATUS.md` for details on the migration process and remaining work.

## Technologies

### Frontend
- [Vite](https://vitejs.dev/) - Build tool
- [React 18](https://react.dev/) - UI library
- [React Router](https://reactrouter.com/) - Routing
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [shadcn/ui](https://ui.shadcn.com/) - UI components
- [Framer Motion](https://www.framer.com/motion/) - Animations

### Backend
- [Express](https://expressjs.com/) - Web framework
- [Passport.js](http://www.passportjs.org/) - Authentication
- [Prisma](https://www.prisma.io/) - ORM
- [PostgreSQL](https://www.postgresql.org/) - Database
- [Vercel AI SDK](https://sdk.vercel.ai/) - AI integration

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

See LICENSE file for details.
