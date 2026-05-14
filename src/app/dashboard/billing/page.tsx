import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import prisma from "@/lib/db";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { CheckCircle, AlertCircle, CreditCard, Clock } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";

export default async function BillingDashboard() {
  const { userId } = await auth();
  if (!userId) {
    redirect("/sign-in");
  }

  const dbUser = await prisma.user.findUnique({
    where: { clerkId: userId },
    include: { subscription: true }
  });

  const subscription = dbUser?.subscription;
  const isPro = subscription?.status === "ACTIVE" && subscription.plan.startsWith("PRO");

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Billing & Subscription</h1>
        <p className="text-slate-500 dark:text-slate-400">Manage your plan, payment methods, and billing history.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <div className="md:col-span-2 space-y-6">
          <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <CardHeader className="pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="text-xl">Current Plan</CardTitle>
                  <CardDescription className="mt-1">
                    You are currently on the <strong className="text-slate-900 dark:text-white">{isPro ? 'Pro' : 'Free'}</strong> plan.
                  </CardDescription>
                </div>
                {isPro ? (
                  <span className="flex items-center text-sm font-medium text-emerald-600 bg-emerald-100 dark:bg-emerald-900/30 px-3 py-1 rounded-full">
                    <CheckCircle size={14} className="mr-1.5" /> Active
                  </span>
                ) : (
                  <span className="flex items-center text-sm font-medium text-slate-600 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full">
                    Free
                  </span>
                )}
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              {isPro ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-slate-500">Plan Type</p>
                      <p className="font-medium text-slate-900 dark:text-white">
                        {subscription.plan === 'PRO_YEARLY' ? 'AayuDocs Pro (Yearly)' : 'AayuDocs Pro (Monthly)'}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-500">Next Billing Date</p>
                      <p className="font-medium text-slate-900 dark:text-white">
                        {subscription.currentPeriodEnd ? format(new Date(subscription.currentPeriodEnd), 'MMMM d, yyyy') : '-'}
                      </p>
                    </div>
                  </div>
                  <div className="pt-4 flex gap-3">
                    <Button variant="outline" className="border-rose-200 text-rose-600 hover:bg-rose-50 hover:text-rose-700 dark:border-rose-900/50 dark:hover:bg-rose-900/20">
                      Cancel Subscription
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="flex items-start space-x-3 text-slate-600 dark:text-slate-400">
                    <AlertCircle className="text-amber-500 mt-0.5 shrink-0" size={18} />
                    <p className="text-sm">
                      You are limited to 3 documents per day and no access to AI features. Upgrade to unlock the full potential of AayuDocs.
                    </p>
                  </div>
                  <Link href="/pricing">
                    <Button className="bg-gradient-to-r from-violet-600 to-blue-600 text-white border-0 shadow-md">
                      Upgrade to Pro
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">Payment Methods</CardTitle>
            </CardHeader>
            <CardContent>
              {isPro ? (
                <div className="flex items-center justify-between p-4 border border-slate-200 dark:border-slate-700 rounded-xl">
                  <div className="flex items-center space-x-3">
                    <CreditCard className="text-slate-400" />
                    <div>
                      <p className="text-sm font-medium text-slate-900 dark:text-white">Linked via Razorpay</p>
                      <p className="text-xs text-slate-500">Used for recurring billing</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" className="text-violet-600">Update</Button>
                </div>
              ) : (
                <p className="text-sm text-slate-500">No payment methods linked. Upgrade to Pro to add a payment method.</p>
              )}
            </CardContent>
          </Card>
        </div>

        <div>
          <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">Billing History</CardTitle>
            </CardHeader>
            <CardContent>
              {isPro ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex justify-between items-center text-sm border-b border-slate-100 dark:border-slate-800 pb-3 last:border-0 last:pb-0">
                      <div>
                        <p className="font-medium text-slate-900 dark:text-white">Pro Plan {subscription.plan === 'PRO_YEARLY' ? '(Yearly)' : '(Monthly)'}</p>
                        <p className="text-xs text-slate-500 flex items-center mt-0.5">
                          <Clock size={10} className="mr-1" />
                          {format(new Date(new Date().setMonth(new Date().getMonth() - i + 1)), 'MMM d, yyyy')}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-slate-900 dark:text-white">
                          ₹{subscription.plan === 'PRO_YEARLY' ? '3999' : '399'}
                        </p>
                        <a href="#" className="text-xs text-violet-600 hover:underline">Invoice</a>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6">
                  <p className="text-sm text-slate-500">No previous transactions.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
