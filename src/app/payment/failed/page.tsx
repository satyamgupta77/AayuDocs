import { AlertTriangle, RefreshCcw, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function PaymentFailedPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-xl text-center">
        <div className="w-20 h-20 bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 rounded-full flex items-center justify-center mx-auto mb-6">
          <AlertTriangle size={40} />
        </div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">Payment Failed</h1>
        <p className="text-slate-600 dark:text-slate-400 mb-8">
          We were unable to process your payment. Your card has not been charged. Please try again with a different payment method.
        </p>
        <div className="flex flex-col space-y-3">
          <Link href="/pricing" className="w-full">
            <Button className="w-full bg-violet-600 hover:bg-violet-700 text-white shadow-lg h-12 text-lg">
              <RefreshCcw className="mr-2 h-5 w-5" /> Try Again
            </Button>
          </Link>
          <Link href="/dashboard" className="w-full">
            <Button variant="outline" className="w-full h-12 text-lg">
              <Home className="mr-2 h-5 w-5" /> Back to Dashboard
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
