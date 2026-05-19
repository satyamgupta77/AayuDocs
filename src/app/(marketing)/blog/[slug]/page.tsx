import { getPostBySlug, getRelatedPosts } from "@/services/blog";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Calendar, User, ArrowLeft, Tag, Share2 } from "lucide-react";
import { format } from "date-fns";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export async function generateMetadata(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  const post = await getPostBySlug(params.slug);
  if (!post) return { title: "Post Not Found" };

  return {
    title: `${post.title} | AayuDocs Blog`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: post.imageUrl ? [post.imageUrl] : [],
    }
  };
}

export default async function BlogPostPage(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  const post = await getPostBySlug(params.slug);
  
  if (!post) {
    notFound();
  }

  const relatedPosts = await getRelatedPosts(params.slug);

  return (
    <article className="min-h-screen bg-white dark:bg-slate-950 pb-24">
      {/* Hero Header */}
      <header className="relative pt-32 pb-16 md:pt-40 md:pb-24 overflow-hidden border-b border-slate-200 dark:border-slate-800">
        <div className="absolute inset-0 bg-slate-50 dark:bg-slate-900 -z-10"></div>
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] -z-10"></div>
        
        <div className="container mx-auto px-4 max-w-4xl">
          <Link href="/blog" className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-violet-600 dark:hover:text-violet-400 mb-8 transition-colors">
            <ArrowLeft size={16} className="mr-2" /> Back to blog
          </Link>
          
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <Link href={`/blog/category/${post.category.toLowerCase()}`}>
              <span className="bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400 text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider hover:bg-violet-200 transition-colors">
                {post.category}
              </span>
            </Link>
            <span className="text-slate-400 dark:text-slate-500 text-sm flex items-center">
              <Calendar size={14} className="mr-1.5" />
              {format(new Date(post.createdAt), 'MMMM d, yyyy')}
            </span>
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 dark:text-white leading-tight mb-6">
            {post.title}
          </h1>
          
          <p className="text-xl text-slate-600 dark:text-slate-300 leading-relaxed max-w-3xl mb-8">
            {post.excerpt}
          </p>
          
          <div className="flex items-center justify-between border-t border-slate-200 dark:border-slate-800 pt-6">
            <div className="flex items-center space-x-3">
              <div className="h-12 w-12 rounded-full bg-gradient-to-br from-violet-600 to-blue-500 flex items-center justify-center text-white font-bold text-lg">
                {(post as any).author?.firstName?.charAt(0) || "A"}
              </div>
              <div>
                <p className="font-semibold text-slate-900 dark:text-white">
                  {(post as any).author?.firstName} {(post as any).author?.lastName || "Admin"}
                </p>
                <p className="text-sm text-slate-500">AayuDocs Team</p>
              </div>
            </div>
            
            <Button variant="outline" size="sm" className="hidden sm:flex">
              <Share2 size={16} className="mr-2" /> Share Post
            </Button>
          </div>
        </div>
      </header>

      {/* Featured Image */}
      {post.imageUrl && (
        <div className="container mx-auto px-4 max-w-5xl -mt-12 md:-mt-16 relative z-10 mb-16">
          <div className="rounded-2xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800 bg-white relative h-[400px] sm:h-[500px] md:h-[600px] w-full">
            <Image 
              src={post.imageUrl} 
              alt={post.title} 
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 1024px"
              priority
              className="object-cover" 
            />
          </div>
        </div>
      )}

      {/* Content */}
      <div className={`container mx-auto px-4 max-w-3xl ${!post.imageUrl ? 'pt-16' : ''}`}>
        <div 
          className="prose prose-lg dark:prose-invert prose-violet max-w-none 
          prose-headings:font-bold prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-6 
          prose-p:text-slate-700 dark:prose-p:text-slate-300 prose-p:leading-relaxed prose-p:mb-6
          prose-a:text-violet-600 dark:prose-a:text-violet-400 prose-a:no-underline hover:prose-a:underline
          prose-img:rounded-xl prose-img:shadow-md"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
        
        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="mt-16 pt-8 border-t border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-2 flex-wrap">
              <Tag size={18} className="text-slate-400 mr-2" />
              {post.tags.map((tag: string, i: number) => (
                <span key={i} className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-3 py-1 rounded-md text-sm font-medium">
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <div className="container mx-auto px-4 max-w-5xl mt-24">
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-8 border-b border-slate-200 dark:border-slate-800 pb-4">
            Related Articles
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {relatedPosts.map((relatedPost: any) => (
              <Link href={`/blog/${relatedPost.slug}`} key={relatedPost.id} className="group">
                <Card className="h-full bg-transparent border-0 shadow-none hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors rounded-xl overflow-hidden">
                  <div className="h-40 overflow-hidden rounded-xl mb-4 bg-slate-100 dark:bg-slate-800 relative">
                    {relatedPost.imageUrl && (
                      <Image 
                        src={relatedPost.imageUrl} 
                        alt={relatedPost.title} 
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    )}
                  </div>
                  <h4 className="font-bold text-lg text-slate-900 dark:text-white mb-2 group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors line-clamp-2">
                    {relatedPost.title}
                  </h4>
                  <p className="text-sm text-slate-500 flex items-center">
                    <Calendar size={14} className="mr-1.5" />
                    {format(new Date(relatedPost.createdAt), 'MMM d, yyyy')}
                  </p>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      )}
    </article>
  );
}
