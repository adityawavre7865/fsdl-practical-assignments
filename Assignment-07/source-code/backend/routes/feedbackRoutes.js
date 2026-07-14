import express from 'express';
import { db } from '../server.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

// Apply auth middleware to all routes
router.use(verifyToken);

// GET /api/feedback — Get feedback entries
router.get('/', async (req, res) => {
  try {
    const { role, userId } = req.user;
    let query = {};

    // Students can only see their own feedback
    if (role === 'student') {
      query.userId = userId;
    }

    const feedback = await db
      .collection('feedback')
      .find(query)
      .sort({ createdAt: -1 })
      .limit(200)
      .toArray();

    res.json(feedback);
  } catch (error) {
    console.error('GET feedback error:', error);
    res.status(500).json({ error: 'Failed to fetch feedback' });
  }
});

// POST /api/feedback — Submit feedback (students only)
router.post('/', async (req, res) => {
  try {
    const { role } = req.user;

    if (role !== 'student') {
      return res.status(403).json({ error: 'Only students can submit feedback' });
    }

    const { rating, comment, subject, anonymous } = req.body;

    // Validate rating
    if (typeof rating !== 'number' || rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'Rating must be a number between 1 and 5' });
    }

    const feedback = {
      userId: req.user.userId,
      // If anonymous, store name as "Anonymous"
      studentName: anonymous === true ? 'Anonymous' : req.user.name,
      rating: Math.round(rating),
      comment: comment || '',
      subject: subject || '',
      anonymous: anonymous === true,
      createdAt: new Date()
    };

    const result = await db.collection('feedback').insertOne(feedback);

    res.status(201).json({ ok: true, feedbackId: result.insertedId });
  } catch (error) {
    console.error('POST feedback error:', error);
    res.status(500).json({ error: 'Failed to submit feedback' });
  }
});

// PUT /api/feedback/:id/reply — Faculty reply to feedback
router.put('/:id/reply', async (req, res) => {
  try {
    const { role } = req.user;

    if (role !== 'faculty') {
      return res.status(403).json({ error: 'Only faculty can reply to feedback' });
    }

    const { id } = req.params;
    const { reply } = req.body;

    if (!reply || reply.trim() === '') {
      return res.status(400).json({ error: 'Reply text is required' });
    }

    const { ObjectId } = await import('mongodb');

    const result = await db.collection('feedback').updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          reply: reply.trim(),
          repliedAt: new Date(),
          repliedBy: req.user.name
        }
      }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: 'Feedback not found' });
    }

    res.json({ ok: true });
  } catch (error) {
    console.error('PUT reply error:', error);
    res.status(500).json({ error: 'Failed to save reply' });
  }
});

// DELETE /api/feedback/:id — Delete feedback (admin only)
router.delete('/:id', async (req, res) => {
  try {
    const { role } = req.user;

    if (role !== 'admin') {
      return res.status(403).json({ error: 'Only admin can delete feedback' });
    }

    const { id } = req.params;
    const { ObjectId } = await import('mongodb');

    const result = await db
      .collection('feedback')
      .deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Feedback not found' });
    }

    res.json({ ok: true });
  } catch (error) {
    console.error('DELETE feedback error:', error);
    res.status(500).json({ error: 'Failed to delete feedback' });
  }
});

export default router;
