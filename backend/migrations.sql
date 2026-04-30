-- Run this entire script in Supabase SQL Editor

-- Create users table
CREATE TABLE IF NOT EXISTS public.users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role TEXT CHECK (role IN ('farmer','buyer')) NOT NULL,
  avatar_url TEXT,
  rating DECIMAL(3,1) DEFAULT 0,
  total_sales INTEGER DEFAULT 0,
  is_verified BOOLEAN DEFAULT false,
  district TEXT,
  state TEXT,
  lat DECIMAL(10,7),
  lng DECIMAL(10,7),
  address TEXT,
  joined_date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create listings table
CREATE TABLE IF NOT EXISTS public.listings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  farmer_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  crop TEXT NOT NULL,
  variety TEXT,
  quantity INTEGER NOT NULL,
  unit TEXT NOT NULL,
  price INTEGER NOT NULL,
  price_per TEXT NOT NULL,
  quality TEXT CHECK (quality IN ('A','B','C')) NOT NULL,
  harvest_date DATE,
  images TEXT[] DEFAULT '{}',
  description TEXT,
  lat DECIMAL(10,7),
  lng DECIMAL(10,7),
  district TEXT,
  state TEXT,
  is_available BOOLEAN DEFAULT true,
  views INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create conversations table
CREATE TABLE IF NOT EXISTS public.conversations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  farmer_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  buyer_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  listing_id UUID REFERENCES public.listings(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create messages table
CREATE TABLE IF NOT EXISTS public.messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  conversation_id UUID REFERENCES public.conversations(id) ON DELETE CASCADE,
  sender_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  text TEXT NOT NULL,
  status TEXT DEFAULT 'sent',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create function for trending crops
CREATE OR REPLACE FUNCTION public.get_trending_crops()
RETURNS TABLE(crop TEXT, count BIGINT)
LANGUAGE sql
STABLE
AS $$
  SELECT crop, COUNT(*)::BIGINT
  FROM public.listings
  WHERE is_available = true
  GROUP BY crop
  ORDER BY count DESC
  LIMIT 5;
$$;

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_listings_farmer_id ON public.listings(farmer_id);
CREATE INDEX IF NOT EXISTS idx_listings_district ON public.listings(district);
CREATE INDEX IF NOT EXISTS idx_listings_crop ON public.listings USING GIN(crop);
CREATE INDEX IF NOT EXISTS idx_listings_created_at ON public.listings(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_conversations_farmer_id ON public.conversations(farmer_id);
CREATE INDEX IF NOT EXISTS idx_conversations_buyer_id ON public.conversations(buyer_id);
CREATE INDEX IF NOT EXISTS idx_conversations_updated_at ON public.conversations(updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_messages_conversation_id ON public.messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON public.messages(created_at);

-- Optional: Enable RLS if you want (for now, we'll keep it permissive for development)
ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.listings DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversations DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages DISABLE ROW LEVEL SECURITY;

-- Enable Realtime on messages table (required for live chat)
-- Go to: Supabase Dashboard > Database > Replication > messages > toggle ON
