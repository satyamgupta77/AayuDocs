import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PenTool, Search, Filter, Edit, Trash2, Eye } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function AdminBlogPage() {
  return (
    <div className="p-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Blog Management</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Manage articles, categories, and SEO content.</p>
        </div>
        <Button className="bg-violet-600 hover:bg-violet-700 text-white">
          <PenTool className="mr-2 h-4 w-4" /> Write New Post
        </Button>
      </div>

      <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row gap-4 justify-between items-center bg-slate-50/50 dark:bg-slate-900/50">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
            <Input placeholder="Search posts..." className="pl-10 bg-white dark:bg-slate-800" />
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <Button variant="outline" className="w-full sm:w-auto bg-white dark:bg-slate-800">
              <Filter className="mr-2 h-4 w-4" /> Status
            </Button>
            <Button variant="outline" className="w-full sm:w-auto bg-white dark:bg-slate-800">
              <Filter className="mr-2 h-4 w-4" /> Category
            </Button>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-slate-500 uppercase bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="px-6 py-4 font-medium">Title</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium">Author</th>
                <th className="px-6 py-4 font-medium">Date</th>
                <th className="px-6 py-4 font-medium">Views</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {[
                { title: "How to Merge PDFs for Free", status: "Published", views: "12.4k" },
                { title: "Best Image Compression Techniques", status: "Published", views: "8.1k" },
                { title: "Top 5 Uses for OCR Technology", status: "Draft", views: "-" },
                { title: "AayuDocs Pro Announcement", status: "Published", views: "4.2k" },
                { title: "Converting HEIC to JPG Easily", status: "Draft", views: "-" },
              ].map((post, i) => (
                <tr key={i} className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                  <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">
                    {post.title}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                      post.status === 'Published' 
                        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                        : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                    }`}>
                      {post.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-600 dark:text-slate-400">
                    Admin
                  </td>
                  <td className="px-6 py-4 text-slate-500">
                    Oct {20 - i}, 2026
                  </td>
                  <td className="px-6 py-4 text-slate-500 font-mono text-xs">
                    {post.views}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-slate-400 hover:text-emerald-600">
                        <Eye size={16} />
                      </Button>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-slate-400 hover:text-blue-600">
                        <Edit size={16} />
                      </Button>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-slate-400 hover:text-rose-600">
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
