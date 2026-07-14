import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import FeedbackCard from '../components/FeedbackCard.jsx';
import SkeletonCard from '../components/SkeletonCard.jsx';
import AdminUsers from './AdminUsers.jsx';

function AdminDashboard() {
  const [feedbackList, setFeedbackList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('feedback'); // 'feedback' | 'users'
  const [confirmId, setConfirmId] = useState(null);

  // Filter/Sort state
  const [search, setSearch] = useState('');
  const [ratingFilter, setRatingFilter] = useState('All');
  const [sortBy, setSortBy] = useState('newest');

  const { token } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (activeTab === 'feedback') fetchFeedback();
  }, [activeTab]);

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

  const confirmDelete = (id) => setConfirmId(id);

  const handleDeleteConfirmed = async () => {
    if (!confirmId) return;
    try {
      const response = await fetch(`http://localhost:3001/api/feedback/${confirmId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      if (response.ok) {
        addToast('Feedback deleted', 'success');
        setFeedbackList((prev) => prev.filter((f) => f._id !== confirmId));
      } else {
        addToast(data.error || 'Failed to delete', 'error');
      }
    } catch {
      addToast('Network error', 'error');
    } finally {
      setConfirmId(null);
    }
  };

  // Derived filtered + sorted feedback
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
  }, [feedbackList, search, ratingFilter, sortBy]);

  // Stats
  const avgRating = feedbackList.length
    ? (feedbackList.reduce((s, f) => s + f.rating, 0) / feedbackList.length).toFixed(1)
    : '—';

  return (
    <motion.div
      className="page-container"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="page-header">
        <h2 className="section-title">Admin Dashboard</h2>
        <p className="section-subtitle">Manage feedback and users</p>
      </div>

      {/* Stats cards */}
      {activeTab === 'feedback' && (
        <div className="stats-row">
          <div className="stat-card">
            <span className="stat-value">{feedbackList.length}</span>
            <span className="stat-label">Total Feedback</span>
          </div>
          <div className="stat-card">
            <span className="stat-value">{avgRating}</span>
            <span className="stat-label">Avg Rating</span>
          </div>
          <div className="stat-card">
            <span className="stat-value">
              {feedbackList.filter((f) => f.rating >= 4).length}
            </span>
            <span className="stat-label">Positive ({'>'}=4★)</span>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="tabs">
        <button
          id="tab-feedback"
          className={`tab-btn ${activeTab === 'feedback' ? 'active' : ''}`}
          onClick={() => setActiveTab('feedback')}
        >
          Feedback
        </button>
        <button
          id="tab-users"
          className={`tab-btn ${activeTab === 'users' ? 'active' : ''}`}
          onClick={() => setActiveTab('users')}
        >
          Users
        </button>
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        {activeTab === 'feedback' && (
          <motion.div
            key="feedback"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {/* Controls */}
            <div className="controls-bar">
              <input
                id="admin-search"
                className="search-input"
                type="text"
                placeholder="Search by name or comment…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <select
                id="admin-rating-filter"
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
                id="admin-sort"
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
                  <FeedbackCard item={item} onDelete={confirmDelete} />
                </motion.div>
              ))
            )}
          </motion.div>
        )}

        {activeTab === 'users' && (
          <motion.div
            key="users"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <AdminUsers />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {confirmId && (
          <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setConfirmId(null)}
          >
            <motion.div
              className="modal-box"
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.85, opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="modal-title">Delete Feedback?</h3>
              <p className="modal-body">
                This will permanently remove this feedback entry. Are you sure?
              </p>
              <div className="modal-actions">
                <button
                  className="btn btn-secondary"
                  onClick={() => setConfirmId(null)}
                >
                  Cancel
                </button>
                <button className="btn btn-danger" onClick={handleDeleteConfirmed}>
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default AdminDashboard;
