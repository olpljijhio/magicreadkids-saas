export function Badge({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold
      bg-white/70 text-gray-700 shadow-sm ring-1 ring-black/5 ${className}`}>
      {children}
    </span>
  );
}