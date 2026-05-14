import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DollarSign, ArrowUpRight, CreditCard, Download } from "lucide-react";

export default function AdminRevenuePage() {
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
        <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Monthly Recurring Revenue (MRR)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900 dark:text-white">$4,820</div>
            <p className="text-xs text-emerald-600 font-medium flex items-center mt-1">
              <ArrowUpRight size={12} className="mr-1" /> +8.4%
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Active Pro Subscribers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900 dark:text-white">482</div>
            <p className="text-xs text-emerald-600 font-medium flex items-center mt-1">
              <ArrowUpRight size={12} className="mr-1" /> +12 net new
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Churn Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900 dark:text-white">2.4%</div>
            <p className="text-xs text-rose-600 font-medium flex items-center mt-1">
              +0.2% from last month
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Avg Revenue Per User</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900 dark:text-white">$10.00</div>
            <p className="text-xs text-slate-500 font-medium flex items-center mt-1">
              Stable
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Recent Transactions</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-slate-500 uppercase bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="px-6 py-4 font-medium">Transaction ID</th>
                <th className="px-6 py-4 font-medium">Customer</th>
                <th className="px-6 py-4 font-medium">Plan</th>
                <th className="px-6 py-4 font-medium">Amount</th>
                <th className="px-6 py-4 font-medium">Date</th>
                <th className="px-6 py-4 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {[1, 2, 3, 4, 5].map((i) => (
                <tr key={i} className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                  <td className="px-6 py-4 font-mono text-xs">
                    txn_xyz987{i}abc
                  </td>
                  <td className="px-6 py-4 text-slate-900 dark:text-white font-medium">
                    customer{i}@example.com
                  </td>
                  <td className="px-6 py-4">
                    Pro Monthly
                  </td>
                  <td className="px-6 py-4 font-medium">
                    $10.00
                  </td>
                  <td className="px-6 py-4 text-slate-500">
                    Today, 10:{i}4 AM
                  </td>
                  <td className="px-6 py-4">
                    <span className="flex items-center text-emerald-600 dark:text-emerald-400 font-medium text-xs">
                      <CreditCard size={14} className="mr-1" /> Paid
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
