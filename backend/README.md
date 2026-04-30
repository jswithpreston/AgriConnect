# Smart-Agri Backend

Express.js REST API powered by Supabase (PostgreSQL), Cloudinary (image uploads), and Supabase Realtime (live chat).

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Set Up Supabase

1. Create a free account at [supabase.com](https://supabase.com)
2. Create a new project
3. In the SQL editor, run the entire script from `migrations.sql`:
   ```sql
   -- Copy all SQL from migrations.sql and run it here
   ```
4. In **Database > Replication**, enable Realtime for the `messages` table (toggle ON)
5. Get your keys:
   - **SUPABASE_URL**: Settings > API > Project URL
   - **SUPABASE_SERVICE_KEY**: Settings > API > Service Role (secret)

### 3. Set Up Cloudinary (Optional, for image uploads)

1. Sign up at [cloudinary.com](https://cloudinary.com)
2. Go to Dashboard and copy:
   - **CLOUDINARY_CLOUD_NAME**
   - **CLOUDINARY_API_KEY**
   - **CLOUDINARY_API_SECRET**

### 4. Configure Environment

Copy `.env.example` to `.env` and fill in:
```bash
cp .env.example .env
```

Then edit `.env`:
```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_KEY=your-service-role-key
JWT_SECRET=your-super-secret-key-min-32-chars-recommended
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
PORT=3000
```

### 5. Start the Server

**Development (with auto-reload):**
```bash
npm run dev
```

**Production:**
```bash
npm run build && npm start
```

Server runs on `http://localhost:3000`

### 6. Health Check

```bash
curl http://localhost:3000/health
```

Response:
```json
{"status": "ok", "timestamp": "2026-04-30T12:00:00Z"}
```

---

## API Endpoints

### Authentication

| Method | Endpoint | Body | Auth | Description |
|--------|----------|------|------|-------------|
| POST | `/api/auth/register` | `{ name, phone, password, role, district }` | No | Create new user |
| POST | `/api/auth/login` | `{ phone, password, role }` | No | Get JWT token |
| GET | `/api/auth/me` | — | Yes | Current user profile |

### Users

| Method | Endpoint | Body | Auth | Description |
|--------|----------|------|------|-------------|
| GET | `/api/users/me` | — | Yes | Current user |
| PUT | `/api/users/me` | `{ name, avatar_url, ... }` | Yes | Update profile |
| GET | `/api/users/districts` | — | No | List Uganda districts |

### Listings

| Method | Endpoint | Params | Auth | Description |
|--------|----------|--------|------|-------------|
| GET | `/api/listings` | `crop, quality, district, minPrice, maxPrice, sortBy` | No | All listings with filters |
| GET | `/api/listings/:id` | — | No | Single listing (increments views) |
| POST | `/api/listings` | `{ crop, variety, quantity, unit, price, pricePer, quality, ... }` | Yes | Create listing |
| PUT | `/api/listings/:id` | `{ isAvailable, ... }` | Yes | Update listing (own only) |
| DELETE | `/api/listings/:id` | — | Yes | Delete listing (own only) |
| GET | `/api/listings/farmer/:farmerId` | — | No | All listings by farmer |
| POST | `/api/listings/:id/image` | multipart file `image` | Yes | Upload image to Cloudinary |
| GET | `/api/listings/trending` | — | No | Top 5 crops by count |

### Chat

| Method | Endpoint | Body | Auth | Description |
|--------|----------|------|------|-------------|
| GET | `/api/chat/conversations` | — | Yes | User's conversations |
| GET | `/api/chat/conversations/:id/messages` | — | Yes | Messages in conversation |
| POST | `/api/chat/conversations` | `{ listingId, otherUserId }` | Yes | Create/get conversation |
| POST | `/api/chat/messages` | `{ conversationId, text }` | Yes | Send message (triggers Realtime) |

---

## Authentication

All authenticated requests require an `Authorization` header:
```
Authorization: Bearer <token>
```

Tokens are valid for 30 days.

---

## Frontend Integration

The React Native app connects to this backend via `src/api/client.ts`:
```ts
export const apiClient = axios.create({
  baseURL: 'http://localhost:3000/api',
});
```

Environment variables (in app `.env`):
```
EXPO_PUBLIC_API_URL=http://localhost:3000/api
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

---

## Live Chat (Supabase Realtime)

Messages are broadcast in real-time via Supabase Realtime. The frontend subscribes with:
```ts
supabase
  .channel(`messages:${conversationId}`)
  .on('postgres_changes', { event: 'INSERT', ... })
  .subscribe();
```

No additional WebSocket server needed — Supabase handles it.

---

## Database Schema

See `migrations.sql` for the complete schema. Tables:
- `users` — farmers and buyers
- `listings` — crop listings
- `conversations` — buyer-seller chats
- `messages` — individual chat messages

Indexes are created for performance on common queries (farmer_id, district, created_at, etc.).

---

## Deployment

### Railway (Recommended)

1. Push code to GitHub
2. Connect repo to [railway.app](https://railway.app)
3. Add environment variables
4. Deploy

Railway auto-detects Node.js and runs `npm start`.

### Other Platforms

Any Node.js host (Render, Heroku, AWS, GCP, etc.) works. Just set environment variables and run `npm start`.

---

## Troubleshooting

**Port already in use:**
```bash
lsof -i :3000  # find process
kill -9 <PID>  # kill it
```

**Supabase connection error:**
- Check SUPABASE_URL and SUPABASE_SERVICE_KEY
- Ensure database tables exist (run migrations.sql)

**Image upload fails:**
- Verify Cloudinary credentials
- Check file size < 50MB

**Auth token invalid:**
- Tokens expire after 30 days
- Client must re-login for new token
- Check JWT_SECRET is same on all server instances

---

## Development

- **TypeScript**: `src/` is fully typed
- **Middleware**: Auth token verification in `src/middleware/auth.ts`
- **Config**: Supabase & Cloudinary in `src/config/`
- **Routes**: Organized by feature in `src/routes/`

---

## License

MIT
