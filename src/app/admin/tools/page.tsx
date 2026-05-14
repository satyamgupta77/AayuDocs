import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Activity, TrendingUp, Settings2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AdminToolsPage() {
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
            <div className="text-2xl font-bold text-slate-900 dark:text-white">Merge PDF</div>
            <p className="text-xs text-emerald-600 font-medium flex items-center mt-1">
              <TrendingUp size={12} className="mr-1" /> 12,430 uses this week
            </p>
          </CardContent>
        </Card>
        <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Peak Usage Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900 dark:text-white">10:00 AM EST</div>
            <p className="text-xs text-slate-500 font-medium flex items-center mt-1">
              <Activity size={12} className="mr-1" /> High server load
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
          {[
            { name: "Merge PDF", uses: "12.4k", percent: 85, color: "bg-blue-500" },
            { name: "Word to PDF", uses: "9.8k", percent: 65, color: "bg-violet-500" },
            { name: "Compress Image", uses: "7.1k", percent: 45, color: "bg-emerald-500" },
            { name: "OCR Scanner", uses: "4.2k", percent: 25, color: "bg-amber-500" },
            { name: "Background Remover", uses: "2.1k", percent: 15, color: "bg-rose-500" },
            { name: "ZIP Extractor", uses: "900", percent: 5, color: "bg-slate-500" },
          ].map((tool, idx) => (
            <div key={idx}>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{tool.name}</span>
                <span className="text-sm font-medium text-slate-900 dark:text-white">{tool.uses}</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-3">
                <div className={`${tool.color} h-3 rounded-full`} style={{ width: `${tool.percent}%` }}></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
