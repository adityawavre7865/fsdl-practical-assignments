import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import FeedbackCard from '../components/FeedbackCard.jsx';
import SkeletonCard from '../components/SkeletonCard.jsx';
import { useEffect } from 'react';

const SUBJECTS = [
  'All',
  'Full Stack Development',
  'Mathematics',
  'Physics',
  'DBMS',
  'Operating Systems',
  'Other',
];

/* ── Inline Rating Distribution Bar Chart ─────────────────────
   Pure React/CSS — no external chart library needed.
   Shows a horizontal bar for each star rating (1-5).
───────────────────────────────────────────────────────────── */
function RatingBarChart({ feedbackList }) {
  // Count how many entries have each rating 1–5
  const counts = [1, 2, 3, 4, 5].map((star) => ({
    star,
    count: feedbackList.filter((f) => f.rating === star).length,
  }));
  const max = Math.max(...counts.map((c) => c.count), 1);

  const avgRating = feedbackList.length
    ? (feedbackList.reduce((s, f) => s + f.rating, 0) / feedbackList.length).toFixed(1)
    : null;

  return (
    <div className="analytics-card">
      <div className="analytics-header">
        <div className="analytics-stats">
          <div className="analytics-stat">
            <span className="analytics-val">{feedbackList.length}</span>
            <span className="analytics-lbl">Total Responses</span>
          </div>
          <div className="analytics-divider" />
          <div className="analytics-stat">
            <span className="analytics-val">{avgRating ?? '—'}</span>
            <span className="analytics-lbl">Average Rating</span>
          </div>
          <div className="analytics-divider" />
          <div className="analytics-stat">
            <span className="analytics-val">
              {feedbackList.filter((f) => f.rating >= 4).length}
            </span>
            <span className="analytics-lbl">Positive (4–5 stars)</span>
          </div>
        </div>
      </div>

      <div className="chart-section">
        <p className="chart-title">Rating Distribution</p>
        <div className="chart-bars">
          {[5, 4, 3, 2, 1].map((star) => {
            const count = counts.find((c) => c.star === star)?.count ?? 0;
            const barColor = star >= 4 ? 'var(--primary)' : star === 3 ? '#F59E0B' : 'var(--danger)';
            return (
              <div key={star} className="chart-row">
                <span className="chart-label">{star} star</span>
                <div className="chart-track">
                  <motion.div
                    className="chart-fill"
                    initial={{ width: 0 }}
                    animate={{ width: `${(count / max) * 100}%` }}
                    transition={{ duration: 0.6, delay: (5 - star) * 0.08 }}
                    style={{ background: barColor }}
                  />
                </div>
                <span className="chart-count">{count}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function FacultyDashboard() {
  const [feedbackList, setFeedbackList] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter/Sort state
  const [search, setSearch] = useState('');
  const [subjectFilter, setSubjectFilter] = useState('All');
  const [ratingFilter, setRatingFilter] = useState('All');
  const [sortBy, setSortBy] = useState('newest');

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
      setFeedbackList(await response.json());
    } catch {
      addToast('Failed to load feedback', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleReply = async (id, replyText) => {
    try {
      const response = await fetch(`http://localhost:3001/api/feedback/${id}/reply`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ reply: replyText })
      });
      const data = await response.json();
      if (response.ok) {
        addToast('Reply sent successfully', 'success');
        fetchFeedback();
      } else {
        addToast(data.error || 'Failed to send reply', 'error');
      }
    } catch {
      addToast('Network error', 'error');
    }
  };

  // Derived filtered + sorted list
  const filteredItems = useMemo(() => {
    let result = [...feedbackList];

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (f) =>
          f.studentName.toLowerCase().includes(q) ||
          f.comment?.toLowerCase().includes(q)
      );
    }

    if (subjectFilter !== 'All') {
      result = result.filter((f) => f.subject === subjectFilter);
    }

    if (ratingFilter !== 'All') {
      result = result.filter((f) => f.rating === parseInt(ratingFilter));
    }

    result.sort((a, b) => {
      if (sortBy === 'newest') return new Date(b.createdAt) - new Date(a.createdAt);
      if (sortBy === 'oldest') return new Date(a.createdAt) - new Date(b.createdAt);
      if (sortBy === 'highest') return b.rating - a.rating;
      if (sortBy === 'lowest') return a.rating - b.rating;
      return 0;
    });

    return result;
  }, [feedbackList, search, subjectFilter, ratingFilter, sortBy]);

  return (
    <motion.div
      className="page-container"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="page-header">
        <h2 className="section-title">Faculty Dashboard</h2>
        <p className="section-subtitle">Review and respond to student feedback</p>
      </div>

      {/* Analytics Section */}
      {!loading && feedbackList.length > 0 && (
        <RatingBarChart feedbackList={feedbackList} />
      )}

      {/* Controls */}
      <div className="controls-bar">
        <input
          id="faculty-search"
          className="search-input"
          type="text"
          placeholder="Search by name or comment"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          id="faculty-subject-filter"
          className="filter-select"
          value={subjectFilter}
          onChange={(e) => setSubjectFilter(e.target.value)}
        >
          {SUBJECTS.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
        <select
          id="faculty-rating-filter"
          className="filter-select"
          value={ratingFilter}
          onChange={(e) => setRatingFilter(e.target.value)}
        >
          <option value="All">All Ratings</option>
          {[5, 4, 3, 2, 1].map((r) => (
            <option key={r} value={r}>{r} Star{r !== 1 ? 's' : ''}</option>
          ))}
        </select>
        <select
          id="faculty-sort"
          className="filter-select"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="newest">Newest</option>
          <option value="oldest">Oldest</option>
          <option value="highest">Highest Rated</option>
          <option value="lowest">Lowest Rated</option>
        </select>
      </div>

      <p className="results-count">
        Showing <strong>{filteredItems.length}</strong> of {feedbackList.length} entries
      </p>

      <AnimatePresence>
        {loading ? (
          [1, 2, 3].map((i) => <SkeletonCard key={i} />)
        ) : filteredItems.length === 0 ? (
          <p className="empty-state">No feedback matches your filters.</p>
        ) : (
          filteredItems.map((item, index) => (
            <motion.div
              key={item._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: index * 0.04 }}
            >
              <FeedbackCard
                item={item}
                onReply={handleReply}
                showReply={true}
              />
            </motion.div>
          ))
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default FacultyDashboard;
