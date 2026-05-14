import { getPublishedPosts, getCategories } from "@/services/blog";
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Calendar, ChevronRight } from "lucide-react";
import { format } from "date-fns";

export const metadata = {
  title: "Blog & Resources",
  description: "Learn how to manage, convert, and compress files securely with AayuDocs.",
};

export default async function BlogPage(props: { searchParams: Promise<{ q?: string; page?: string }> }) {
  const searchParams = await props.searchParams;
  const q = searchParams.q || "";
  const page = parseInt(searchParams.page || "1");

  const { posts, totalPages } = await getPublishedPosts(q, undefined, page, 9);
  const categories = await getCategories();

  return (
    <div className="container mx-auto px-4 py-16 md:py-24 max-w-7xl">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6">
          AayuDocs <span className="bg-clip-text text-transparent bg-gradient-to-r from-violet-600 to-blue-500">Resources</span>
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-400">
          Discover tutorials, product updates, and expert tips on managing your documents efficiently and securely.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-12">
        {/* Main Content */}
        <div className="lg:w-2/3 xl:w-3/4">
          {posts.length === 0 ? (
            <div className="text-center py-20 bg-slate-50 dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">No posts found</h3>
              <p className="text-slate-500">Try adjusting your search query.</p>
              <Link href="/blog">
                <Button variant="outline" className="mt-6">Clear Search</Button>
              </Link>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                {posts.map((post: any) => (
                  <Link href={`/blog/${post.slug}`} key={post.id} className="group flex flex-col h-full">
                    <Card className="flex-1 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                      <div className="h-48 overflow-hidden relative bg-slate-100 dark:bg-slate-800">
                        {post.imageUrl ? (
                          <Image 
                            src={post.imageUrl} 
                            alt={post.title} 
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        ) : (
                          <div className="absolute inset-0 bg-gradient-to-br from-violet-100 to-blue-50 dark:from-violet-900/20 dark:to-blue-900/20 flex items-center justify-center text-violet-300">
                            <span className="font-bold text-4xl opacity-50">AD</span>
                          </div>
                        )}
                        <div className="absolute top-4 left-4">
                          <span className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm text-violet-700 dark:text-violet-400 text-xs font-bold px-3 py-1 rounded-full shadow-sm uppercase tracking-wider">
                            {post.category}
                          </span>
                        </div>
                      </div>
                      <CardContent className="p-6 flex-1 flex flex-col">
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3 line-clamp-2 group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">
                          {post.title}
                        </h2>
                        <p className="text-slate-600 dark:text-slate-400 text-sm mb-6 line-clamp-3 flex-1">
                          {post.excerpt}
                        </p>
                        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mt-auto pt-4 border-t border-slate-100 dark:border-slate-800">
                          <div className="flex items-center">
                            <Calendar size={14} className="mr-1.5" />
                            {format(new Date(post.createdAt), 'MMM d, yyyy')}
                          </div>
                          <span className="flex items-center font-medium text-violet-600 dark:text-violet-400">
                            Read more <ChevronRight size={14} className="ml-1" />
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center mt-12 space-x-2">
                  {Array.from({ length: totalPages }).map((_, i) => (
                    <Link key={i} href={`/blog?page=${i + 1}${q ? `&q=${q}` : ''}`}>
                      <Button 
                        variant={page === i + 1 ? "default" : "outline"}
                        className={page === i + 1 ? "bg-violet-600 text-white" : ""}
                      >
                        {i + 1}
                      </Button>
                    </Link>
                  ))}
                </div>
              )}
            </>
          )}
        </div>

        {/* Sidebar */}
        <aside className="lg:w-1/3 xl:w-1/4 space-y-8">
          {/* Search */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Search</h3>
            <form action="/blog" method="GET" className="relative">
              <Input 
                type="text" 
                name="q" 
                placeholder="Search articles..." 
                defaultValue={q}
                className="pl-4 pr-10 bg-slate-50 dark:bg-slate-800"
              />
              <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-violet-600">
                <Search size={18} />
              </button>
            </form>
          </div>

          {/* Categories */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Categories</h3>
            <ul className="space-y-3">
              {categories.map((cat, i) => (
                <li key={i}>
                  <Link 
                    href={`/blog/category/${cat.name.toLowerCase()}`}
                    className="flex justify-between items-center group text-slate-600 dark:text-slate-400 hover:text-violet-600 dark:hover:text-violet-400 transition-colors"
                  >
                    <span className="font-medium">{cat.name}</span>
                    <span className="bg-slate-100 dark:bg-slate-800 text-slate-500 text-xs py-1 px-2.5 rounded-full group-hover:bg-violet-100 group-hover:text-violet-600 dark:group-hover:bg-violet-900/30 transition-colors">
                      {cat.count}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}
