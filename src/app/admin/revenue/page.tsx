import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DollarSign, ArrowUpRight, CreditCard, Download, Users } from "lucide-react";
import prisma from "@/lib/db";

export default async function AdminRevenuePage() {
  const [subscriptions, activeSubscribers] = await Promise.all([
    prisma.subscription.findMany({
      where: { status: "ACTIVE" },
      include: { user: true },
      orderBy: { createdAt: "desc" },
      take: 20
    }),
    prisma.subscription.count({
      where: { status: "ACTIVE", plan: { startsWith: "PRO" } }
    })
  ]);

  // Basic MRR calculation: Pro plans usually ₹499 or similar. 
  // For now we'll just show active count * assumed price
  const assumedPrice = 499;
  const mrr = activeSubscribers * assumedPrice;

  return (
    <div className="p-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Revenue</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Track financial performance and subscriptions.</p>
        </div>
        <Button variant="outline" className="bg-white dark:bg-slate-900">
          <Download className="mr-2 h-4 w-4" /> Export Report
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Estimated MRR</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900 dark:text-white">₹{mrr.toLocaleString()}</div>
            <p className="text-xs text-emerald-600 font-medium flex items-center mt-1">
              <ArrowUpRight size={12} className="mr-1" /> Estimated monthly
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Active Pro Subscribers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900 dark:text-white">{activeSubscribers}</div>
            <p className="text-xs text-emerald-600 font-medium flex items-center mt-1">
              <ArrowUpRight size={12} className="mr-1" /> Live subscriptions
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Churn Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900 dark:text-white">0.0%</div>
            <p className="text-xs text-slate-500 font-medium flex items-center mt-1">
              New platform
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Avg Revenue Per User</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900 dark:text-white">₹{assumedPrice}</div>
            <p className="text-xs text-slate-500 font-medium flex items-center mt-1">
              Pro price point
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/50">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Recent Active Subscriptions</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-slate-500 uppercase bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="px-6 py-4 font-medium">Customer</th>
                <th className="px-6 py-4 font-medium">Plan</th>
                <th className="px-6 py-4 font-medium">Subscription ID</th>
                <th className="px-6 py-4 font-medium">Date</th>
                <th className="px-6 py-4 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {subscriptions.length > 0 ? subscriptions.map((sub) => (
                <tr key={sub.id} className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div className="h-8 w-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 font-bold text-xs uppercase">
                        {sub.user.email[0]}
                      </div>
                      <span className="text-slate-900 dark:text-white font-medium">{sub.user.email}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 rounded-md bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400 text-xs font-bold uppercase">
                      {sub.plan.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-mono text-xs text-slate-500">
                    {sub.razorpaySubscriptionId || 'manual_sub'}
                  </td>
                  <td className="px-6 py-4 text-slate-500">
                    {new Date(sub.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <span className="flex items-center text-emerald-600 dark:text-emerald-400 font-medium text-xs">
                      <CreditCard size={14} className="mr-1" /> {sub.status}
                    </span>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-500 italic">
                    No active subscriptions found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
