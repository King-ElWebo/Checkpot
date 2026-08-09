type StatusTone = "ready" | "pending" | "neutral";

type StatusCardProps = {
  title: string;
  value: string;
  detail: string;
  tone?: StatusTone;
};

export function StatusCard({ title, value, detail, tone = "neutral" }: StatusCardProps) {
  return (
    <article className="status-card">
      <div className="status-card-heading">
        <h2>{title}</h2>
        <span className={`status-dot status-dot-${tone}`} aria-hidden="true" />
      </div>
      <strong>{value}</strong>
      <p>{detail}</p>
    </article>
  );
}
