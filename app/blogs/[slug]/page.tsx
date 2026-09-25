import Link from "next/link";
import { notFound } from "next/navigation";

const blogs = [
  {
    title: "Understanding Dynamic Routes in Next.js",
    slug: "understanding-dynamic-routes",
    author: "Ghadir Alameddine",
    createdAt: "September 23, 2026",
    community: "Next.js Developers",
    tags: ["Next.js", "Routing", "TypeScript"],
    content:
      "Dynamic routes allow one page file to display different content based on a URL value. In the App Router, a folder such as [slug] captures that changing value through params.",
  },
  {
    title: "MongoDB Relationships Made Simple",
    slug: "mongodb-relationships-made-simple",
    author: "Maya Haddad",
    createdAt: "September 21, 2026",
    community: "Python Developers",
    tags: ["MongoDB", "Mongoose", "Database"],
    content:
      "MongoDB relationships can use embedding or references. The correct choice depends on how the application reads, updates and shares the related data.",
  },
  {
    title: "A Beginner’s Guide to Git Branches",
    slug: "beginners-guide-git-branches",
    author: "Karim Ali",
    createdAt: "September 19, 2026",
    community: "DevOps Community",
    tags: ["Git", "GitHub"],
    content:
      "Git branches create separate lines of development. They allow developers to build and test features without changing the stable main branch.",
  },
];

type BlogPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function BlogPage({ params }: BlogPageProps) {
  const { slug } = await params;

  const blog = blogs.find((blog) => blog.slug === slug);

  if (!blog) {
    notFound();
  }

  return (
    <main className="mx-auto w-full max-w-4xl flex-1 px-6 py-12">
      <article>
        <p className="font-medium text-blue-600">{blog.community}</p>

        <h1 className="mt-3 text-4xl font-bold tracking-tight text-gray-900">
          {blog.title}
        </h1>

        <p className="mt-4 text-gray-500">
          By {blog.author} · {blog.createdAt}
        </p>

        <div className="mt-6 flex flex-wrap gap-2">
          {blog.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-700"
            >
              #{tag}
            </span>
          ))}
        </div>

        <div className="mt-10 border-y border-gray-200 py-10">
          <p className="text-lg leading-8 text-gray-700">{blog.content}</p>
        </div>

        <div className="mt-8 flex flex-wrap gap-4">
          <button className="rounded-lg border border-gray-300 px-5 py-2 font-medium">
            Bookmark
          </button>

          <Link
            href={`/blogs/${blog.slug}/edit`}
            className="rounded-lg bg-blue-600 px-5 py-2 font-medium text-white"
          >
            Edit Article
          </Link>
        </div>
      </article>

      <section className="mt-14">
        <h2 className="text-2xl font-bold text-gray-900">Comments</h2>

        <p className="mt-5 rounded-xl border border-gray-200 p-6 text-gray-600">
          Comments will appear here.
        </p>
      </section>
    </main>
  );
}