import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { supabase } from '../config/supabase';
import { generateToken, AuthRequest, verifyToken } from '../middleware/auth';

const router = Router();

interface RegisterBody {
  name: string;
  phone: string;
  password: string;
  role: 'farmer' | 'buyer';
  district: string;
}

interface LoginBody {
  phone: string;
  password: string;
}

// POST /auth/register
router.post('/register', async (req: Request<any, any, RegisterBody>, res: Response) => {
  try {
    const { name, phone, password, role, district } = req.body;

    if (!name || !phone || !password || !role || !district) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Insert into users table
    const { data: user, error } = await supabase
      .from('users')
      .insert([
        {
          name,
          phone,
          password_hash: passwordHash,
          role,
          district,
          state: 'Uganda',
          lat: 0.3476,
          lng: 32.5825,
          address: district,
          rating: 0,
          total_sales: 0,
          is_verified: false,
        },
      ])
      .select('*')
      .single();

    if (error) {
      if (error.code === '23505') {
        return res.status(400).json({ error: 'Phone number already registered' });
      }
      throw error;
    }

    const token = generateToken(user.id);

    return res.json({
      user: {
        id: user.id,
        name: user.name,
        phone: user.phone,
        role: user.role,
        avatar: user.avatar_url,
        location: {
          lat: user.lat,
          lng: user.lng,
          address: user.address,
          district: user.district,
          state: user.state,
        },
        rating: user.rating,
        totalSales: user.total_sales,
        joinedDate: user.joined_date,
        isVerified: user.is_verified,
      },
      token,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /auth/login
router.post('/login', async (req: Request<any, any, LoginBody>, res: Response) => {
  try {
    const { phone, password } = req.body;

    if (!phone || !password) {
      return res.status(400).json({ error: 'Missing phone or password' });
    }

    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('phone', phone)
      .single();

    if (error || !user) {
      return res.status(401).json({ error: 'Invalid phone or password' });
    }

    const passwordMatch = await bcrypt.compare(password, user.password_hash);
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid phone or password' });
    }

    const token = generateToken(user.id);

    return res.json({
      user: {
        id: user.id,
        name: user.name,
        phone: user.phone,
        role: user.role,
        avatar: user.avatar_url,
        location: {
          lat: user.lat,
          lng: user.lng,
          address: user.address,
          district: user.district,
          state: user.state,
        },
        rating: user.rating,
        totalSales: user.total_sales,
        joinedDate: user.joined_date,
        isVerified: user.is_verified,
      },
      token,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /auth/me
router.get('/me', verifyToken, async (req: AuthRequest, res: Response) => {
  try {
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', req.userId)
      .single();

    if (error || !user) {
      return res.status(404).json({ error: 'User not found' });
    }

    return res.json({
      id: user.id,
      name: user.name,
      phone: user.phone,
      role: user.role,
      avatar: user.avatar_url,
      location: {
        lat: user.lat,
        lng: user.lng,
        address: user.address,
        district: user.district,
        state: user.state,
      },
      rating: user.rating,
      totalSales: user.total_sales,
      joinedDate: user.joined_date,
      isVerified: user.is_verified,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
