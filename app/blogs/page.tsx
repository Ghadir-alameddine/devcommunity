import BlogCard from "@/components/BlogCard";
import { connectToDatabase } from "@/lib/mongodb";
import Post from "@/models/Post";
import "@/models/User";

export const dynamic = "force-dynamic";

type PopulatedAuthor = {
  name?: string;
  username?: string;
};

export default async function BlogsPage() {
  await connectToDatabase();

  const blogs = await Post.find({
    published: true,
  })
    .sort({ createdAt: -1 })
    .limit(30)
    .populate<{ author: PopulatedAuthor }>(
      "author",
      "name username"
    );

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-12">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-gray-900">
          Developer Blogs
        </h1>

        <p className="mt-3 text-gray-600">
          Read articles written by developers and share what you learn.
        </p>
      </div>

      {blogs.length === 0 ? (
        <div className="rounded-xl border border-gray-200 bg-white p-8 text-center">
          <h2 className="text-xl font-semibold text-gray-900">
            No articles yet
          </h2>

          <p className="mt-2 text-gray-600">
            Be the first developer to publish an article.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {blogs.map((blog) => {
            const createdAt =
              blog.createdAt instanceof Date
                ? blog.createdAt.toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })
                : "";

            return (
              <BlogCard
                key={blog._id.toString()}
                title={blog.title}
                slug={blog.slug}
                author={
                  blog.author.name ??
                  blog.author.username ??
                  "Unknown developer"
                }
                createdAt={createdAt}
                tags={blog.tags}
              />
            );
          })}
        </div>
      )}
    </main>
  );
}