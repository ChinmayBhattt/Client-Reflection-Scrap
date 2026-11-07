export default function AdminLoading() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="h-8 w-56 bg-slate-800 rounded-lg animate-pulse" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className="h-28 rounded-2xl bg-slate-950 border border-slate-800 p-5 animate-pulse"
          />
        ))}
      </div>
      <div className="h-72 rounded-2xl bg-slate-950 border border-slate-800 animate-pulse" />
    </div>
  );
}

