# NoteSpace — Full Stack MERN App

A full-featured notes application built with MongoDB, Express, React, and Node.js.

---

## Project Structure

```
notespace/
├── backend/
│   ├── config/
│   │   └── db.js                 # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js     # Register, Login, GetMe
│   │   └── noteController.js     # Full CRUD + pin/trash
│   ├── middleware/
│   │   ├── auth.js               # JWT protect middleware
│   │   └── errorHandler.js       # Global error handler
│   ├── models/
│   │   ├── User.js               # User schema
│   │   └── Note.js               # Note schema
│   ├── routes/
│   │   ├── auth.js               # /api/auth/*
│   │   └── notes.js              # /api/notes/*
│   ├── .env.example
│   ├── package.json
│   └── server.js                 # Express entry point
│
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── DeleteModal.jsx   # Confirmation modal
│   │   │   ├── NoteCard.jsx      # Note grid card
│   │   │   ├── ProtectedRoute.jsx
│   │   │   └── Sidebar.jsx       # Navigation sidebar
│   │   ├── context/
│   │   │   ├── AuthContext.jsx   # Auth state (user, login, logout)
│   │   │   └── NotesContext.jsx  # Notes state + all operations
│   │   ├── pages/
│   │   │   ├── LoginPage.jsx
│   │   │   ├── RegisterPage.jsx
│   │   │   ├── HomePage.jsx      # All Notes / Pinned / Trash
│   │   │   ├── CreateNotePage.jsx
│   │   │   ├── EditNotePage.jsx
│   │   │   └── ViewNotePage.jsx
│   │   ├── utils/
│   │   │   └── api.js            # Axios instance + all API calls
│   │   ├── App.jsx               # Router + providers
│   │   ├── index.js
│   │   └── index.css
│   ├── package.json
│   └── tailwind.config.js
│
└── package.json                  # Root monorepo scripts
```

---

## Database Design

### Users Collection
```js
{
  _id: ObjectId,
  fullName: String,        // required, 2-50 chars
  email: String,           // unique, lowercase
  password: String,        // bcrypt hashed, select: false
  avatar: String,          // optional URL
  createdAt: Date,
  updatedAt: Date
}
```

### Notes Collection
```js
{
  _id: ObjectId,
  user: ObjectId,          // ref: User (indexed)
  title: String,           // required, max 200 chars
  content: String,         // max 50000 chars
  tag: String,             // enum: Personal | Work | Ideas
  isPinned: Boolean,       // default false
  isTrashed: Boolean,      // default false (soft delete)
  trashedAt: Date,         // set when trashed
  createdAt: Date,
  updatedAt: Date
}

// Indexes:
// { user: 1, createdAt: -1 }     — fast user note listing
// { user: 1, isPinned: 1 }       — pinned notes
// { user: 1, isTrashed: 1 }      — trash view
// { title: 'text', content: 'text' } — full-text search
```

---

## API Endpoints

### Auth  `POST /api/auth/*`
| Method | Route | Description | Auth |
|--------|-------|-------------|------|
| POST | /api/auth/register | Create account | No |
| POST | /api/auth/login | Sign in | No |
| GET | /api/auth/me | Get current user | Yes |

### Notes  `* /api/notes/*`
| Method | Route | Description | Auth |
|--------|-------|-------------|------|
| GET | /api/notes | Get all notes (search, tag filter) | Yes |
| GET | /api/notes/pinned | Get pinned notes | Yes |
| GET | /api/notes/trash | Get trashed notes | Yes |
| GET | /api/notes/:id | Get single note | Yes |
| POST | /api/notes | Create note | Yes |
| PUT | /api/notes/:id | Update note | Yes |
| PATCH | /api/notes/:id/pin | Toggle pin | Yes |
| PATCH | /api/notes/:id/trash | Move to trash | Yes |
| PATCH | /api/notes/:id/restore | Restore from trash | Yes |
| DELETE | /api/notes/:id | Permanently delete | Yes |
| DELETE | /api/notes/trash/empty | Empty trash | Yes |

### Query Params (GET /api/notes)
- `?search=keyword` — full-text search
- `?tag=Personal|Work|Ideas` — filter by tag

---

## Authentication Flow

```
1. User submits credentials (register/login)
2. Server validates → returns { token, user }
3. Token stored in localStorage as 'notespace_token'
4. All subsequent API requests include: Authorization: Bearer <token>
5. Axios interceptor auto-attaches token
6. 401 responses → auto-redirect to /login + clear storage
7. On app load → GET /api/auth/me to verify session
```

