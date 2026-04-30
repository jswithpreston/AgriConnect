import { Router, Response, Request } from 'express';
import multer from 'multer';
import cloudinary from '../config/cloudinary';
import { supabase } from '../config/supabase';
import { AuthRequest, verifyToken } from '../middleware/auth';

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

interface FilterQuery {
  crop?: string;
  quality?: string;
  district?: string;
  minPrice?: string;
  maxPrice?: string;
  isAvailable?: string;
  sortBy?: 'nearest' | 'price_low' | 'price_high' | 'newest';
}

const formatListing = (listing: any, farmer: any) => ({
  id: listing.id,
  farmerId: listing.farmer_id,
  farmer: {
    id: farmer.id,
    name: farmer.name,
    avatar: farmer.avatar_url,
    rating: farmer.rating,
    isVerified: farmer.is_verified,
    location: {
      lat: farmer.lat,
      lng: farmer.lng,
      district: farmer.district,
    },
  },
  crop: listing.crop,
  variety: listing.variety,
  quantity: listing.quantity,
  unit: listing.unit,
  price: listing.price,
  pricePer: listing.price_per,
  quality: listing.quality,
  harvestDate: listing.harvest_date,
  images: listing.images || [],
  description: listing.description,
  location: {
    lat: listing.lat,
    lng: listing.lng,
    district: listing.district,
    state: listing.state,
  },
  isAvailable: listing.is_available,
  createdAt: listing.created_at,
  views: listing.views,
});

// GET /listings
router.get('/', async (req: Request<any, any, any, FilterQuery>, res: Response) => {
  try {
    const { crop, quality, district, minPrice, maxPrice, isAvailable, sortBy } = req.query;

    let query = supabase
      .from('listings')
      .select('*, users!farmer_id(*)')
      .eq('is_available', isAvailable === 'false' ? false : true);

    if (crop) {
      query = query.or(`crop.ilike.%${crop}%,variety.ilike.%${crop}%`);
    }
    if (quality) {
      query = query.eq('quality', quality);
    }
    if (district) {
      query = query.eq('district', district);
    }
    if (minPrice) {
      query = query.gte('price', parseInt(minPrice));
    }
    if (maxPrice) {
      query = query.lte('price', parseInt(maxPrice));
    }

    if (sortBy === 'price_low') {
      query = query.order('price', { ascending: true });
    } else if (sortBy === 'price_high') {
      query = query.order('price', { ascending: false });
    } else if (sortBy === 'newest') {
      query = query.order('created_at', { ascending: false });
    }

    const { data: listings, error } = await query;

    if (error) throw error;

    const formatted = listings?.map((l) => formatListing(l, l.users)) || [];
    return res.json(formatted);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /listings/:id
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Increment views
    await supabase
      .from('listings')
      .update({ views: supabase.rpc('increment', { x: 1, table: 'listings', column: 'views', row_id: id }) })
      .eq('id', id);

    const { data: listing, error } = await supabase
      .from('listings')
      .select('*, users!farmer_id(*)')
      .eq('id', id)
      .single();

    if (error || !listing) {
      return res.status(404).json({ error: 'Listing not found' });
    }

    return res.json(formatListing(listing, listing.users));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /listings
router.post('/', verifyToken, async (req: AuthRequest, res: Response) => {
  try {
    const { crop, variety, quantity, unit, price, pricePer, quality, harvestDate, description, district } = req.body;

    if (!crop || !quantity || !price || !quality) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const { data: listing, error } = await supabase
      .from('listings')
      .insert([
        {
          farmer_id: req.userId,
          crop,
          variety,
          quantity,
          unit,
          price,
          price_per: pricePer,
          quality,
          harvest_date: harvestDate,
          description,
          district: district || 'Kampala',
          state: 'Uganda',
          lat: 0.3476,
          lng: 32.5825,
          is_available: true,
        },
      ])
      .select('*, users!farmer_id(*)')
      .single();

    if (error) throw error;

    return res.status(201).json(formatListing(listing, listing.users));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PUT /listings/:id
router.put('/:id', verifyToken, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    // Verify ownership
    const { data: listing, error: fetchError } = await supabase
      .from('listings')
      .select('farmer_id')
      .eq('id', id)
      .single();

    if (fetchError || !listing) {
      return res.status(404).json({ error: 'Listing not found' });
    }

    if (listing.farmer_id !== req.userId) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    const updates = req.body;
    const { data: updated, error } = await supabase
      .from('listings')
      .update(updates)
      .eq('id', id)
      .select('*, users!farmer_id(*)')
      .single();

    if (error) throw error;

    return res.json(formatListing(updated, updated.users));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE /listings/:id
router.delete('/:id', verifyToken, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const { data: listing, error: fetchError } = await supabase
      .from('listings')
      .select('farmer_id')
      .eq('id', id)
      .single();

    if (fetchError || !listing) {
      return res.status(404).json({ error: 'Listing not found' });
    }

    if (listing.farmer_id !== req.userId) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    const { error } = await supabase.from('listings').delete().eq('id', id);

    if (error) throw error;

    return res.json({ message: 'Listing deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /listings/farmer/:farmerId
router.get('/farmer/:farmerId', async (req: Request, res: Response) => {
  try {
    const { farmerId } = req.params;

    const { data: listings, error } = await supabase
      .from('listings')
      .select('*, users!farmer_id(*)')
      .eq('farmer_id', farmerId);

    if (error) throw error;

    const formatted = listings?.map((l) => formatListing(l, l.users)) || [];
    return res.json(formatted);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /listings/:id/image
router.post('/:id/image', verifyToken, upload.single('image'), async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    if (!req.file) {
      return res.status(400).json({ error: 'No image provided' });
    }

    // Verify ownership
    const { data: listing, error: fetchError } = await supabase
      .from('listings')
      .select('farmer_id, images')
      .eq('id', id)
      .single();

    if (fetchError || !listing) {
      return res.status(404).json({ error: 'Listing not found' });
    }

    if (listing.farmer_id !== req.userId) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    // Upload to Cloudinary
    const stream = require('stream');
    const uploadStream = cloudinary.uploader.upload_stream(
      { resource_type: 'auto', folder: 'smart-agri-listings' },
      async (error: any, result: any) => {
        if (error) {
          return res.status(500).json({ error: 'Failed to upload image' });
        }

        const images = listing.images || [];
        images.push(result.secure_url);

        const { data: updated, error: updateError } = await supabase
          .from('listings')
          .update({ images })
          .eq('id', id)
          .select('*, users!farmer_id(*)')
          .single();

        if (updateError) {
          return res.status(500).json({ error: 'Failed to update listing' });
        }

        return res.json(formatListing(updated, updated.users));
      }
    );

    stream.Readable.from(req.file.buffer).pipe(uploadStream);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /listings/trending
router.get('/trending', async (req: Request, res: Response) => {
  try {
    const { data: results, error } = await supabase
      .rpc('get_trending_crops');

    if (error) throw error;

    return res.json(results || []);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
