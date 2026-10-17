import { auth } from "@/auth";
import { connectToDatabase } from "@/lib/mongodb";
import Community from "@/models/Community";
import Post from "@/models/Post";
import User from "@/models/User";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { updatePost } from "./actions";

type EditArticlePageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function EditArticlePage({
  params,
}: EditArticlePageProps) {
  const session = await auth();

  if (!session?.user?.email) {
    redirect("/api/auth/signin");
  }

  const { slug } = await params;

  await connectToDatabase();

  const user = await User.findOne({
    email: session.user.email.toLowerCase(),
  });

  if (!user) {
    redirect("/api/auth/signin");
  }

  const post = await Post.findOne({ slug });

  if (!post) {
    notFound();
  }

  if (post.author.toString() !== user._id.toString()) {
    notFound();
  }

  const [communities, currentCommunity] = await Promise.all([
    Community.find({}).sort({ name: 1 }),
    Community.findById(post.community),
  ]);

  if (!currentCommunity) {
    notFound();
  }

  const updatePostWithSlug = updatePost.bind(null, slug);

  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-12">
      <section>
        <h1 className="text-3xl font-bold text-gray-900">
          Edit Article
        </h1>

        <p className="mt-2 text-gray-600">
          Update your article information and content.
        </p>
      </section>

      <form
        action={updatePostWithSlug}
        className="mt-8 space-y-6 rounded-xl border border-gray-200 bg-white p-6"
      >
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700"
          >
            Article title
          </label>

          <input
            id="title"
            name="title"
            type="text"
            defaultValue={post.title}
            required
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
            defaultValue={currentCommunity.slug}
            required
            className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3"
          >
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

        <div>
          <label
            htmlFor="tags"
            className="block text-sm font-medium text-gray-700"
          >
            Tags
          </label>

          <input
            id="tags"
            name="tags"
            type="text"
            defaultValue={post.tags.join(", ")}
            className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3"
          />
        </div>

        <div>
          <label
            htmlFor="content"
            className="block text-sm font-medium text-gray-700"
          >
            Article content
          </label>

          <textarea
            id="content"
            name="content"
            rows={12}
            defaultValue={post.content}
            required
            className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3"
          />
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            type="submit"
            className="rounded-lg bg-blue-600 px-5 py-3 font-medium text-white"
          >
            Save Changes
          </button>

          <Link
            href={`/blogs/${slug}`}
            className="rounded-lg border border-gray-300 px-5 py-3 font-medium"
          >
            Cancel
          </Link>
        </div>
      </form>
    </main>
  );
}