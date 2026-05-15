import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Activity, TrendingUp, Settings2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import prisma from "@/lib/db";

export default async function AdminToolsPage() {
  const toolUsages = await prisma.toolUsage.findMany({
    orderBy: { count: "desc" }
  });

  const totalUses = toolUsages.reduce((acc, curr) => acc + curr.count, 0);
  const mostPopular = toolUsages[0];

  return (
    <div className="p-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Tools & Usage</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Monitor tool performance and configure limits.</p>
        </div>
        <Button className="bg-violet-600 hover:bg-violet-700 text-white">
          <Settings2 className="mr-2 h-4 w-4" /> Global Config
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Most Popular Tool</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900 dark:text-white capitalize">
              {mostPopular?.toolSlug.replace(/-/g, ' ') || 'N/A'}
            </div>
            <p className="text-xs text-emerald-600 font-medium flex items-center mt-1">
              <TrendingUp size={12} className="mr-1" /> {mostPopular?.count.toLocaleString() || 0} lifetime uses
            </p>
          </CardContent>
        </Card>
        <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Total Operations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900 dark:text-white">{totalUses.toLocaleString()}</div>
            <p className="text-xs text-slate-500 font-medium flex items-center mt-1">
              <Activity size={12} className="mr-1" /> All-time processed
            </p>
          </CardContent>
        </Card>
        <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Average Processing Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900 dark:text-white">1.2s</div>
            <p className="text-xs text-emerald-600 font-medium flex items-center mt-1">
              <TrendingUp size={12} className="mr-1" /> 0.3s faster than average
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Tool Execution Analytics</h3>
          <BarChart className="text-slate-400" />
        </div>
        
        <div className="space-y-6">
          {toolUsages.length > 0 ? toolUsages.map((tool, idx) => {
            const colors = ["bg-blue-500", "bg-violet-500", "bg-emerald-500", "bg-amber-500", "bg-rose-500", "bg-slate-500"];
            const colorClass = colors[idx % colors.length];
            const percentage = mostPopular?.count ? Math.round((tool.count / mostPopular.count) * 100) : 0;
            
            return (
              <div key={tool.id}>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300 capitalize">{tool.toolSlug.replace(/-/g, ' ')}</span>
                  <span className="text-sm font-medium text-slate-900 dark:text-white">{tool.count.toLocaleString()}</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-3">
                  <div 
                    className={`${colorClass} h-3 rounded-full transition-all duration-1000`} 
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
              </div>
            );
          }) : (
            <p className="text-sm text-slate-500 text-center py-4">No data available yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}
