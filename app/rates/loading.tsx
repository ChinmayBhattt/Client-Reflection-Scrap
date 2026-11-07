export default function RatesLoading() {
  return (
    <div className="py-12 md:py-20 bg-brand-bg min-h-screen">
      <div className="container space-y-12">
        <div className="text-center max-w-xl mx-auto space-y-3">
          <div className="h-6 w-32 bg-gray-200 rounded-full mx-auto animate-pulse" />
          <div className="h-10 w-3/4 bg-gray-200 rounded-2xl mx-auto animate-pulse" />
          <div className="h-4 w-full bg-gray-200 rounded-lg mx-auto animate-pulse" />
        </div>

        {/* Calculator skeleton */}
        <div className="h-48 rounded-3xl bg-gray-200 animate-pulse" />

        {/* Table skeleton */}
        <div className="rounded-3xl border border-brand-border bg-white p-6 space-y-4">
          <div className="h-8 w-48 bg-gray-100 rounded-lg animate-pulse" />
          <div className="space-y-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-12 bg-gray-100 rounded-xl animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

