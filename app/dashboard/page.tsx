import { auth } from "@/auth";
import { connectToDatabase } from "@/lib/mongodb";
import Bookmark from "@/models/Bookmark";
import Community from "@/models/Community";
import Post from "@/models/Post";
import User from "@/models/User";
import Link from "next/link";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user?.email) {
    redirect("/api/auth/signin");
  }

  await connectToDatabase();

  const user = await User.findOne({
    email: session.user.email.toLowerCase(),
  });

  if (!user) {
    throw new Error("User account was not found.");
  }

  const [
    publishedArticles,
    savedArticles,
    joinedCommunities,
    recentArticles,
    communities,
  ] = await Promise.all([
    Post.countDocuments({
      author: user._id,
      published: true,
    }),

    Bookmark.countDocuments({
      user: user._id,
    }),

    Community.countDocuments({
      members: user._id,
    }),

    Post.find({
      author: user._id,
    })
      .sort({ createdAt: -1 })
      .limit(5),

    Community.find({
      members: user._id,
    })
      .sort({ name: 1 })
      .limit(6),
  ]);

  const statistics = [
    {
      label: "Published Articles",
      value: publishedArticles,
    },
    {
      label: "Joined Communities",
      value: joinedCommunities,
    },
    {
      label: "Saved Articles",
      value: savedArticles,
    },
  ];

  const displayName =
    user.name ??
    session.user.name ??
    user.username ??
    "Developer";

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-12">
      <section className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {displayName}
          </h1>

          <p className="mt-2 text-gray-600">
            Manage your articles, communities and developer profile.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link
            href="/blogs/create"
            className="rounded-lg bg-blue-600 px-5 py-3 font-medium text-white"
          >
            Create Article
          </Link>

          <Link
            href="/settings"
            className="rounded-lg border border-gray-300 px-5 py-3 font-medium"
          >
            Edit Profile
          </Link>
        </div>
      </section>

      <section className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {statistics.map((statistic) => (
          <div
            key={statistic.label}
            className="rounded-xl border border-gray-200 bg-white p-6"
          >
            <p className="text-sm font-medium text-gray-500">
              {statistic.label}
            </p>

            <p className="mt-3 text-3xl font-bold text-gray-900">
              {statistic.value}
            </p>
          </div>
        ))}
      </section>

      <section className="mt-10">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">
            My Articles
          </h2>

          <Link
            href="/blogs"
            className="text-sm font-medium text-blue-600"
          >
            View all
          </Link>
        </div>

        {recentArticles.length === 0 ? (
          <div className="mt-5 rounded-xl border border-gray-200 bg-white p-6">
            <p className="text-gray-600">
              You haven&apos;t published any articles yet.
            </p>

            <Link
              href="/blogs/create"
              className="mt-3 inline-block font-medium text-blue-600"
            >
              Create your first article
            </Link>
          </div>
        ) : (
          <div className="mt-5 space-y-4">
            {recentArticles.map((article) => (
              <div
                key={article._id.toString()}
                className="flex items-center justify-between rounded-xl border border-gray-200 bg-white p-5"
              >
                <div>
                  <h3 className="font-semibold text-gray-900">
                    {article.title}
                  </h3>

                  <p className="mt-1 text-sm text-gray-500">
                    {article.published ? "Published" : "Draft"}
                  </p>
                </div>

                <Link
                  href={`/blogs/${article.slug}/edit`}
                  className="text-sm font-medium text-blue-600"
                >
                  Edit
                </Link>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="mt-10">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">
            My Communities
          </h2>

          <Link
            href="/communities"
            className="text-sm font-medium text-blue-600"
          >
            Explore communities
          </Link>
        </div>

        {communities.length === 0 ? (
          <div className="mt-5 rounded-xl border border-gray-200 bg-white p-6">
            <p className="text-gray-600">
              You haven&apos;t joined any communities yet.
            </p>
          </div>
        ) : (
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            {communities.map((community) => (
              <Link
                key={community._id.toString()}
                href={`/communities/${community.slug}`}
                className="rounded-xl border border-gray-200 bg-white p-5"
              >
                <h3 className="font-semibold text-gray-900">
                  {community.name}
                </h3>

                <p className="mt-1 text-sm text-gray-500">
                  Member
                </p>
              </Link>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}