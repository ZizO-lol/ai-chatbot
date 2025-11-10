# API Endpoints Guide

A simple guide to all backend API routes in the AI Chatbot.

## 🌐 Base URL

- **Development:** `http://localhost:3001/api`
- **Production:** `https://your-domain.com/api`

All API endpoints are prefixed with `/api`.

---

## 🔐 Authentication Routes (`/api/auth`)

### 1. Register New User
**POST** `/api/auth/register`

Create a new user account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "yourpassword"
}
```

**Response (Success):**
```json
{
  "user": {
    "id": "user123",
    "email": "user@example.com"
  }
}
```

**Response (Error):**
```json
{
  "error": "User already exists"
}
```

---

### 2. Login
**POST** `/api/auth/login`

Log in with email and password.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "yourpassword"
}
```

**Response (Success):**
```json
{
  "user": {
    "id": "user123",
    "email": "user@example.com"
  }
}
```

**Response (Error):**
```json
{
  "error": "Invalid credentials"
}
```

---

### 3. Guest Login
**GET** `/api/auth/guest`

Create and login as a guest user.

**Query Parameters:**
- `redirectUrl` (optional) - URL to redirect after login

**Response:**
Redirects to the specified URL or `/` by default.

---

### 4. Logout
**POST** `/api/auth/logout`

Log out the current user.

**Response (Success):**
```json
{
  "message": "Logged out successfully"
}
```

---

### 5. Get Current User
**GET** `/api/auth/me`

Get information about the currently logged-in user.

**Response (Success):**
```json
{
  "user": {
    "id": "user123",
    "email": "user@example.com"
  }
}
```

**Response (Not Authenticated):**
```json
{
  "error": "Not authenticated"
}
```

---

## 💬 Chat Routes (`/api/chat`)

### 1. Create/Continue Chat
**POST** `/api/chat`

Send a message and get AI response.

**Status:** 🚧 Not yet implemented

**Planned Request Body:**
```json
{
  "message": "What is artificial intelligence?",
  "chatId": "optional-existing-chat-id"
}
```

---

### 2. Stream Chat Response
**GET** `/api/chat/:id/stream`

Get streaming response for a chat.

**Status:** 🚧 Not yet implemented

---

## 📝 Document Routes (`/api/document`)

### 1. Get Documents
**GET** `/api/document`

Retrieve user's documents.

**Status:** 🚧 Not yet implemented

---

### 2. Create/Update Document
**POST** `/api/document`

Create or update a document.

**Status:** 🚧 Not yet implemented

**Planned Request Body:**
```json
{
  "title": "My Document",
  "content": "Document content here",
  "documentId": "optional-for-update"
}
```

---

## 📜 History Routes (`/api/history`)

### 1. Get Chat History
**GET** `/api/history`

Get all chat conversations for the current user.

**Status:** 🚧 Not yet implemented

**Planned Response:**
```json
{
  "chats": [
    {
      "id": "chat123",
      "title": "Conversation about AI",
      "createdAt": "2024-01-15T10:30:00Z",
      "updatedAt": "2024-01-15T11:45:00Z"
    }
  ]
}
```

---

## 👍 Vote Routes (`/api/vote`)

### 1. Vote on Message
**POST** `/api/vote`

Vote (upvote/downvote) on an AI message.

**Status:** 🚧 Not yet implemented

**Planned Request Body:**
```json
{
  "messageId": "msg123",
  "vote": "up" // or "down"
}
```

---

## 💡 Suggestions Routes (`/api/suggestions`)

### 1. Get Suggestions
**GET** `/api/suggestions`

Get conversation starters or suggested prompts.

**Status:** 🚧 Not yet implemented

**Planned Response:**
```json
{
  "suggestions": [
    "How can I improve my code?",
    "Explain quantum computing",
    "Write a poem about nature"
  ]
}
```

---

## 📎 File Routes (`/api/files`)

### 1. Upload File
**POST** `/api/files/upload`

Upload a file (image, document, etc.).

**Status:** 🚧 Not yet implemented

**Request:**
- Content-Type: `multipart/form-data`
- Body: File data

**Planned Response:**
```json
{
  "fileId": "file123",
  "url": "https://storage.example.com/file123.png",
  "filename": "image.png",
  "size": 102400
}
```

---

## 🏥 Health Check

### Ping
**GET** `/ping`

Check if the server is running.

**Response:**
```
pong
```

---

## 🔒 Authentication Requirements

Routes that require authentication:
- ✅ `/api/auth/me` - Get current user
- ✅ `/api/auth/logout` - Logout
- 🚧 `/api/chat/*` - All chat routes (when implemented)
- 🚧 `/api/document/*` - All document routes (when implemented)
- 🚧 `/api/history` - Chat history (when implemented)
- 🚧 `/api/vote` - Voting (when implemented)
- 🚧 `/api/files/*` - File operations (when implemented)

Public routes (no auth needed):
- ✅ `/api/auth/register`
- ✅ `/api/auth/login`
- ✅ `/api/auth/guest`
- ✅ `/ping`

---

## 📊 Response Status Codes

- **200 OK** - Request successful
- **201 Created** - Resource created successfully
- **400 Bad Request** - Invalid request data
- **401 Unauthorized** - Authentication required or failed
- **404 Not Found** - Resource not found
- **500 Internal Server Error** - Server error
- **501 Not Implemented** - Endpoint not yet implemented

---

## 🍪 Session & Cookies

The API uses session-based authentication with cookies:
- Cookies are HTTP-only and secure (in production)
- Session lasts 24 hours
- Sessions are managed by Express Session

---

## 🔄 CORS Configuration

- **Development:** Allows `http://localhost:3000`
- **Production:** Allows frontend URL from `CLIENT_URL` env variable
- Credentials (cookies) are enabled

---

## 📝 Example Usage

### Using Fetch API

```javascript
// Login
const response = await fetch('http://localhost:3001/api/auth/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  credentials: 'include', // Important for cookies
  body: JSON.stringify({
    email: 'user@example.com',
    password: 'password123'
  })
});

const data = await response.json();
console.log(data.user);
```

### Using Axios

```javascript
import axios from 'axios';

// Create axios instance with credentials
const api = axios.create({
  baseURL: 'http://localhost:3001/api',
  withCredentials: true
});

// Login
const { data } = await api.post('/auth/login', {
  email: 'user@example.com',
  password: 'password123'
});

console.log(data.user);
```

---

## 🚀 Quick Testing

Test the API with curl:

```bash
# Health check
curl http://localhost:3001/ping

# Register
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123"}'

# Login
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -c cookies.txt \
  -d '{"email":"test@example.com","password":"test123"}'

# Get current user (using saved cookies)
curl http://localhost:3001/api/auth/me -b cookies.txt
```

---

## 📚 Legend

- ✅ **Implemented** - Route is fully functional
- 🚧 **Not Implemented** - Route exists but returns 501 status

For more technical details, see [backend/README.md](backend/README.md)
