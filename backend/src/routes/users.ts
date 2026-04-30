import { Router, Response } from 'express';
import { supabase } from '../config/supabase';
import { AuthRequest, verifyToken } from '../middleware/auth';

const router = Router();

const UGANDA_DISTRICTS = [
  'Kampala', 'Wakiso', 'Mukono', 'Jinja', 'Masaka', 'Mbarara', 'Gulu', 'Lira',
  'Fort Portal', 'Kabale', 'Soroti', 'Arua', 'Mbale', 'Entebbe', 'Kasese',
  'Hoima', 'Rukungiri', 'Iganga', 'Bushenyi', 'Kotido',
];

// GET /users/me
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

// PUT /users/me
router.put('/me', verifyToken, async (req: AuthRequest, res: Response) => {
  try {
    const { name, avatar_url, district, address, lat, lng } = req.body;

    const { data: user, error } = await supabase
      .from('users')
      .update({
        ...(name && { name }),
        ...(avatar_url && { avatar_url }),
        ...(district && { district }),
        ...(address && { address }),
        ...(lat && { lat }),
        ...(lng && { lng }),
      })
      .eq('id', req.userId)
      .select('*')
      .single();

    if (error || !user) {
      return res.status(400).json({ error: 'Failed to update user' });
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

// GET /users/districts
router.get('/districts', (req, res) => {
  return res.json(UGANDA_DISTRICTS);
});

export default router;
