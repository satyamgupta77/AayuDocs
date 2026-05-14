import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, FileText, DollarSign, Activity, TrendingUp, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function AdminDashboardPage() {
  return (
    <div className="p-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Overview</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Metrics and analytics for your platform.</p>
        </div>
        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
          <Input placeholder="Search admin..." className="pl-10" />
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-500 dark:text-slate-400">Total Users</CardTitle>
            <div className="h-8 w-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center dark:bg-blue-900/30 dark:text-blue-400">
              <Users size={18} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900 dark:text-white">1,248</div>
            <p className="text-xs text-emerald-600 font-medium flex items-center mt-1">
              <TrendingUp size={12} className="mr-1" /> +12% from last month
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-500 dark:text-slate-400">Files Processed</CardTitle>
            <div className="h-8 w-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center dark:bg-emerald-900/30 dark:text-emerald-400">
              <FileText size={18} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900 dark:text-white">45.2K</div>
            <p className="text-xs text-emerald-600 font-medium flex items-center mt-1">
              <TrendingUp size={12} className="mr-1" /> +28% from last month
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-500 dark:text-slate-400">Monthly Revenue</CardTitle>
            <div className="h-8 w-8 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center dark:bg-amber-900/30 dark:text-amber-400">
              <DollarSign size={18} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900 dark:text-white">$4,820</div>
            <p className="text-xs text-emerald-600 font-medium flex items-center mt-1">
              <TrendingUp size={12} className="mr-1" /> +8.4% from last month
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-500 dark:text-slate-400">Active Sessions</CardTitle>
            <div className="h-8 w-8 rounded-full bg-violet-100 text-violet-600 flex items-center justify-center dark:bg-violet-900/30 dark:text-violet-400">
              <Activity size={18} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900 dark:text-white">132</div>
            <p className="text-xs text-slate-500 font-medium flex items-center mt-1">
              Live right now
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Top Tools Chart Mock */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-6">Top Performing Tools</h3>
          <div className="space-y-6">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Merge PDF</span>
                <span className="text-sm font-medium text-slate-900 dark:text-white">12,430</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full" style={{ width: '85%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Word to PDF</span>
                <span className="text-sm font-medium text-slate-900 dark:text-white">9,820</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2">
                <div className="bg-violet-500 h-2 rounded-full" style={{ width: '65%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Compress Image</span>
                <span className="text-sm font-medium text-slate-900 dark:text-white">7,150</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2">
                <div className="bg-emerald-500 h-2 rounded-full" style={{ width: '45%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">OCR Scanner</span>
                <span className="text-sm font-medium text-slate-900 dark:text-white">4,200</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2">
                <div className="bg-amber-500 h-2 rounded-full" style={{ width: '25%' }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Users Mock */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Recent Signups</h3>
            <button className="text-sm text-violet-600 hover:text-violet-700 font-medium">View all</button>
          </div>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center justify-between p-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-lg transition-colors">
                <div className="flex items-center space-x-3">
                  <div className="h-10 w-10 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-500 font-bold">
                    U{i}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-900 dark:text-white">User {i}</p>
                    <p className="text-xs text-slate-500">user{i}@example.com</p>
                  </div>
                </div>
                <div className="text-xs text-slate-400">
                  {i * 2} hours ago
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
