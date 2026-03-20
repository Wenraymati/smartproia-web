import { SkeletonCard } from "../../components/SkeletonCard";

export default function BotsLoading() {
  return (
    <div>
      <div className="mb-8">
        <div className="h-7 w-40 bg-slate-800 rounded animate-pulse mb-2" />
        <div className="h-4 w-56 bg-slate-800 rounded animate-pulse" />
      </div>
      <div className="space-y-4">
        <div className="bg-slate-900 border border-slate-700 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-2.5 h-2.5 rounded-full bg-slate-700 animate-pulse" />
            <div className="h-5 w-40 bg-slate-700 rounded animate-pulse" />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <SkeletonCard key={i} rows={1} />
            ))}
          </div>
          <SkeletonCard rows={5} />
        </div>
        <div className="bg-slate-900 border border-slate-700 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-2.5 h-2.5 rounded-full bg-slate-700 animate-pulse" />
            <div className="h-5 w-32 bg-slate-700 rounded animate-pulse" />
          </div>
          <SkeletonCard rows={5} />
        </div>
      </div>
    </div>
  );
}
