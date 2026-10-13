import BlogCard from "@/components/BlogCard";
import { connectToDatabase } from "@/lib/mongodb";
import Community from "@/models/Community";
import Post from "@/models/Post";
import "@/models/User";
import { Types } from "mongoose";
import Link from "next/link";

export const dynamic = "force-dynamic";

type PopulatedAuthor = {
  name?: string;
  username?: string;
};

type BlogsPageProps = {
  searchParams: Promise<{
    search?: string;
    community?: string;
    page?: string;
  }>;
};

function escapeRegex(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export default async function BlogsPage({
  searchParams,
}: BlogsPageProps) {
  const params = await searchParams;

  const search = params.search?.trim() ?? "";
  const communitySlug = params.community?.trim() ?? "";
  const page = Math.max(Number(params.page) || 1, 1);
  const limit = 6;

  await connectToDatabase();

  const communities = await Community.find({})
    .sort({ name: 1 })
    .lean();

  const query: {
    published: boolean;
    community?: Types.ObjectId;
    $or?: Array<Record<string, RegExp>>;
  } = {
    published: true,
  };

  if (search) {
    const searchRegex = new RegExp(escapeRegex(search), "i");

    query.$or = [
      { title: searchRegex },
      { content: searchRegex },
      { tags: searchRegex },
    ];
  }

  if (communitySlug) {
    const selectedCommunity = await Community.findOne({
      slug: communitySlug,
    }).select("_id");

    query.community =
      selectedCommunity?._id ?? new Types.ObjectId();
  }

  const [blogs, totalBlogs] = await Promise.all([
    Post.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate<{ author: PopulatedAuthor }>(
        "author",
        "name username"
      ),

    Post.countDocuments(query),
  ]);

  const totalPages = Math.ceil(totalBlogs / limit);

  function pageHref(targetPage: number) {
    const urlParams = new URLSearchParams();

    if (search) {
      urlParams.set("search", search);
    }

    if (communitySlug) {
      urlParams.set("community", communitySlug);
    }

    urlParams.set("page", targetPage.toString());

    return `/blogs?${urlParams.toString()}`;
  }

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Developer Blogs
        </h1>

        <p className="mt-3 text-gray-600">
          Read articles written by developers and share what you learn.
        </p>
      </div>

      <form
        method="GET"
        className="mb-8 grid gap-4 rounded-xl border border-gray-200 bg-white p-5 md:grid-cols-[1fr_240px_auto]"
      >
        <div>
          <label
            htmlFor="search"
            className="block text-sm font-medium text-gray-700"
          >
            Search articles
          </label>

          <input
            id="search"
            name="search"
            type="search"
            defaultValue={search}
            placeholder="Search titles, content, or tags"
            className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3"
          />
        </div>

        <div>
          <label
            htmlFor="community"
            className="block text-sm font-medium text-gray-700"
          >
            Community
          </label>

          <select
            id="community"
            name="community"
            defaultValue={communitySlug}
            className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3"
          >
            <option value="">All communities</option>

            {communities.map((community) => (
              <option
                key={community._id.toString()}
                value={community.slug}
              >
                {community.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-end gap-2">
          <button
            type="submit"
            className="rounded-lg bg-blue-600 px-5 py-3 font-medium text-white"
          >
            Search
          </button>

          {(search || communitySlug) && (
            <Link
              href="/blogs"
              className="rounded-lg border border-gray-300 px-5 py-3 font-medium"
            >
              Clear
            </Link>
          )}
        </div>
      </form>

      <p className="mb-6 text-sm text-gray-500">
        {totalBlogs} {totalBlogs === 1 ? "article" : "articles"} found
      </p>

      {blogs.length === 0 ? (
        <div className="rounded-xl border border-gray-200 bg-white p-8 text-center">
          <h2 className="text-xl font-semibold text-gray-900">
            {search || communitySlug
              ? "No matching articles"
              : "No articles yet"}
          </h2>

          <p className="mt-2 text-gray-600">
            {search || communitySlug
              ? "Try changing or clearing your search filters."
              : "Be the first developer to publish an article."}
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

      {totalPages > 1 && (
        <nav
          aria-label="Blog pagination"
          className="mt-10 flex items-center justify-center gap-4"
        >
          {page > 1 ? (
            <Link
              href={pageHref(page - 1)}
              className="rounded-lg border border-gray-300 px-4 py-2 font-medium"
            >
              Previous
            </Link>
          ) : (
            <span className="rounded-lg border border-gray-200 px-4 py-2 text-gray-400">
              Previous
            </span>
          )}

          <span className="text-sm text-gray-600">
            Page {page} of {totalPages}
          </span>

          {page < totalPages ? (
            <Link
              href={pageHref(page + 1)}
              className="rounded-lg border border-gray-300 px-4 py-2 font-medium"
            >
              Next
            </Link>
          ) : (
            <span className="rounded-lg border border-gray-200 px-4 py-2 text-gray-400">
              Next
            </span>
          )}
        </nav>
      )}
    </main>
  );
}