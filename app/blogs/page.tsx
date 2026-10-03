import BlogCard from "@/components/BlogCard";

const blogs = [
  {
    title: "Understanding Dynamic Routes in Next.js",
    slug: "understanding-dynamic-routes",
    author: "Ghadir Alameddine",
    createdAt: "September 23, 2026",
    tags: ["Next.js", "Routing", "TypeScript"],
  },
  {
    title: "MongoDB Relationships Made Simple",
    slug: "mongodb-relationships-made-simple",
    author: "Maya Haddad",
    createdAt: "September 21, 2026",
    tags: ["MongoDB", "Mongoose", "Database"],
  },
  {
    title: "A Beginner’s Guide to Git Branches",
    slug: "beginners-guide-git-branches",
    author: "Karim Ali",
    createdAt: "September 19, 2026",
    tags: ["Git", "GitHub"],
  },
];

export default function BlogsPage() {
  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-12">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-gray-900">Developer Blogs</h1>

        <p className="mt-3 text-gray-600">
          Read articles written by developers and share what you learn.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {blogs.map((blog) => (
          <BlogCard
            key={blog.slug}
            title={blog.title}
            slug={blog.slug}
            author={blog.author}
            createdAt={blog.createdAt}
            tags={blog.tags}
          />
        ))}
      </div>
    </main>
  );
}