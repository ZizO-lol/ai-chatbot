# AI Chatbot - Frontend

This is the frontend application for the AI Chatbot, built with React, Vite, and TypeScript.

## Tech Stack

- **React 18** - UI library
- **Vite** - Build tool and dev server
- **TypeScript** - Type safety
- **React Router** - Client-side routing
- **Tailwind CSS** - Styling
- **AI SDK** - AI integration
- **ProseMirror** - Rich text editing
- **CodeMirror** - Code editing
- **Shiki** - Syntax highlighting

## Project Structure

```
frontend/
├── src/              # Main source code (new structure)
│   ├── components/   # React components
│   ├── lib/          # Utilities and helpers
│   ├── hooks/        # Custom React hooks
│   ├── pages/        # Page components
│   ├── App.tsx       # Main app component
│   ├── main.tsx      # Entry point
│   └── globals.css   # Global styles
├── components/       # Root-level components (legacy)
├── lib/              # Root-level utilities (legacy)
├── hooks/            # Root-level hooks (legacy)
├── artifacts/        # Artifact-related components
├── app/              # Next.js app directory (legacy)
├── public/           # Static assets
├── index.html        # HTML entry point
├── vite.config.ts    # Vite configuration
├── tsconfig.json     # TypeScript configuration
└── package.json      # Dependencies and scripts
```

## Getting Started

### Install Dependencies

```bash
npm install
```

### Development

Start the development server:

```bash
npm run dev
```

The app will be available at `http://localhost:3000`.

### Build

Build for production:

```bash
npm run build
```

The built files will be in the `dist/` directory.

### Preview Production Build

```bash
npm run preview
```

## Configuration

### Environment Variables

The frontend uses the following environment variables (configured in the root `.env.local`):

- `VITE_API_URL` - Backend API URL (defaults to `http://localhost:3001`)

### Vite Configuration

The Vite configuration (`vite.config.ts`) includes:
- React plugin for JSX/TSX support
- Path alias `@/` pointing to `./src`
- Development server on port 3000
- Proxy for `/api` requests to the backend

## API Integration

The frontend communicates with the backend through the `/api` proxy configured in Vite. All API requests are automatically forwarded to the backend server.

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run linter
- `npm run format` - Format code
