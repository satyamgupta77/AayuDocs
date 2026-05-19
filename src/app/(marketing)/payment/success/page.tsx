import { CheckCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function PaymentSuccessPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-xl text-center">
        <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle size={40} />
        </div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">Payment Successful!</h1>
        <p className="text-slate-600 dark:text-slate-400 mb-8">
          Thank you for upgrading to AayuDocs Pro. Your subscription is now active and all premium AI features are unlocked.
        </p>
        <Link href="/dashboard">
          <Button className="w-full bg-gradient-to-r from-violet-600 to-blue-600 text-white shadow-lg h-12 text-lg">
            Go to Dashboard <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </Link>
      </div>
    </div>
  );
}
