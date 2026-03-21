export default function CotizarLeadsLoading() {
  return (
    <div>
      <div className="mb-8">
        <div className="h-7 w-52 bg-slate-800 rounded animate-pulse mb-2" />
        <div className="h-4 w-64 bg-slate-800 rounded animate-pulse" />
      </div>
      <div className="grid grid-cols-3 gap-3 mb-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="bg-slate-900 border border-slate-800 rounded-xl p-4 text-center">
            <div className="h-8 w-10 bg-slate-800 rounded animate-pulse mx-auto mb-1" />
            <div className="h-3 w-20 bg-slate-700 rounded animate-pulse mx-auto" />
          </div>
        ))}
      </div>
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="bg-slate-900 border border-slate-800 rounded-xl p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="h-5 w-20 bg-slate-800 rounded-full animate-pulse" />
              <div className="h-4 w-32 bg-slate-800 rounded animate-pulse" />
            </div>
            <div className="grid grid-cols-4 gap-3">
              {Array.from({ length: 4 }).map((_, j) => (
                <div key={j}>
                  <div className="h-3 w-12 bg-slate-800 rounded animate-pulse mb-1" />
                  <div className="h-4 w-20 bg-slate-700 rounded animate-pulse" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
