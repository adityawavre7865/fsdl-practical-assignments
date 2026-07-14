import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import StarRating from './StarRating.jsx';

/**
 * FeedbackCard — displays one feedback entry.
 * Props:
 *   item       - feedback object from API
 *   onDelete   - fn(id) — admin only
 *   onReply    - fn(id, replyText) — faculty only
 *   showReply  - whether to show reply UI
 */
function FeedbackCard({ item, onDelete, onReply, showReply }) {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const date = new Date(item.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  const handleReplySubmit = async (e) => {
    e.preventDefault();
    if (!replyText.trim()) return;
    setSubmitting(true);
    await onReply(item._id, replyText);
    setReplyText('');
    setShowReplyForm(false);
    setSubmitting(false);
  };

  return (
    <div className="feedback-card">
      <div className="feedback-header">
        <div className="feedback-meta">
          <span className="student-name">{item.studentName}</span>
          {item.anonymous && <span className="anon-badge">Anonymous</span>}
        </div>
        <div className="feedback-right">
          <StarRating value={item.rating} readOnly />
          <span className="date">{date}</span>
        </div>
      </div>

      {item.subject && (
        <span className="subject-tag">{item.subject}</span>
      )}

      {item.comment && (
        <p className="comment">{item.comment}</p>
      )}

      {/* Faculty Reply Section */}
      {item.reply && (
        <div className="reply-block">
          <span className="reply-label">Faculty reply</span>
          <p className="reply-text">{item.reply}</p>
          {item.repliedBy && (
            <span className="reply-meta">— {item.repliedBy}</span>
          )}
        </div>
      )}

      {/* Actions */}
      <div className="feedback-actions">
        {showReply && onReply && !item.reply && (
          <button
            className="btn btn-outline btn-sm"
            onClick={() => setShowReplyForm((p) => !p)}
          >
            {showReplyForm ? 'Cancel' : 'Reply'}
          </button>
        )}
        {onDelete && (
          <button
            className="btn btn-danger btn-sm"
            onClick={() => onDelete(item._id)}
          >
            Delete
          </button>
        )}
      </div>

      {/* Animated Reply Form */}
      <AnimatePresence>
        {showReplyForm && (
          <motion.form
            className="reply-form"
            onSubmit={handleReplySubmit}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
          >
            <textarea
              className="reply-input"
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="Write a reply..."
              rows={2}
              required
            />
            <button
              type="submit"
              className="btn btn-primary btn-sm"
              disabled={submitting}
            >
              {submitting ? 'Sending...' : 'Send Reply'}
            </button>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}

export default FeedbackCard;
