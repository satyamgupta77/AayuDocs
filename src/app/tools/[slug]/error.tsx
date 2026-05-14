"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

export default function ToolError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="container mx-auto px-4 flex flex-col items-center justify-center min-h-[50vh] text-center">
      <div className="h-20 w-20 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mb-6">
        <AlertCircle size={40} />
      </div>
      <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-4">Something went wrong!</h2>
      <p className="text-slate-600 dark:text-slate-400 max-w-md mb-8">
        We encountered an error while loading this tool. Please try again or contact support if the issue persists.
      </p>
      <div className="flex gap-4">
        <Button onClick={() => reset()} className="bg-violet-600 hover:bg-violet-700 text-white">
          Try again
        </Button>
        <Button variant="outline" onClick={() => window.history.back()}>
          Go back
        </Button>
      </div>
    </div>
  );
}
