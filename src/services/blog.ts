import prisma from "@/lib/db";

const fallbackPosts = [
  {
    id: "1",
    title: "How to Merge PDFs for Free",
    slug: "how-to-merge-pdfs-for-free",
    content: "<p>Merging PDF files used to require expensive software. Now, with browser-based tools, you can combine multiple PDFs instantly.</p><h2>Why Merge PDFs?</h2><p>Whether you are compiling a report, grouping invoices, or submitting a portfolio, merging documents keeps everything organized.</p>",
    excerpt: "Learn how to easily combine multiple PDF files into a single document without installing any software.",
    imageUrl: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=800&q=80",
    category: "Tutorials",
    tags: ["pdf", "merge", "guide"],
    published: true,
    authorId: "admin",
    createdAt: new Date("2026-05-10"),
    updatedAt: new Date("2026-05-10"),
    author: { firstName: "Aayu", lastName: "Admin", imageUrl: "" }
  },
  {
    id: "2",
    title: "Best Image Compression Techniques",
    slug: "best-image-compression-techniques",
    content: "<p>Large images slow down your website and consume unnecessary storage. Here is how modern compression algorithms save the day.</p>",
    excerpt: "Discover the best ways to reduce image file sizes while maintaining crystal clear quality for web usage.",
    imageUrl: "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=800&q=80",
    category: "Optimization",
    tags: ["images", "compression", "performance"],
    published: true,
    authorId: "admin",
    createdAt: new Date("2026-05-12"),
    updatedAt: new Date("2026-05-12"),
    author: { firstName: "Aayu", lastName: "Admin", imageUrl: "" }
  },
  {
    id: "3",
    title: "Top 5 Uses for OCR Technology",
    slug: "top-5-uses-for-ocr-technology",
    content: "<p>Optical Character Recognition (OCR) transforms static images of text into editable, searchable data.</p>",
    excerpt: "Explore how OCR is revolutionizing data entry, accessibility, and document archiving across industries.",
    imageUrl: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=800&q=80",
    category: "Technology",
    tags: ["ocr", "text extraction", "ai"],
    published: true,
    authorId: "admin",
    createdAt: new Date("2026-05-14"),
    updatedAt: new Date("2026-05-14"),
    author: { firstName: "Aayu", lastName: "Admin", imageUrl: "" }
  }
];

export async function getPublishedPosts(query?: string, category?: string, page = 1, limit = 9) {
  try {
    const whereClause: any = { published: true };
    if (query) {
      whereClause.OR = [
        { title: { contains: query, mode: "insensitive" } },
        { content: { contains: query, mode: "insensitive" } },
      ];
    }
    if (category) {
      whereClause.category = category;
    }

    const posts = await prisma.blog.findMany({
      where: whereClause,
      include: { author: true },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    });

    const total = await prisma.blog.count({ where: whereClause });

    if (posts.length === 0 && !query && !category) {
      return { posts: fallbackPosts, total: fallbackPosts.length, totalPages: 1 };
    }

    return { posts, total, totalPages: Math.ceil(total / limit) };
  } catch (error) {
    console.error("Database connection failed, using fallback blog data.");
    // Filter fallback data
    let filtered = [...fallbackPosts];
    if (query) {
      filtered = filtered.filter(p => p.title.toLowerCase().includes(query.toLowerCase()) || p.content.toLowerCase().includes(query.toLowerCase()));
    }
    if (category) {
      filtered = filtered.filter(p => p.category.toLowerCase() === category.toLowerCase());
    }
    return { posts: filtered, total: filtered.length, totalPages: 1 };
  }
}

export async function getPostBySlug(slug: string) {
  try {
    const post = await prisma.blog.findUnique({
      where: { slug },
      include: { author: true },
    });
    
    if (!post) {
      return fallbackPosts.find(p => p.slug === slug) || null;
    }
    return post;
  } catch (error) {
    return fallbackPosts.find(p => p.slug === slug) || null;
  }
}

export async function getCategories() {
  try {
    const categories = await prisma.blog.groupBy({
      by: ['category'],
      where: { published: true },
      _count: { category: true }
    });
    return categories.map(c => ({ name: c.category, count: c._count.category }));
  } catch (error) {
    return [
      { name: "Tutorials", count: 1 },
      { name: "Optimization", count: 1 },
      { name: "Technology", count: 1 }
    ];
  }
}

export async function getRelatedPosts(slug: string, limit = 3) {
  try {
    const currentPost = await getPostBySlug(slug);
    if (!currentPost) return [];

    const posts = await prisma.blog.findMany({
      where: {
        published: true,
        category: currentPost.category,
        NOT: { slug },
      },
      take: limit,
      include: { author: true },
    });

    if (posts.length === 0) {
       return fallbackPosts.filter(p => p.slug !== slug).slice(0, limit);
    }
    return posts;
  } catch (error) {
    return fallbackPosts.filter(p => p.slug !== slug).slice(0, limit);
  }
}
