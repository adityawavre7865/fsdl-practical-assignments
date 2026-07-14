import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { motion, AnimatePresence } from 'framer-motion';

function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [confirmId, setConfirmId] = useState(null); // ID of user to delete

  const { token } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:3001/api/users', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.status === 401) { navigate('/login'); return; }
      setUsers(await response.json());
    } catch {
      addToast('Failed to load users', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirmId) return;
    try {
      const response = await fetch(`http://localhost:3001/api/users/${confirmId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      if (response.ok) {
        addToast('User deleted', 'success');
        setUsers((prev) => prev.filter((u) => u._id !== confirmId));
      } else {
        addToast(data.error || 'Failed to delete user', 'error');
      }
    } catch {
      addToast('Network error', 'error');
    } finally {
      setConfirmId(null);
    }
  };

  const roleBadge = (role) => ({
    admin: 'badge-admin',
    faculty: 'badge-faculty',
    student: 'badge-student',
  }[role] || '');

  return (
    <div>
      <div className="section-header">
        <h3 className="section-title">User Management ({users.length})</h3>
      </div>

      {loading ? (
        <p className="empty-state">Loading users…</p>
      ) : users.length === 0 ? (
        <p className="empty-state">No users found.</p>
      ) : (
        <div className="table-wrapper">
          <table className="users-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Joined</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id}>
                  <td className="td-name">{u.name}</td>
                  <td className="td-email">{u.email}</td>
                  <td>
                    <span className={`role-badge ${roleBadge(u.role)}`}>{u.role}</span>
                  </td>
                  <td className="td-date">
                    {u.createdAt
                      ? new Date(u.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric', month: 'short', day: 'numeric'
                        })
                      : '—'}
                  </td>
                  <td>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => setConfirmId(u._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Confirm Delete Modal */}
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
              <h3 className="modal-title">Delete User?</h3>
              <p className="modal-body">
                This action is permanent and cannot be undone.
              </p>
              <div className="modal-actions">
                <button
                  className="btn btn-secondary"
                  onClick={() => setConfirmId(null)}
                >
                  Cancel
                </button>
                <button className="btn btn-danger" onClick={handleDelete}>
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default AdminUsers;
