import BlogCard from "@/components/BlogCard";

const bookmarkedArticles = [
  {
    title: "Understanding Dynamic Routes in Next.js",
    slug: "understanding-dynamic-routes",
    author: "Ghadir Alameddine",
    createdAt: "September 23, 2026",
    tags: ["Next.js", "Routing"],
  },
  {
    title: "MongoDB Relationships Made Simple",
    slug: "mongodb-relationships-made-simple",
    author: "Sara Ahmad",
    createdAt: "September 20, 2026",
    tags: ["MongoDB", "Database"],
  },
];

export default function BookmarksPage() {
  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-12">
      <section>
        <h1 className="text-3xl font-bold text-gray-900">
          Saved Articles
        </h1>

        <p className="mt-2 text-gray-600">
          Articles you bookmarked to read later.
        </p>
      </section>

      <section className="mt-8 grid gap-6 md:grid-cols-2">
        {bookmarkedArticles.map((article) => (
          <BlogCard
            key={article.slug}
            title={article.title}
            slug={article.slug}
            author={article.author}
            createdAt={article.createdAt}
            tags={article.tags}
          />
        ))}
      </section>
    </main>
  );
}