import Link from "next/link";
import { ArrowLeft, Home, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center py-16 px-4 bg-brand-bg">
      <div className="max-w-md w-full text-center space-y-6 bg-white p-8 md:p-10 rounded-3xl border border-brand-border shadow-elevated">
        <div className="h-16 w-16 rounded-2xl bg-brand-blue-light text-brand-blue flex items-center justify-center mx-auto font-black text-2xl">
          404
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-extrabold text-brand-dark">
            Page Not Found
          </h1>
          <p className="text-sm text-brand-muted">
            The page you are looking for does not exist or has been moved.
          </p>
        </div>
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button asChild variant="default" className="w-full sm:w-auto">
            <Link href="/">
              <Home className="h-4 w-4 mr-2" />
              <span>Return Home</span>
            </Link>
          </Button>
          <Button asChild variant="outline" className="w-full sm:w-auto">
            <Link href="/contact">
              <HelpCircle className="h-4 w-4 mr-2" />
              <span>Contact Us</span>
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
