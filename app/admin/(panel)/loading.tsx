import { SkeletonCard } from "../components/SkeletonCard";

export default function AdminLoading() {
  return (
    <div>
      <div className="mb-8">
        <div className="h-7 w-48 bg-slate-800 rounded animate-pulse mb-2" />
        <div className="h-4 w-64 bg-slate-800 rounded animate-pulse" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {Array.from({ length: 6 }).map((_, i) => (
          <SkeletonCard key={i} rows={2} />
        ))}
      </div>
      <SkeletonCard rows={4} />
    </div>
  );
}
