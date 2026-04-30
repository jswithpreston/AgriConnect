# Smart-Agri Backend Setup Checklist

Follow these steps in order to get your app running with a real backend.

---

## ☐ Phase 1: Create Supabase Project (5 min)

- [ ] Go to [supabase.com](https://supabase.com)
- [ ] Click **Sign Up** (Google / GitHub / Email)
- [ ] Click **New Project**
  - Organization: create or select
  - Database Password: save somewhere (you won't need it)
  - Region: choose closest to you (e.g., "Europe - Dublin")
- [ ] Wait for database to initialize (2-3 minutes)
- [ ] You see a green "Connected" message
- [ ] Screenshot or copy the **Project URL** from top-right

---

## ☐ Phase 2: Set Up Database Schema (2 min)

- [ ] In Supabase dashboard, click **SQL Editor** (left sidebar)
- [ ] Click **New Query**
- [ ] Copy **entire contents** of `backend/migrations.sql`
- [ ] Paste into the SQL editor
- [ ] Click **Run** (play button ▶️)
- [ ] You see green ✓ with "Completed successfully"
- [ ] Go to **Table Editor** (left sidebar)
- [ ] Verify you see: `users`, `listings`, `conversations`, `messages` tables

---

## ☐ Phase 3: Enable Realtime for Live Chat (1 min)

- [ ] In Supabase dashboard, click **Database** > **Replication** (left sidebar)
- [ ] Find **messages** table in the list
- [ ] Toggle the **ON** button (switches from gray to blue)
- [ ] Verify it shows "Realtime enabled"
- [ ] This allows live message push notifications

---

## ☐ Phase 4: Get Supabase API Keys (2 min)

- [ ] Click **Settings** (gear icon, bottom left)
- [ ] Click **API** (left sidebar under Settings)
- [ ] Copy these values to a text file:
  - [ ] **Project URL** (under "Project credentials")
      - Looks like: `https://your-project.supabase.co`
      - → Goes to `SUPABASE_URL`
  - [ ] **Service Role** (secret) (under "Project credentials")
      - Looks like: `eyJhbGc...` (very long)
      - → Goes to `SUPABASE_SERVICE_KEY`
  - [ ] **Anon Key** (under "Project credentials")
      - Looks like: `eyJhbGc...` (long but shorter than service role)
      - → Goes to `EXPO_PUBLIC_SUPABASE_ANON_KEY` in frontend `.env`

---

## ☐ Phase 5: Set Up Cloudinary (Optional, 3 min)

**Skip if you don't want image uploads.** App will work without it.

- [ ] Go to [cloudinary.com](https://cloudinary.com)
- [ ] Click **Sign Up**
- [ ] Click **Dashboard** (after signup)
- [ ] In Dashboard section, find:
  - [ ] **Cloud Name** → copy to `CLOUDINARY_CLOUD_NAME`
  - [ ] **API Key** → copy to `CLOUDINARY_API_KEY`
- [ ] Click **Settings** (gear icon, top right)
- [ ] Go to **Security** tab
- [ ] Find **API Secret** → copy to `CLOUDINARY_API_SECRET`

---

## ☐ Phase 6: Configure Backend (.env)

- [ ] Open file: `backend/.env`
- [ ] Fill in these values:

```env
# From Supabase Settings > API (see Phase 4)
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5...

# Make up a long random string (at least 32 characters)
# Example: "my-super-secret-jwt-key-that-is-very-long-and-random-12345"
JWT_SECRET=your-super-secret-key-min-32-chars

# From Cloudinary Dashboard (skip if not using Cloudinary)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Port (leave as-is)
PORT=3000
NODE_ENV=development
```

- [ ] Save file
- [ ] **IMPORTANT:** Never commit `.env` (it's in `.gitignore`)

---

## ☐ Phase 7: Configure Frontend (.env)

- [ ] Open file: `.env` (in project root, same level as `App.tsx`)
- [ ] Fill in these values:

```env
# Backend URL (default for local dev)
EXPO_PUBLIC_API_URL=http://localhost:3000/api

# From Supabase Settings > API (the anon key, not service role)
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5...
```

- [ ] Save file
- [ ] **IMPORTANT:** Never commit `.env`

---

## ☐ Phase 8: Install Backend Dependencies (2 min)

```bash
cd backend
npm install
```

- [ ] Command completes without errors
- [ ] You see ✓ and the prompt returns

---

## ☐ Phase 9: Start Backend (1 min)

**Terminal 1:**
```bash
cd backend
npm run dev
```

- [ ] You see message: `Server running on http://localhost:3000`
- [ ] You see message: `Health check: http://localhost:3000/health`
- [ ] Leave this terminal running

---

## ☐ Phase 10: Test Backend (2 min)

**New terminal (not the one running the backend):**

Test health check:
```bash
curl http://localhost:3000/health
```

- [ ] You see response: `{"status":"ok","timestamp":"..."}`

Test registration:
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","phone":"+256700000000","password":"password123","role":"farmer","district":"Kampala"}'
```

- [ ] You see a response with `"token"` and `"user"` fields
- [ ] No error message

---

## ☐ Phase 11: Start Frontend (1 min)

**Terminal 2 (different from backend terminal):**

```bash
npm start
```

- [ ] You see Expo start message with QR code
- [ ] Press `i` for iOS simulator, `a` for Android, or scan QR code

---

## ☐ Phase 12: Test the App (3 min)

In the app:

- [ ] **Splash screen** appears
- [ ] **Onboarding** shows (skip if already saw it)
- [ ] **Login/Register screen** appears
  - New field: **Password** (wasn't there before!)
- [ ] Click **Register**
  - [ ] Enter name: "Test Farmer"
  - [ ] Enter phone: "+256700000001"
  - [ ] Enter password: "password123"
  - [ ] Select role: "Farmer"
  - [ ] Select district: "Kampala"
  - [ ] Click "Register"
- [ ] **Home screen** loads
  - [ ] Your name "Test Farmer" shows in top-left
  - [ ] Listings load from backend (not mock data anymore!)
  - [ ] You see real "Nearby Listings" section

---

## ☐ Phase 13: Test Listings (2 min)

In the app:

- [ ] On **Home** tab:
  - [ ] Listings appear (from real database)
  - [ ] Tap a listing → "ListingDetail" (not yet built, but no crash)
- [ ] Go to **Listings** tab:
  - [ ] All listings load
  - [ ] Click filter button (funnel icon)
  - [ ] Filter by crop (e.g., "Maize")
  - [ ] Results filter in real-time
- [ ] Go to **Map** tab:
  - [ ] Map shows all listings as pins
  - [ ] Tap a pin → shows details panel at bottom

---

## ✅ You're Done!

Your smart-agri app is now running with:
- ✅ Real Supabase database
- ✅ Real authentication (JWT tokens)
- ✅ Real listings storage
- ✅ Real-time chat (Realtime enabled)
- ✅ Image upload ready (Cloudinary)

---

## 🐛 If Something Breaks

### Backend won't start
```bash
# Check if backend dependencies installed
cd backend && npm install

# Check .env exists and is filled
cat backend/.env

# Check Node is installed
node -v

# Check port 3000 is free
lsof -i :3000
```

### App can't reach backend
- [ ] Verify backend is running (`npm run dev` in `backend/` folder)
- [ ] Verify `.env` has `EXPO_PUBLIC_API_URL=http://localhost:3000/api`
- [ ] On physical phone: use computer IP instead of `localhost`
  - Get your IP: `ipconfig getifaddr en0` (Mac) or `ipconfig` (Windows)
  - Example: `EXPO_PUBLIC_API_URL=http://192.168.1.100:3000/api`

### Database connection error
- [ ] Check Supabase project is created
- [ ] Check `migrations.sql` ran without errors
- [ ] Verify `SUPABASE_URL` and `SUPABASE_SERVICE_KEY` are correct (no spaces, no quotes)

### Login fails
- [ ] Check backend is running
- [ ] Verify you can reach `http://localhost:3000/health`
- [ ] Try registering a new account (don't reuse phone number)

---

## 📞 Need Help?

- **Backend docs:** `backend/README.md`
- **Setup guide:** `BACKEND_SETUP.md`
- **API endpoints:** `backend/README.md` (full reference)
- **Supabase docs:** [supabase.com/docs](https://supabase.com/docs)

---

## 🚀 Next Steps

After everything works:

1. **Deploy backend** to Railway, Render, or Hercel
2. **Update `.env`** in app to point to deployed backend URL
3. **Deploy app** to iOS App Store & Google Play Store
4. **Add real data** — create test listings, test full flow
5. **Optimize** — add more screens (Profile, Create Listing, Chat UI)

Welcome to production! 🎉
