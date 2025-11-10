<a href="https://chat.vercel.ai/">
  <h1 align="center">AI Chatbot</h1>
</a>

<p align="center">
    A free, open-source AI chatbot template with a clean separation between frontend (React + Vite) and backend (Express + Prisma).
</p>

<p align="center">
  <a href="#features"><strong>Features</strong></a> ·
  <a href="#project-structure"><strong>Project Structure</strong></a> ·
  <a href="#model-providers"><strong>Model Providers</strong></a> ·
  <a href="#running-locally"><strong>Running Locally</strong></a> ·
  <a href="#deployment"><strong>Deployment</strong></a>
</p>
<br/>

## Features

- **Frontend (React + Vite)**
  - Modern React 18 with TypeScript
  - Fast build times with Vite
  - Client-side routing with React Router
  - Real-time chat interface with streaming support
- **Backend (Express + TypeScript)**
  - RESTful API with Express
  - Type-safe database access with Prisma
  - Authentication with Passport.js
  - Session management
- [AI SDK](https://ai-sdk.dev/docs/introduction)
  - Unified API for generating text, structured objects, and tool calls with LLMs
  - Supports xAI (default), OpenAI, Anthropic, and other model providers
- [shadcn/ui](https://ui.shadcn.com)
  - Styling with [Tailwind CSS](https://tailwindcss.com)
  - Component primitives from [Radix UI](https://radix-ui.com) for accessibility and flexibility
- Data Persistence
  - PostgreSQL with Prisma ORM for saving chat history and user data
  - File upload support

## Project Structure

This repository is organized into separate frontend and backend folders:

```
ai-chatbot/
├── frontend/          # React + Vite application
│   ├── src/          # Source code
│   ├── public/       # Static assets
│   ├── package.json  # Frontend dependencies
│   └── README.md     # Frontend documentation
├── backend/          # Express server
│   ├── src/          # Server source code
│   ├── prisma/       # Database schema
│   ├── package.json  # Backend dependencies
│   └── README.md     # Backend documentation
├── tests/            # End-to-end tests
├── package.json      # Root scripts for running both
└── README.md         # This file
```

## 📚 Documentation

**Quick Start Guides:**
- **[Frontend Structure](FRONTEND_STRUCTURE.md)** - Easy guide to frontend architecture and components
- **[API Endpoints](API_ENDPOINTS.md)** - Simple documentation of all backend API routes

**Detailed Technical Docs:**
- [frontend/README.md](frontend/README.md) - Frontend setup and configuration
- [backend/README.md](backend/README.md) - Backend setup and database management

## Model Providers

This template uses the [Vercel AI Gateway](https://vercel.com/docs/ai-gateway) to access multiple AI models through a unified interface. The default configuration includes [xAI](https://x.ai) models (`grok-2-vision-1212`, `grok-3-mini`) routed through the gateway.

### AI Gateway Authentication

**For Vercel deployments**: Authentication is handled automatically via OIDC tokens.

**For non-Vercel deployments**: You need to provide an AI Gateway API key by setting the `AI_GATEWAY_API_KEY` environment variable in your `.env.local` file.

With the [AI SDK](https://ai-sdk.dev/docs/introduction), you can also switch to direct LLM providers like [OpenAI](https://openai.com), [Anthropic](https://anthropic.com), [Cohere](https://cohere.com/), and [many more](https://ai-sdk.dev/providers/ai-sdk-providers) with just a few lines of code.

## Running Locally

### Prerequisites

- Node.js 18+ installed
- PostgreSQL database
- Package manager: npm, pnpm, or yarn

### Setup

1. Clone the repository:
```bash
git clone https://github.com/your-repo/ai-chatbot.git
cd ai-chatbot
```

2. Install dependencies for all packages:
```bash
npm run install:all
```

Or install manually:
```bash
# Root dependencies (for running both)
npm install

# Frontend dependencies
cd frontend && npm install && cd ..

# Backend dependencies
cd backend && npm install && cd ..
```

3. Set up environment variables:

Copy `.env.example` to `.env.local` and fill in the required values:
```bash
cp .env.example .env.local
```

Required variables:
- `DATABASE_URL` - PostgreSQL connection string
- `AUTH_SECRET` - Secret for session encryption
- `AI_GATEWAY_API_KEY` - For AI model access

4. Set up the database:
```bash
cd backend
npm run db:generate
npm run db:migrate
cd ..
```

5. Start the development servers:
```bash
# Run both frontend and backend
npm run dev
```

Or run them separately:
```bash
# Terminal 1 - Backend
npm run dev:backend

# Terminal 2 - Frontend
npm run dev:frontend
```

The application will be available at:
- Frontend: [http://localhost:3000](http://localhost:3000)
- Backend API: [http://localhost:3001](http://localhost:3001)

## Deployment

### Build for Production

```bash
# Build both frontend and backend
npm run build

# Or build separately
npm run build:frontend
npm run build:backend
```

### Deploy Backend

1. Set up a PostgreSQL database
2. Set environment variables on your hosting platform
3. Run database migrations:
```bash
cd backend && npm run db:migrate
```
4. Start the server:
```bash
npm start
```

### Deploy Frontend

The frontend can be deployed to:
- Vercel
- Netlify
- Any static hosting service

The built files are in `frontend/dist/`.

### Deploy as Monolith

The backend can serve the frontend in production mode. Build both, then start the backend - it will automatically serve the frontend files.

## Available Scripts

From the root directory:

- `npm run dev` - Run both frontend and backend in development mode
- `npm run build` - Build both frontend and backend for production
- `npm start` - Start the production server
- `npm run install:all` - Install dependencies for all packages

See individual README files for more scripts:
- [Frontend Scripts](frontend/README.md#available-scripts)
- [Backend Scripts](backend/README.md#available-scripts)

## License

This project is licensed under the MIT License.
