import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Save } from "lucide-react";

export default function AdminSeoPage() {
  return (
    <div className="p-8 max-w-4xl">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">SEO Settings</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Configure global meta tags and robots.txt rules.</p>
        </div>
        <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">
          <Save className="mr-2 h-4 w-4" /> Save Changes
        </Button>
      </div>

      <div className="space-y-6">
        <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <CardHeader>
            <CardTitle>Global Meta Configuration</CardTitle>
            <CardDescription>These settings will be applied to all pages unless overridden.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Site Name</label>
                <Input defaultValue="AayuDocs" className="bg-white dark:bg-slate-800" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Default Title Suffix</label>
                <Input defaultValue=" | AayuDocs" className="bg-white dark:bg-slate-800" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Global Description</label>
                <textarea 
                  className="w-full min-h-[100px] p-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:ring-2 focus:ring-violet-500 outline-none"
                  defaultValue="Free online tools to merge, split, compress, and process PDF files and images securely in your browser."
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Global Keywords (Comma separated)</label>
                <Input defaultValue="PDF tools, image compression, word to pdf, merge pdf, online tools" className="bg-white dark:bg-slate-800" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <CardHeader>
            <CardTitle>Open Graph / Social Share</CardTitle>
            <CardDescription>Configure how your links look when shared on social media.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Default OG Image URL</label>
              <div className="flex gap-2">
                <Input defaultValue="https://aayudocs.com/og.jpg" className="bg-white dark:bg-slate-800 flex-1" />
                <Button variant="outline">Upload</Button>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Twitter Handle</label>
              <Input defaultValue="@aayudocs" className="bg-white dark:bg-slate-800 w-full sm:w-1/2" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <CardHeader>
            <CardTitle>Robots & Indexing</CardTitle>
            <CardDescription>Advanced controls for search engine crawlers.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">robots.txt Content</label>
              <textarea 
                className="w-full min-h-[150px] p-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-mono focus:ring-2 focus:ring-violet-500 outline-none"
                defaultValue={`User-agent: *\nAllow: /\nDisallow: /admin/\nDisallow: /dashboard/\n\nSitemap: https://aayudocs.com/sitemap.xml`}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
