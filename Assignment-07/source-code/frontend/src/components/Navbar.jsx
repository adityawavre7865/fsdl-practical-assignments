import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

// SVG Icons — no emojis
const MoonIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
  </svg>
);
const SunIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="5" />
    <line x1="12" y1="1" x2="12" y2="3" />
    <line x1="12" y1="21" x2="12" y2="23" />
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
    <line x1="1" y1="12" x2="3" y2="12" />
    <line x1="21" y1="12" x2="23" y2="12" />
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
  </svg>
);
const LogoIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
    <path d="M6 12v5c3 3 9 3 12 0v-5" />
  </svg>
);

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Use React state to track theme so component re-renders on toggle
  const [isDark, setIsDark] = useState(
    () => document.documentElement.getAttribute('data-theme') === 'dark'
  );

  // Keep in sync if theme applied externally (e.g., on mount in main.jsx)
  useEffect(() => {
    const current = document.documentElement.getAttribute('data-theme') === 'dark';
    setIsDark(current);
  }, []);

  const toggleTheme = () => {
    const next = isDark ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('fsdl_theme', next);
    setIsDark(!isDark); // drives re-render + icon flip reliably
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const roleBadgeClass = {
    admin: 'badge-admin',
    faculty: 'badge-faculty',
    student: 'badge-student',
  }[user?.role] || '';

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/">
          <LogoIcon />
          Student Feedback
        </Link>
      </div>

      <div className="navbar-right">
        {user && (
          <div className="navbar-user">
            <span className={`role-badge ${roleBadgeClass}`}>{user.role}</span>
            <span className="welcome-msg">{user.name}</span>
          </div>
        )}

        <button
          id="theme-toggle"
          className="icon-btn"
          onClick={toggleTheme}
          aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          title={isDark ? 'Light mode' : 'Dark mode'}
        >
          {isDark ? <SunIcon /> : <MoonIcon />}
        </button>

        {user && (
          <button
            id="logout-btn"
            onClick={handleLogout}
            className="btn btn-secondary btn-sm"
          >
            Logout
          </button>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
