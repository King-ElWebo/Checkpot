export function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={`group relative overflow-hidden rounded-md bg-white shadow-sm transition-transform duration-400 ease-out hover:scale-[1.02] hover:shadow-md ${className}`}
    >
      {children}
    </div>
  );
}
