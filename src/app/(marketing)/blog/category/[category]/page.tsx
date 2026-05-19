import { getPublishedPosts, getCategories } from "@/services/blog";
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Calendar, ChevronRight, ArrowLeft } from "lucide-react";
import { format } from "date-fns";

export async function generateMetadata(props: { params: Promise<{ category: string }> }) {
  const params = await props.params;
  const categoryStr = params.category.charAt(0).toUpperCase() + params.category.slice(1);
  return {
    title: `${categoryStr} Articles | AayuDocs Blog`,
    description: `Read our latest articles and tutorials about ${categoryStr}.`,
  };
}

export default async function CategoryPage(props: { params: Promise<{ category: string }>, searchParams: Promise<{ page?: string }> }) {
  const params = await props.params;
  const searchParams = await props.searchParams;
  
  const categoryName = params.category.charAt(0).toUpperCase() + params.category.slice(1);
  const page = parseInt(searchParams.page || "1");

  const { posts, totalPages } = await getPublishedPosts(undefined, categoryName, page, 9);
  const categories: Array<{ name: string; count?: number }> = await getCategories();

  return (
    <div className="container mx-auto px-4 py-16 md:py-24 max-w-7xl">
      <Link href="/blog" className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-violet-600 mb-8 transition-colors">
        <ArrowLeft size={16} className="mr-2" /> Back to all articles
      </Link>
      
      <div className="mb-12">
        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
          Category: <span className="text-violet-600 dark:text-violet-400">{categoryName}</span>
        </h1>
        <p className="text-slate-600 dark:text-slate-400">Browsing all published articles in {categoryName}.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-12">
        <div className="lg:w-2/3 xl:w-3/4">
          {posts.length === 0 ? (
            <div className="text-center py-20 bg-slate-50 dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">No posts found</h3>
              <p className="text-slate-500">There are currently no articles in this category.</p>
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
                          <div className="absolute inset-0 bg-gradient-to-br from-violet-100 to-blue-50 flex items-center justify-center text-violet-300">
                            <span className="font-bold text-4xl opacity-50">AD</span>
                          </div>
                        )}
                      </div>
                      <CardContent className="p-6 flex-1 flex flex-col">
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3 line-clamp-2 group-hover:text-violet-600 transition-colors">
                          {post.title}
                        </h2>
                        <p className="text-slate-600 dark:text-slate-400 text-sm mb-6 line-clamp-3 flex-1">
                          {post.excerpt}
                        </p>
                        <div className="flex items-center justify-between text-xs text-slate-500 mt-auto pt-4 border-t border-slate-100 dark:border-slate-800">
                          <div className="flex items-center">
                            <Calendar size={14} className="mr-1.5" />
                            {format(new Date(post.createdAt), 'MMM d, yyyy')}
                          </div>
                          <span className="flex items-center font-medium text-violet-600">
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
                    <Link key={i} href={`/blog/category/${params.category}?page=${i + 1}`}>
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
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Categories</h3>
            <ul className="space-y-3">
              {categories.map((cat: { name: string; count?: number }, i: number) => (
                <li key={i}>
                  <Link 
                    href={`/blog/category/${cat.name.toLowerCase()}`}
                    className={`flex justify-between items-center group transition-colors ${cat.name.toLowerCase() === params.category ? 'text-violet-600 dark:text-violet-400 font-bold' : 'text-slate-600 dark:text-slate-400 hover:text-violet-600'}`}
                  >
                    <span>{cat.name}</span>
                    <span className={`text-xs py-1 px-2.5 rounded-full transition-colors ${cat.name.toLowerCase() === params.category ? 'bg-violet-100 text-violet-700 dark:bg-violet-900/30' : 'bg-slate-100 text-slate-500 group-hover:bg-violet-100 group-hover:text-violet-600 dark:bg-slate-800'}`}>
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
