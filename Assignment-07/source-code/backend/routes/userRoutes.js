import express from 'express';
import { db } from '../server.js';
import { verifyToken } from '../middleware/auth.js';
import { ObjectId } from 'mongodb';

const router = express.Router();

// All routes require authentication + admin role
router.use(verifyToken);

function requireAdmin(req, res, next) {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
}

// GET /api/users — list all users (exclude password)
router.get('/', requireAdmin, async (req, res) => {
  try {
    const users = await db
      .collection('users')
      .find({}, { projection: { password: 0 } })
      .sort({ createdAt: -1 })
      .toArray();
    res.json(users);
  } catch (error) {
    console.error('GET users error:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// DELETE /api/users/:id — delete user (admin only)
router.delete('/:id', requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db
      .collection('users')
      .deleteOne({ _id: new ObjectId(id) });
    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ ok: true });
  } catch (error) {
    console.error('DELETE user error:', error);
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

export default router;
