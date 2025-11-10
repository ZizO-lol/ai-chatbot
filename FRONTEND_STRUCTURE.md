# Frontend Structure Guide

A simple guide to understand the frontend architecture of the AI Chatbot.

## 📁 Main Directories

```
frontend/src/
├── components/     # All UI components
├── pages/          # Page-level components (routes)
├── hooks/          # Reusable React hooks
├── lib/            # Utilities and helper functions
├── artifacts/      # Special artifact components (code, images, etc.)
├── App.tsx         # Main app with routing
└── main.tsx        # App entry point
```

## 🎨 Components (`/src/components/`)

The building blocks of the UI, organized by purpose:

### Core Chat Components
- **`chat.tsx`** - Main chat interface
- **`message.tsx`** - Individual chat message display
- **`messages.tsx`** - List of all messages
- **`multimodal-input.tsx`** - Input box for text, files, and images

### Sidebar Components
- **`app-sidebar.tsx`** - Main sidebar layout
- **`sidebar-history.tsx`** - Chat history list
- **`sidebar-history-item.tsx`** - Single chat history item
- **`sidebar-user-nav.tsx`** - User menu and navigation

### Authentication Components
- **`auth-form.tsx`** - Login/register form
- **`ProtectedRoute.tsx`** - Protects routes that need auth
- **`sign-out-form.tsx`** - Logout button

### Artifact Components
- **`artifact.tsx`** - Main artifact viewer
- **`code-editor.tsx`** - Code editing interface
- **`text-editor.tsx`** - Rich text editing
- **`sheet-editor.tsx`** - Spreadsheet editing
- **`image-editor.tsx`** - Image editing tools

### UI Elements (`/components/ui/`)
- Pre-built UI components from shadcn/ui
- Buttons, dialogs, dropdowns, cards, etc.

## 📄 Pages (`/src/pages/`)

Main application pages (routes):

- **`ChatPage.tsx`** - Main chat interface (`/` and `/chat/:id`)
- **`LoginPage.tsx`** - User login screen (`/login`)
- **`RegisterPage.tsx`** - User registration (`/register`)

## 🪝 Hooks (`/src/hooks/`)

Custom React hooks for reusable logic:

- **`use-artifact.ts`** - Manage artifact state
- **`use-auto-resume.ts`** - Auto-resume interrupted chats
- **`use-chat-visibility.ts`** - Control chat visibility settings
- **`use-messages.tsx`** - Handle message state
- **`use-scroll-to-bottom.tsx`** - Auto-scroll to latest message
- **`use-mobile.ts`** - Detect mobile devices

## 🛠️ Lib (`/src/lib/`)

Utilities and helper functions:

```
lib/
├── ai/              # AI-related utilities
│   └── tools/       # AI tool definitions
├── artifacts/       # Artifact helpers
├── editor/          # Editor utilities
└── auth-context.tsx # Authentication state management
```

## 🎭 Artifacts (`/src/artifacts/`)

Special components for different content types:

```
artifacts/
├── code/    # Code artifact components
├── text/    # Text document components
├── image/   # Image artifact components
└── sheet/   # Spreadsheet components
```

## 🔄 How It Works

### 1. **Routing Flow**
```
User visits URL
    ↓
App.tsx (routes)
    ↓
ProtectedRoute (checks auth)
    ↓
RootLayout (sidebar + content)
    ↓
Page Component (ChatPage, etc.)
```

### 2. **Chat Flow**
```
User types message
    ↓
multimodal-input.tsx (captures input)
    ↓
API call to backend
    ↓
messages.tsx (displays messages)
    ↓
message.tsx (individual message)
```

### 3. **Authentication Flow**
```
User lands on app
    ↓
AuthProvider checks login status
    ↓
If not logged in → redirect to /login
    ↓
After login → redirect to /
```

## 🎨 Styling

- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - Pre-built accessible components
- **Theme Provider** - Dark/light mode support

## 🔧 Key Technologies

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Fast build tool
- **React Router** - Client-side routing
- **AI SDK** - AI model integration

## 📦 Important Files

- **`App.tsx`** - Main app component with routes
- **`main.tsx`** - Entry point that renders the app
- **`globals.css`** - Global styles and Tailwind config
- **`vite.config.ts`** - Vite build configuration

## 🚀 Quick Start

1. Install dependencies: `npm install`
2. Start dev server: `npm run dev`
3. Open: `http://localhost:3000`

For more details, see [frontend/README.md](frontend/README.md)
