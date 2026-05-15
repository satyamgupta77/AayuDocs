import Link from "next/link";
import { LayoutDashboard, Users, FileText, Settings, BookOpen, DollarSign } from "lucide-react";
import { UserButton } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await currentUser();
  const email = user?.emailAddresses[0]?.emailAddress;
  const username = user?.username;

  // Allow access for specific admin email or handle as needed
  if (!user) {
    redirect("/sign-in?redirect_url=/admin");
  }

  // Restrict to only the admin email or username
  if (email !== "forsatyam2018@gmail.com" && username !== "satyam7705") {
    redirect("/");
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col sticky top-0 md:h-screen z-10 shadow-sm">
        <div className="p-5 flex items-center justify-between border-b border-slate-200 dark:border-slate-800">
          <Link href="/admin" className="flex items-center space-x-3 group min-w-0">
            <img 
              src="/logo.png" 
              alt="AayuDocs" 
              className="w-10 h-10 rounded-lg object-contain shrink-0" 
            />
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-violet-700 to-blue-600 truncate">
              Admin
            </span>
          </Link>
          <div className="md:hidden flex-shrink-0">
            <UserButton />
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          <Link href="/admin" className="flex items-center space-x-3 px-4 py-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 text-slate-700 dark:text-slate-300 font-medium transition-colors">
            <LayoutDashboard size={20} className="text-violet-500" />
            <span>Overview</span>
          </Link>
          <Link href="/admin/users" className="flex items-center space-x-3 px-4 py-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 text-slate-700 dark:text-slate-300 font-medium transition-colors">
            <Users size={20} className="text-blue-500" />
            <span>Users</span>
          </Link>
          <Link href="/admin/tools" className="flex items-center space-x-3 px-4 py-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 text-slate-700 dark:text-slate-300 font-medium transition-colors">
            <FileText size={20} className="text-emerald-500" />
            <span>Tools & Usage</span>
          </Link>
          <Link href="/admin/revenue" className="flex items-center space-x-3 px-4 py-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 text-slate-700 dark:text-slate-300 font-medium transition-colors">
            <DollarSign size={20} className="text-amber-500" />
            <span>Revenue</span>
          </Link>
          <Link href="/admin/blog" className="flex items-center space-x-3 px-4 py-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 text-slate-700 dark:text-slate-300 font-medium transition-colors">
            <BookOpen size={20} className="text-rose-500" />
            <span>Blog</span>
          </Link>
          <Link href="/admin/seo" className="flex items-center space-x-3 px-4 py-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 text-slate-700 dark:text-slate-300 font-medium transition-colors">
            <Settings size={20} className="text-slate-500" />
            <span>SEO Settings</span>
          </Link>
        </nav>

        <div className="p-4 border-t border-slate-200 dark:border-slate-800 hidden md:flex items-center space-x-3">
          <UserButton appearance={{ elements: { avatarBox: "h-10 w-10" } }} />
          <div>
            <p className="text-sm font-semibold text-slate-900 dark:text-white">Admin</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">Manage Platform</p>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-x-hidden">
        {children}
      </main>
    </div>
  );
}
