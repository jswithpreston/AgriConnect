# Backend Setup Guide

Your smart-agri backend is ready to go! Here's everything you need to do to get it running.

## Architecture

```
React Native App (localhost:8081)
       ↓
Express API (localhost:3000) ← You are here
       ↓
Supabase PostgreSQL
Supabase Realtime (live chat)
Cloudinary (image uploads)
```

---

## Step 1: Create Supabase Project (5 minutes)

1. Go to [supabase.com](https://supabase.com) and sign up (free)
2. Click **New Project** → choose region (e.g., "Europe - Dublin") → create
3. Wait for database to start (2-3 min)
4. You now have a PostgreSQL database!

---

## Step 2: Set Up Database Schema (2 minutes)

1. In Supabase dashboard, go to **SQL Editor** (left sidebar)
2. Open a new query
3. Copy the entire contents of `backend/migrations.sql`
4. Paste into the SQL editor
5. Click **Run** (▶️)
6. Done! Tables created:
   - `users`
   - `listings`
   - `conversations`
   - `messages`

**IMPORTANT:** Enable Realtime for live chat:
- Go to **Database → Replication** (left sidebar)
- Find **messages** table
- Toggle the **ON** button

---

## Step 3: Get Supabase API Keys (2 minutes)

1. Go to **Settings → API** (left sidebar)
2. Copy these values:
   - **Project URL** → `SUPABASE_URL`
   - **Service Role** (secret) → `SUPABASE_SERVICE_KEY`
3. Keep these safe! Service role is sensitive.

---

## Step 4: Set Up Cloudinary for Images (Optional, 3 minutes)

1. Go to [cloudinary.com](https://cloudinary.com) and sign up (free tier gives 25GB)
2. In **Dashboard**, find:
   - **Cloud Name** → `CLOUDINARY_CLOUD_NAME`
   - **API Key** → `CLOUDINARY_API_KEY`
3. Click **Settings** (gear) → **Security** → find **API Secret** → `CLOUDINARY_API_SECRET`

If you skip this, image uploads won't work but the app will still function.

---

## Step 5: Configure Backend (.env)

1. Open `backend/.env` (created in project root)
2. Fill in the values:

```env
# From Supabase Settings > API
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_KEY=your-service-role-key-here

# Make up a secure random string (min 32 chars)
JWT_SECRET=my-super-secret-key-at-least-32-characters-long

# From Cloudinary Dashboard (optional)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Port
PORT=3000
NODE_ENV=development
```

**NEVER commit `.env`** — it's in `.gitignore` for security.

---

## Step 6: Configure Frontend (.env)

1. Open `.env` in project root (same level as `App.tsx`)
2. Fill in:

```env
EXPO_PUBLIC_API_URL=http://localhost:3000/api
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-from-supabase
```

The **ANON_KEY** is safe to expose (it's in the mobile app). Get it from **Supabase Settings > API**.

---

## Step 7: Install Backend & Start

```bash
cd backend
npm install
npm run dev
```

You should see:
```
Server running on http://localhost:3000
Health check: http://localhost:3000/health
```

**✅ Backend is live!**

---

## Step 8: Test the API

### Health Check
```bash
curl http://localhost:3000/health
```

Response:
```json
{"status":"ok","timestamp":"2026-04-30T12:00:00Z"}
```

### Create a Test User
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Farmer",
    "phone": "+256700000000",
    "password": "password123",
    "role": "farmer",
    "district": "Kampala"
  }'
```

Response:
```json
{
  "user": {...},
  "token": "eyJhbGciOiJIUzI1NiIs..."
}
```

### Get Listings
```bash
curl http://localhost:3000/api/listings
```

---

## Step 9: Start the App

In another terminal:

```bash
npm start
```

Then:
- Press `i` for iOS simulator
- Or `a` for Android emulator
- Or scan the QR code with Expo app on your phone

The app will now:
- ✅ Load real listings from your backend
- ✅ Create new listings
- ✅ Send and receive messages (live)
- ✅ Upload images to Cloudinary

---

## What's Different from Before?

**Before:** Mock data hardcoded in `src/api/*.ts`
**Now:**
- `src/api/client.ts` → axios client with auto-injected JWT tokens
- `src/api/listings.ts` → calls `backend/src/routes/listings.ts`
- `src/api/users.ts` → calls `backend/src/routes/auth.ts` + `/users`
- `src/api/chat.ts` → calls `backend/src/routes/chat.ts` + Supabase Realtime

---

## Common Issues & Fixes

### Error: "Cannot find module 'express'"
```bash
cd backend && npm install
```

### Error: "EADDRINUSE: address already in use :::3000"
```bash
lsof -i :3000        # find what's using port 3000
kill -9 <PID>        # kill the process
npm run dev          # try again
```

### Error: "Missing SUPABASE_URL"
- Check `.env` file exists in `backend/` directory
- Verify you filled in `SUPABASE_URL` and `SUPABASE_SERVICE_KEY`

### App won't connect to backend
- Make sure backend is running: `npm run dev` in `backend/` folder
- Check `.env` in app root has `EXPO_PUBLIC_API_URL=http://localhost:3000/api`
- If on physical phone: use your computer's IP instead of `localhost`:
  ```
  EXPO_PUBLIC_API_URL=http://192.168.1.100:3000/api
  ```

### Images won't upload
- Cloudinary is optional. If you skip it, image uploads fail silently.
- To enable: fill in Cloudinary credentials in `backend/.env`

---

## Production Deployment

### Using Railway (1 click)

1. Push code to GitHub
2. Go to [railway.app](https://railway.app)
3. Import GitHub repo
4. Add environment variables (same as `.env`)
5. Deploy

### Using Render / Heroku / AWS / GCP

1. Build locally: `npm run build`
2. Deploy `dist/` folder + `package.json`
3. Set environment variables in hosting platform
4. Start with: `npm start`

---

## Next Steps

- [ ] Run `backend/migrations.sql` in Supabase SQL editor
- [ ] Fill in `backend/.env` with Supabase keys
- [ ] Fill in `.env` with API URL and Supabase public key
- [ ] Run `npm install` in `backend/`
- [ ] Run `npm run dev` to start backend
- [ ] Run `npm start` in app directory to start app
- [ ] Test login/register with real backend
- [ ] Create a listing and upload an image
- [ ] Start a chat conversation

---

## File Structure

```
smart-agri/
├── backend/                    # ← The new backend!
│   ├── src/
│   │   ├── config/            # Supabase, Cloudinary config
│   │   ├── middleware/        # JWT auth
│   │   ├── routes/            # API endpoints
│   │   └── index.ts           # Express app
│   ├── package.json
│   ├── tsconfig.json
│   ├── .env                   # YOU FILL THIS IN
│   ├── .env.example           # Template
│   ├── migrations.sql         # Database schema
│   └── README.md
│
├── src/                       # ← Frontend (no changes needed)
│   ├── api/
│   │   ├── client.ts          # ← NEW: axios + JWT injection
│   │   ├── listings.ts        # ← UPDATED: now calls backend
│   │   ├── users.ts           # ← UPDATED: now calls backend
│   │   └── chat.ts            # ← UPDATED: now calls backend
│   ├── screens/
│   ├── hooks/
│   └── ...
│
├── .env                       # YOU FILL THIS IN (frontend config)
└── App.tsx
```

---

## Support

- **Backend won't start?** Check `backend/.env` is filled correctly
- **Frontend can't reach backend?** Check URL in `.env` and firewall
- **Database error?** Verify `migrations.sql` ran without errors in Supabase
- **Image upload fails?** Cloudinary is optional; it won't break the app

All API endpoints are documented in `backend/README.md`.

Good luck! 🚀
