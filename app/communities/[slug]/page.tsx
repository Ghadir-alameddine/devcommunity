import BlogCard from "@/components/BlogCard";
import { connectToDatabase } from "@/lib/mongodb";
import Community from "@/models/Community";
import Post from "@/models/Post";

import Link from "next/link";
import { notFound } from "next/navigation";
import { auth } from "@/auth";
import User from "@/models/User";
import { Types } from "mongoose";
import { toggleCommunityMembership } from "./actions";

export const dynamic = "force-dynamic";

type CommunityPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

type PopulatedCreator = {
  name?: string;
  username?: string;
};

type PopulatedAuthor = {
  name?: string;
  username?: string;
};

export default async function CommunityPage({
  params,
}: CommunityPageProps) {
  const { slug } = await params;

  const session = await auth();

  await connectToDatabase();

  const community = await Community.findOne({ slug }).populate<{
    createdBy: PopulatedCreator;
  }>("createdBy", "name username");

  if (!community) {
    notFound();
  }
  let isMember = false;

if (session?.user?.email) {
  const user = await User.findOne({
    email: session.user.email.toLowerCase(),
  });

  if (user) {
    isMember = community.members.some(
      (memberId: Types.ObjectId) =>
        memberId.toString() === user._id.toString()
    );
  }
}

const toggleMembershipWithSlug =
  toggleCommunityMembership.bind(null, slug);

  const posts = await Post.find({
    community: community._id,
    published: true,
  })
    .populate<{ author: PopulatedAuthor }>(
      "author",
      "name username"
    )
    .sort({ createdAt: -1 })
    .limit(6);

  const creatorName =
    community.createdBy?.name ??
    community.createdBy?.username ??
    "Unknown developer";

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-12">
      <section className="rounded-2xl border border-gray-200 bg-white p-8">
        <div className="flex flex-col justify-between gap-6 md:flex-row">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {community.name}
            </h1>

            <p className="mt-4 max-w-2xl text-gray-600">
              {community.description}
            </p>

            <p className="mt-4 text-sm text-gray-500">
              {community.members?.length ?? 0} members · Created by{" "}
              {creatorName}
            </p>
          </div>

       <form action={toggleMembershipWithSlug}>
  <button
    type="submit"
    className={`h-fit rounded-lg px-6 py-3 font-medium ${
      isMember
        ? "border border-red-300 text-red-600"
        : "bg-blue-600 text-white"
    }`}
  >
    {isMember ? "Leave Community" : "Join Community"}
  </button>
</form>
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
          {(community.topics ?? []).map((topic: string) => (
            <span
              key={topic}
              className="rounded-full bg-blue-50 px-3 py-1 text-sm text-blue-700"
            >
              {topic}
            </span>
          ))}
        </div>
      </section>

      <section className="mt-12">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">
            Recent Articles
          </h2>

          <Link href="/blogs" className="font-medium text-blue-600">
            View all blogs
          </Link>
        </div>

        {posts.length === 0 ? (
          <p className="mt-6 rounded-xl border border-gray-200 p-6 text-gray-600">
            No articles have been published in this community yet.
          </p>
        ) : (
          <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <BlogCard
                key={post._id.toString()}
                title={post.title}
                slug={post.slug}
                author={
                  post.author?.name ??
                  post.author?.username ??
                  "Unknown developer"
                }
                createdAt={
                  post.createdAt?.toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  }) ?? ""
                }
                tags={post.tags}
              />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}