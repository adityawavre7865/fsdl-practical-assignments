import { useState } from 'react';

/**
 * Interactive star rating component.
 * Props:
 *   value    - current rating (1-5)
 *   onChange - called with new rating
 *   readOnly - if true, purely decorative
 */
function StarRating({ value = 0, onChange, readOnly = false }) {
  const [hovered, setHovered] = useState(0);

  const active = hovered || value;

  return (
    <div
      className="star-rating"
      onMouseLeave={() => !readOnly && setHovered(0)}
      aria-label={`Rating: ${value} out of 5`}
    >
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          className={`star-btn ${star <= active ? 'filled' : ''}`}
          onClick={() => !readOnly && onChange && onChange(star)}
          onMouseEnter={() => !readOnly && setHovered(star)}
          disabled={readOnly}
          aria-label={`${star} star${star !== 1 ? 's' : ''}`}
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill={star <= active ? '#F59E0B' : 'none'}
            stroke={star <= active ? '#F59E0B' : '#9CA3AF'}
            strokeWidth="1.5"
          >
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
        </button>
      ))}
    </div>
  );
}

export default StarRating;
