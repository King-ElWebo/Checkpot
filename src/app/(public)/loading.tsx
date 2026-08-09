export default function PublicLoading() {
  return (
    <div className="public-page loading-state" aria-live="polite">
      <div className="container">
        <p className="public-eyebrow">Checkpot Hietzing</p>
        <div className="skeleton skeleton-title" />
        <div className="skeleton skeleton-line" />
        <div className="skeleton skeleton-line short" />
      </div>
    </div>
  );
}
