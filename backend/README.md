# AI Chatbot - Backend

This is the backend server for the AI Chatbot, built with Express, Prisma, and TypeScript.

## Tech Stack

- **Express** - Web framework
- **TypeScript** - Type safety
- **Prisma** - ORM for database access
- **Passport** - Authentication
- **AI SDK** - AI model integration
- **Redis** - Session storage (optional)
- **PostgreSQL** - Database (via Prisma)

## Project Structure

```
backend/
├── src/
│   ├── routes/           # API route handlers
│   │   ├── auth.ts       # Authentication routes
│   │   ├── chat.ts       # Chat routes
│   │   ├── document.ts   # Document routes
│   │   ├── vote.ts       # Vote routes
│   │   ├── suggestions.ts # Suggestions routes
│   │   ├── history.ts    # History routes
│   │   └── files.ts      # File upload routes
│   ├── middleware/       # Express middleware
│   │   └── auth.ts       # Authentication middleware
│   ├── config/           # Configuration
│   │   └── passport.ts   # Passport configuration
│   └── index.ts          # Server entry point
├── prisma/
│   └── schema.prisma     # Database schema
├── tsconfig.json         # TypeScript configuration
└── package.json          # Dependencies and scripts
```

## Getting Started

### Prerequisites

- Node.js 18+ installed
- PostgreSQL database
- (Optional) Redis for session storage

### Install Dependencies

```bash
npm install
```

### Database Setup

1. Configure your database connection in `.env.local`:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/ai_chatbot"
```

2. Generate Prisma client:
```bash
npm run db:generate
```

3. Run migrations:
```bash
npm run db:migrate
```

### Development

Start the development server:

```bash
npm run dev
```

The server will run on `http://localhost:3001`.

### Build

Build for production:

```bash
npm run build
```

The compiled JavaScript will be in the `dist/` directory.

### Production

Start the production server:

```bash
npm start
```

## Configuration

### Environment Variables

Required environment variables (in root `.env.local`):

- `DATABASE_URL` - PostgreSQL connection string
- `AUTH_SECRET` - Secret for session encryption
- `PORT` - Server port (default: 3001)
- `NODE_ENV` - Environment (development/production)
- `CLIENT_URL` - Frontend URL for CORS

AI Provider Configuration (choose one):
- `AI_GATEWAY_API_KEY` - For AI Gateway access
- Or specific provider keys (OpenAI, Anthropic, etc.)

### API Routes

All API routes are prefixed with `/api`:

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user
- `POST /api/chat` - Create/continue chat
- `GET /api/history` - Get chat history
- `POST /api/vote` - Vote on messages
- `GET /api/suggestions` - Get suggestions
- `POST /api/document` - Document operations
- `POST /api/files` - File upload

### Database Management

- `npm run db:generate` - Generate Prisma client
- `npm run db:migrate` - Run database migrations
- `npm run db:studio` - Open Prisma Studio
- `npm run db:push` - Push schema to database
- `npm run db:pull` - Pull schema from database

## Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Compile TypeScript to JavaScript
- `npm start` - Run production server
- `npm run db:generate` - Generate Prisma client
- `npm run db:migrate` - Run database migrations
- `npm run db:studio` - Open Prisma Studio
- `npm run db:push` - Push schema changes
- `npm run db:pull` - Pull schema from database

## Production Deployment

1. Build the application:
```bash
npm run build
```

2. Set environment variables on your server

3. Run migrations:
```bash
npm run db:migrate
```

4. Start the server:
```bash
npm start
```

## Static File Serving

In production mode, the backend serves the built frontend files from `../frontend/dist/`.