---

## State Management

- **AuthContext** — user object, login/logout/register functions, loading state
- **NotesContext** — notes array, counts, CRUD ops, active view/tag/search state
- **React Router v6** — page navigation
- **react-hot-toast** — toast notifications
- No Redux needed — Context API is sufficient for this scale

---

## Local Development Setup

### Prerequisites
- Node.js >= 18
- MongoDB running locally (or MongoDB Atlas URI)
- npm or yarn

### 1. Clone and install
```bash
git clone <repo>
cd notespace
npm run install-all
# or:
cd backend && npm install
cd ../frontend && npm install
```

### 2. Configure environment
```bash
cd backend
cp .env.example .env
# Edit .env:
#   MONGODB_URI=mongodb://localhost:27017/notespace
#   JWT_SECRET=your_random_secret_min_32_chars
#   PORT=5000
```

### 3. Run development servers
```bash
# From root (runs both concurrently):
npm run dev

# Or separately:
npm run dev:backend    # http://localhost:5000
npm run dev:frontend   # http://localhost:3000
```

Frontend proxies /api/* to backend via `"proxy": "http://localhost:5000"` in package.json.

---

## Production Deployment

### Option A: Railway / Render (Easiest)

**Backend:**
1. Create new Web Service from GitHub repo
2. Root directory: `backend`
3. Build command: `npm install`
4. Start command: `node server.js`
5. Set environment variables:
   - `MONGODB_URI` — your Atlas connection string
   - `JWT_SECRET` — long random string
   - `NODE_ENV=production`
   - `CLIENT_URL` — your frontend URL

**Frontend:**
1. Create new Static Site
2. Root directory: `frontend`
3. Build command: `npm run build`
4. Publish directory: `build`
5. Set `REACT_APP_API_URL=https://your-backend-url.com/api`

### Option B: VPS / DigitalOcean Droplet

```bash
# 1. Server setup
sudo apt update && sudo apt install -y nodejs npm nginx

# 2. Install PM2
npm install -g pm2

# 3. Backend
cd /var/www/notespace/backend
npm install
pm2 start server.js --name notespace-api
pm2 save && pm2 startup

# 4. Frontend build
cd /var/www/notespace/frontend
npm install
REACT_APP_API_URL=https://api.yourdomain.com/api npm run build

# 5. Nginx config
# /etc/nginx/sites-available/notespace
server {
    listen 80;
    server_name yourdomain.com;

    # Frontend
    root /var/www/notespace/frontend/build;
    index index.html;
    try_files $uri $uri/ /index.html;

    # API proxy
    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}

# 6. SSL with Certbot
sudo certbot --nginx -d yourdomain.com
```

### Option C: Docker

```dockerfile
# backend/Dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 5000
CMD ["node", "server.js"]
```

```yaml
# docker-compose.yml
version: '3.8'
services:
  mongo:
    image: mongo:7
    volumes:
      - mongo_data:/data/db
  
  backend:
    build: ./backend
    ports:
      - "5000:5000"
    environment:
      - MONGODB_URI=mongodb://mongo:27017/notespace
      - JWT_SECRET=${JWT_SECRET}
      - NODE_ENV=production
    depends_on:
      - mongo
  
  frontend:
    build: ./frontend
    ports:
      - "3000:80"
    environment:
      - REACT_APP_API_URL=http://backend:5000/api

volumes:
  mongo_data:
```

---

## Security Checklist

- [x] Passwords hashed with bcrypt (12 rounds)
- [x] JWT tokens with expiry (7d)
- [x] All note routes protected with auth middleware
- [x] User can only access their own notes (user ID check on every query)
- [x] Input validation on all endpoints
- [x] Mongoose sanitization (no raw user input in queries)
- [ ] Rate limiting (add `express-rate-limit`)
- [ ] Helmet.js for HTTP headers
- [ ] HTTPS in production (use Certbot or cloud provider)
- [ ] Environment variables never committed to git

---

## Extending the App

**Ideas for future features:**
- Rich text / markdown editor (use `@uiw/react-md-editor`)
- Note sharing via public link
- Color themes per note
- Image attachments (Cloudinary)
- Note export (PDF/Markdown)
- Reminders / due dates
- Collaborative notes (Socket.io)
