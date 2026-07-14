/**
 * Skeleton loading placeholder for feedback cards.
 * Uses shimmer CSS animation defined in App.css.
 */
function SkeletonCard() {
  return (
    <div className="skeleton-card">
      <div className="skeleton-header">
        <div className="skeleton-line skeleton-name" />
        <div className="skeleton-stars" />
      </div>
      <div className="skeleton-line skeleton-tag" />
      <div className="skeleton-line skeleton-body" />
      <div className="skeleton-line skeleton-body short" />
    </div>
  );
}

export default SkeletonCard;
