import { auth } from "@/auth";
import { connectToDatabase } from "@/lib/mongodb";
import "@/models/Community";
import Comment from "@/models/Comment";
import Post from "@/models/Post";

import Link from "next/link";
import { notFound } from "next/navigation";
import { deletePost } from "./actions";
import Bookmark from "@/models/Bookmark";
import User from "@/models/User";
import { toggleBookmark } from "./bookmark-actions";
import {
  createComment,
  deleteComment,
} from "./comments-actions";

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

export default async function BlogPage({
  params,
}: BlogPageProps) {
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
  const currentUser = session?.user?.email
  ? await User.findOne({
      email: session.user.email.toLowerCase(),
    })
  : null;

const isBookmarked = currentUser
  ? Boolean(
      await Bookmark.exists({
        user: currentUser._id,
        post: blog._id,
      })
    )
  : false;

  const comments = await Comment.find({
    post: blog._id,
  })
    .populate<{ author: PopulatedAuthor }>(
      "author",
      "name username email"
    )
    .sort({ createdAt: -1 });

  const isOwner =
    session?.user?.email?.toLowerCase() ===
    blog.author.email?.toLowerCase();

  const deletePostWithSlug = deletePost.bind(null, slug);
  const createCommentForPost = createComment.bind(null, slug);
  const toggleBookmarkForPost = toggleBookmark.bind(null, slug);

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
        <form action={toggleBookmarkForPost}>
  <button
    type="submit"
    className={`rounded-lg border px-5 py-2 font-medium ${
      isBookmarked
        ? "border-blue-600 bg-blue-50 text-blue-700"
        : "border-gray-300"
    }`}
  >
    {isBookmarked ? "Remove Bookmark" : "Bookmark"}
  </button>
</form>

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
          Comments ({comments.length})
        </h2>

        {session?.user ? (
          <form
            action={createCommentForPost}
            className="mt-6 rounded-xl border border-gray-200 bg-white p-5"
          >
            <label
              htmlFor="content"
              className="block text-sm font-medium text-gray-700"
            >
              Add a comment
            </label>

            <textarea
              id="content"
              name="content"
              rows={4}
              required
              minLength={2}
              maxLength={1000}
              placeholder="Share your thoughts..."
              className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3"
            />

            <button
              type="submit"
              className="mt-3 rounded-lg bg-blue-600 px-5 py-2 font-medium text-white"
            >
              Post Comment
            </button>
          </form>
        ) : (
          <p className="mt-6 rounded-xl border border-gray-200 p-5 text-gray-600">
            <Link
              href="/api/auth/signin"
              className="font-medium text-blue-600"
            >
              Sign in
            </Link>{" "}
            to leave a comment.
          </p>
        )}

        {comments.length === 0 ? (
          <p className="mt-6 rounded-xl border border-gray-200 p-6 text-gray-600">
            No comments yet. Be the first to comment.
          </p>
        ) : (
          <div className="mt-6 space-y-4">
            {comments.map((comment) => {
              const isCommentOwner =
                session?.user?.email?.toLowerCase() ===
                comment.author.email?.toLowerCase();

              const commentDate =
                comment.createdAt instanceof Date
                  ? comment.createdAt.toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })
                  : "";

              const deleteCommentWithId = deleteComment.bind(
                null,
                comment._id.toString(),
                slug
              );

              return (
                <article
                  key={comment._id.toString()}
                  className="rounded-xl border border-gray-200 bg-white p-5"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-medium text-gray-900">
                        {comment.author.name ??
                          comment.author.username ??
                          "Unknown developer"}
                      </p>

                      <p className="mt-1 text-sm text-gray-500">
                        {commentDate}
                      </p>
                    </div>

                    {isCommentOwner && (
                      <form action={deleteCommentWithId}>
                        <button
                          type="submit"
                          className="text-sm font-medium text-red-600"
                        >
                          Delete
                        </button>
                      </form>
                    )}
                  </div>

                  <p className="mt-4 whitespace-pre-wrap text-gray-700">
                    {comment.content}
                  </p>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}