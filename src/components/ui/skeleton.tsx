export function Skeleton() {
  return (
    <div className="page-skeleton" aria-label="Loading page" role="status">
      <div className="skeleton skeleton-title" />
      <div className="skeleton-grid">
        {[0, 1, 2, 3].map((n) => (
          <div key={n} className="skeleton" />
        ))}
      </div>
      <div className="skeleton skeleton-chart" />
      <span className="sr-only">Loading your workspace…</span>
    </div>
  );
}