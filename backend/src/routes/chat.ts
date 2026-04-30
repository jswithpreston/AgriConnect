import { Router, Response, Request } from 'express';
import { supabase } from '../config/supabase';
import { AuthRequest, verifyToken } from '../middleware/auth';

const router = Router();

// GET /chat/conversations
router.get('/conversations', verifyToken, async (req: AuthRequest, res: Response) => {
  try {
    const { data: conversations, error } = await supabase
      .from('conversations')
      .select(
        `
        id,
        farmer_id,
        buyer_id,
        listing_id,
        created_at,
        updated_at,
        messages(id, text, created_at, sender_id),
        listings(crop, quantity, unit, price, price_per),
        farmer:users!farmer_id(id, name, avatar_url, role),
        buyer:users!buyer_id(id, name, avatar_url, role)
        `
      )
      .or(`farmer_id.eq.${req.userId},buyer_id.eq.${req.userId}`)
      .order('updated_at', { ascending: false });

    if (error) throw error;

    const formatted = conversations?.map((conv: any) => {
      const lastMessage = conv.messages?.[conv.messages.length - 1];
      const listing = conv.listings?.[0];
      const participants = [
        conv.farmer && {
          id: conv.farmer.id,
          name: conv.farmer.name,
          avatar: conv.farmer.avatar_url,
          role: conv.farmer.role,
          isOnline: true,
        },
        conv.buyer && {
          id: conv.buyer.id,
          name: conv.buyer.name,
          avatar: conv.buyer.avatar_url,
          role: conv.buyer.role,
          isOnline: true,
        },
      ].filter(Boolean);

      return {
        id: conv.id,
        participants,
        lastMessage: lastMessage ? {
          text: lastMessage.text,
          timestamp: lastMessage.created_at,
          senderId: lastMessage.sender_id,
        } : null,
        unreadCount: 0,
        listingId: conv.listing_id,
        listing: listing ? {
          crop: listing.crop,
          quantity: `${listing.quantity} ${listing.unit}`,
          price: `UGX ${listing.price.toLocaleString('en-UG')}/${listing.price_per}`,
        } : undefined,
        updatedAt: conv.updated_at,
      };
    }) || [];

    return res.json(formatted);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /chat/conversations/:id/messages
router.get('/conversations/:id/messages', verifyToken, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    // Verify user is a participant
    const { data: conv, error: convError } = await supabase
      .from('conversations')
      .select('farmer_id, buyer_id')
      .eq('id', id)
      .single();

    if (convError || !conv) {
      return res.status(404).json({ error: 'Conversation not found' });
    }

    if (conv.farmer_id !== req.userId && conv.buyer_id !== req.userId) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    const { data: messages, error } = await supabase
      .from('messages')
      .select('*')
      .eq('conversation_id', id)
      .order('created_at', { ascending: true });

    if (error) throw error;

    const formatted = messages?.map((msg) => ({
      id: msg.id,
      conversationId: msg.conversation_id,
      senderId: msg.sender_id,
      text: msg.text,
      timestamp: msg.created_at,
      status: msg.status || 'sent',
    })) || [];

    return res.json(formatted);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /chat/conversations
router.post('/conversations', verifyToken, async (req: AuthRequest, res: Response) => {
  try {
    const { listingId, otherUserId } = req.body;

    if (!otherUserId) {
      return res.status(400).json({ error: 'Missing otherUserId' });
    }

    // Check if conversation already exists
    const { data: existing } = await supabase
      .from('conversations')
      .select('*')
      .or(
        `and(farmer_id.eq.${req.userId},buyer_id.eq.${otherUserId}),and(farmer_id.eq.${otherUserId},buyer_id.eq.${req.userId})`
      )
      .single();

    if (existing) {
      return res.json(existing);
    }

    // Create new conversation
    const { data: conv, error } = await supabase
      .from('conversations')
      .insert([
        {
          farmer_id: req.userId,
          buyer_id: otherUserId,
          listing_id: listingId,
        },
      ])
      .select('*')
      .single();

    if (error) throw error;

    return res.status(201).json(conv);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /chat/messages
router.post('/messages', verifyToken, async (req: AuthRequest, res: Response) => {
  try {
    const { conversationId, text } = req.body;

    if (!conversationId || !text) {
      return res.status(400).json({ error: 'Missing conversationId or text' });
    }

    // Verify user is a participant
    const { data: conv, error: convError } = await supabase
      .from('conversations')
      .select('farmer_id, buyer_id')
      .eq('id', conversationId)
      .single();

    if (convError || !conv) {
      return res.status(404).json({ error: 'Conversation not found' });
    }

    if (conv.farmer_id !== req.userId && conv.buyer_id !== req.userId) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    // Insert message
    const { data: message, error: msgError } = await supabase
      .from('messages')
      .insert([
        {
          conversation_id: conversationId,
          sender_id: req.userId,
          text,
          status: 'sent',
        },
      ])
      .select('*')
      .single();

    if (msgError) throw msgError;

    // Update conversation updated_at
    await supabase
      .from('conversations')
      .update({ updated_at: new Date().toISOString() })
      .eq('id', conversationId);

    const formatted = {
      id: message.id,
      conversationId: message.conversation_id,
      senderId: message.sender_id,
      text: message.text,
      timestamp: message.created_at,
      status: message.status,
    };

    return res.status(201).json(formatted);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
