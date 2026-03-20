export function SkeletonCard({ rows = 3 }: { rows?: number }) {
  return (
    <div className="bg-slate-900 border border-slate-700 rounded-xl p-5 animate-pulse">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-2.5 h-2.5 rounded-full bg-slate-700" />
        <div className="h-4 w-32 bg-slate-700 rounded" />
        <div className="ml-auto h-5 w-16 bg-slate-800 rounded-full" />
      </div>
      <div className="space-y-2">
        {Array.from({ length: rows }).map((_, i) => (
          <div
            key={i}
            className="h-3 bg-slate-800 rounded"
            style={{ width: `${70 + (i % 3) * 10}%` }}
          />
        ))}
      </div>
    </div>
  );
}
