import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 space-y-4">
      <div className="h-12 w-12 rounded-2xl bg-brand-blue-light text-brand-blue flex items-center justify-center animate-pulse">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
      <p className="text-xs font-bold text-brand-muted uppercase tracking-wider">
        Loading Reflection Scrap Solutions...
      </p>
    </div>
  );
}

