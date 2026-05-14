import { UserProfile } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Clock, FileText, CheckCircle, Settings, LogOut } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function DashboardPage() {
  const user = await currentUser();

  if (!user) {
    redirect("/");
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl mt-16">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* Sidebar */}
        <div className="md:col-span-1 space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm text-center">
            <img 
              src={user.imageUrl} 
              alt="Profile" 
              className="w-24 h-24 rounded-full mx-auto mb-4 border-4 border-violet-100 dark:border-violet-900/30"
            />
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              {user.firstName} {user.lastName}
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              {user.emailAddresses[0]?.emailAddress}
            </p>
          </div>

          <nav className="flex flex-col space-y-2">
            <Link href="/dashboard" className="flex items-center space-x-3 px-4 py-3 rounded-xl bg-violet-50 text-violet-700 dark:bg-violet-900/20 dark:text-violet-400 font-medium">
              <Clock size={20} />
              <span>Recent Activity</span>
            </Link>
            <Link href="/dashboard/settings" className="flex items-center space-x-3 px-4 py-3 rounded-xl text-slate-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800/50 font-medium transition-colors">
              <Settings size={20} />
              <span>Account Settings</span>
            </Link>
          </nav>
        </div>

        {/* Main Content */}
        <div className="md:col-span-3 space-y-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Welcome back, {user.firstName}!</h1>
            <p className="text-slate-600 dark:text-slate-400">
              Here is an overview of your recent document processing activity.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="h-12 w-12 rounded-xl bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 flex items-center justify-center mb-4">
                <FileText size={24} />
              </div>
              <p className="text-3xl font-bold text-slate-900 dark:text-white mb-1">0</p>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Total Files Processed</p>
            </div>
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="h-12 w-12 rounded-xl bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400 flex items-center justify-center mb-4">
                <CheckCircle size={24} />
              </div>
              <p className="text-3xl font-bold text-slate-900 dark:text-white mb-1">0</p>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Successful Conversions</p>
            </div>
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-center items-center text-center">
              <h3 className="font-semibold text-slate-900 dark:text-white mb-2">Need more tools?</h3>
              <Link href="/">
                <Button variant="outline" size="sm" className="rounded-full">
                  Explore Tools
                </Button>
              </Link>
            </div>
          </div>

          {/* Activity List */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-200 dark:border-slate-800">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Recent Activity</h3>
            </div>
            <div className="p-12 text-center">
              <div className="h-16 w-16 mx-auto bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center text-slate-400 mb-4">
                <Clock size={28} />
              </div>
              <h4 className="text-lg font-medium text-slate-900 dark:text-white mb-1">No activity yet</h4>
              <p className="text-slate-500 dark:text-slate-400 max-w-sm mx-auto mb-6">
                You haven't processed any files while logged in. Start using AayuDocs tools to build your history.
              </p>
              <Link href="/">
                <Button className="bg-violet-600 hover:bg-violet-700 text-white">
                  Process your first file
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
