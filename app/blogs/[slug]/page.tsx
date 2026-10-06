import { auth } from "@/auth";
import { connectToDatabase } from "@/lib/mongodb";
import "@/models/Community";
import Post from "@/models/Post";
import "@/models/User";
import Link from "next/link";
import { notFound } from "next/navigation";
import { deletePost } from "./actions";

type BlogPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

type PopulatedAuthor = {
  name?: string;
  username?: string;
  email?: string;
};

type PopulatedCommunity = {
  name: string;
};

export default async function BlogPage({ params }: BlogPageProps) {
  const { slug } = await params;
  const session = await auth();

  await connectToDatabase();

  const blog = await Post.findOne({
    slug,
    published: true,
  })
    .populate<{ author: PopulatedAuthor }>(
      "author",
      "name username email"
    )
    .populate<{ community: PopulatedCommunity }>(
      "community",
      "name"
    );

  if (!blog) {
    notFound();
  }

  const isOwner =
  
    session?.user?.email?.toLowerCase() ===
    blog.author.email?.toLowerCase();

const deletePostWithSlug = deletePost.bind(null, slug);
  const createdAt =
    blog.createdAt instanceof Date
      ? blog.createdAt.toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      : "";

  return (
    <main className="mx-auto w-full max-w-4xl flex-1 px-6 py-12">
      <article>
        <p className="font-medium text-blue-600">
          {blog.community.name}
        </p>

        <h1 className="mt-3 text-4xl font-bold tracking-tight text-gray-900">
          {blog.title}
        </h1>

        <p className="mt-4 text-gray-500">
          By {blog.author.name ?? blog.author.username} · {createdAt}
        </p>

        <div className="mt-6 flex flex-wrap gap-2">
          {blog.tags.map((tag: string) => (
            <span
              key={tag}
              className="rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-700"
            >
              #{tag}
            </span>
          ))}
        </div>

        <div className="mt-10 border-y border-gray-200 py-10">
          <p className="whitespace-pre-wrap text-lg leading-8 text-gray-700">
            {blog.content}
          </p>
        </div>

        <div className="mt-8 flex flex-wrap gap-4">
          <button className="rounded-lg border border-gray-300 px-5 py-2 font-medium">
            Bookmark
          </button>

          {isOwner && (
  <>
    <Link
      href={`/blogs/${blog.slug}/edit`}
      className="rounded-lg bg-blue-600 px-5 py-2 font-medium text-white"
    >
      Edit Article
    </Link>

    <form action={deletePostWithSlug}>
      <button
        type="submit"
        className="rounded-lg bg-red-600 px-5 py-2 font-medium text-white"
      >
        Delete Article
      </button>
    </form>
  </>
)}
        </div>
      </article>

      <section className="mt-14">
        <h2 className="text-2xl font-bold text-gray-900">
          Comments
        </h2>

        <p className="mt-5 rounded-xl border border-gray-200 p-6 text-gray-600">
          Comments will appear here.
        </p>
      </section>
    </main>
  );
}