import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import FeedbackCard from '../components/FeedbackCard.jsx';
import StarRating from '../components/StarRating.jsx';
import SkeletonCard from '../components/SkeletonCard.jsx';

const SUBJECTS = [
  'Full Stack Development',
  'Mathematics',
  'Physics',
  'DBMS',
  'Operating Systems',
  'Other',
];

function StudentDashboard() {
  const [feedbackList, setFeedbackList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [subject, setSubject] = useState('Full Stack Development');
  const [anonymous, setAnonymous] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const { token } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    fetchFeedback();
  }, []);

  const fetchFeedback = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:3001/api/feedback', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.status === 401) { navigate('/login'); return; }
      const data = await response.json();
      setFeedbackList(data);
    } catch {
      addToast('Failed to load feedback', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const response = await fetch('http://localhost:3001/api/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ rating, comment, subject, anonymous })
      });

      const data = await response.json();

      if (response.ok) {
        addToast('Feedback submitted successfully!', 'success');
        setRating(5);
        setComment('');
        setSubject('Full Stack Development');
        setAnonymous(false);
        fetchFeedback();
      } else {
        addToast(data.error || 'Failed to submit feedback', 'error');
      }
    } catch {
      addToast('Network error', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <motion.div
      className="page-container"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Feedback Form */}
      <div className="card feedback-form-card">
        <h2 className="section-title">Submit Feedback</h2>
        <p className="section-subtitle">Share your experience with the course</p>

        <form onSubmit={handleSubmit}>
          {/* Subject */}
          <div className="form-group">
            <label htmlFor="student-subject">Subject</label>
            <select
              id="student-subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            >
              {SUBJECTS.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          {/* Star Rating */}
          <div className="form-group">
            <label>Rating</label>
            <StarRating value={rating} onChange={setRating} />
          </div>

          {/* Comment */}
          <div className="form-group">
            <label htmlFor="student-comment">Comment (optional)</label>
            <textarea
              id="student-comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Add your comments…"
              rows={3}
            />
          </div>

          {/* Anonymous Checkbox */}
          <div className="form-group">
            <div className="anon-toggle">
              <input
                type="checkbox"
                id="student-anonymous"
                className="anon-checkbox"
                checked={anonymous}
                onChange={(e) => setAnonymous(e.target.checked)}
              />
              <div className="anon-content">
                <label htmlFor="student-anonymous" className="anon-label">
                  Submit anonymously
                </label>
                <p className="anon-helper">
                  Your name will appear as "Anonymous" to faculty and admin.
                </p>
              </div>
            </div>
          </div>

          <button
            id="submit-feedback-btn"
            type="submit"
            className="btn btn-primary"
            disabled={submitting}
          >
            {submitting ? 'Submitting...' : 'Submit Feedback'}
          </button>
        </form>
      </div>

      {/* Feedback List */}
      <div className="section-header">
        <h3 className="section-title">Your Feedback ({feedbackList.length})</h3>
      </div>

      <AnimatePresence>
        {loading ? (
          [1, 2].map((i) => <SkeletonCard key={i} />)
        ) : feedbackList.length === 0 ? (
          <p className="empty-state">No feedback submitted yet.</p>
        ) : (
          feedbackList.map((item, index) => (
            <motion.div
              key={item._id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: index * 0.05 }}
            >
              <FeedbackCard item={item} />
            </motion.div>
          ))
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default StudentDashboard;
