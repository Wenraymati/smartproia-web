export default function FunnelLoading() {
  return (
    <div>
      <div className="mb-8">
        <div className="h-7 w-52 bg-slate-800 rounded animate-pulse mb-2" />
        <div className="h-4 w-64 bg-slate-800 rounded animate-pulse" />
      </div>

      {/* Landing section skeleton */}
      <section className="mb-8">
        <div className="h-3 w-24 bg-slate-800 rounded animate-pulse mb-3" />
        <div className="grid sm:grid-cols-2 gap-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex items-center gap-4">
              <div className="w-8 h-8 bg-slate-800 rounded animate-pulse shrink-0" />
              <div className="flex-1">
                <div className="h-4 w-32 bg-slate-800 rounded animate-pulse mb-1" />
                <div className="h-3 w-24 bg-slate-700 rounded animate-pulse" />
              </div>
              <div className="text-right shrink-0">
                <div className="h-6 w-10 bg-slate-800 rounded animate-pulse mb-1" />
                <div className="h-3 w-12 bg-slate-700 rounded animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Funnel steps skeleton */}
      <section className="mb-8">
        <div className="h-3 w-32 bg-slate-800 rounded animate-pulse mb-3" />
        <div className="space-y-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-slate-900 border border-slate-800 rounded-xl p-4">
              <div className="flex items-center justify-between gap-4 mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-slate-800 rounded animate-pulse" />
                  <div>
                    <div className="h-4 w-36 bg-slate-800 rounded animate-pulse mb-1" />
                    <div className="h-3 w-28 bg-slate-700 rounded animate-pulse" />
                  </div>
                </div>
                <div className="flex gap-5">
                  <div className="h-5 w-8 bg-slate-800 rounded animate-pulse" />
                  <div className="h-5 w-8 bg-slate-800 rounded animate-pulse" />
                  <div className="h-5 w-10 bg-slate-800 rounded animate-pulse" />
                </div>
              </div>
              <div className="h-1.5 bg-slate-800 rounded-full" />
            </div>
          ))}
        </div>
      </section>

      {/* Summary skeleton */}
      <div className="bg-slate-900 border border-slate-700 rounded-xl p-5">
        <div className="h-3 w-28 bg-slate-800 rounded animate-pulse mb-4" />
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="text-center">
              <div className="h-8 w-12 bg-slate-800 rounded animate-pulse mx-auto mb-1" />
              <div className="h-3 w-20 bg-slate-700 rounded animate-pulse mx-auto" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
