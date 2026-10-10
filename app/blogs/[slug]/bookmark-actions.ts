"use server";

import { auth } from "@/auth";
import { connectToDatabase } from "@/lib/mongodb";
import Bookmark from "@/models/Bookmark";
import Post from "@/models/Post";
import User from "@/models/User";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function toggleBookmark(slug: string) {
  const session = await auth();

  if (!session?.user?.email) {
    redirect("/api/auth/signin");
  }

  await connectToDatabase();

  const [user, post] = await Promise.all([
    User.findOne({
      email: session.user.email.toLowerCase(),
    }),

    Post.findOne({
      slug,
      published: true,
    }),
  ]);

  if (!user) {
    throw new Error("User account was not found.");
  }

  if (!post) {
    throw new Error("Post was not found.");
  }

  const existingBookmark = await Bookmark.findOne({
    user: user._id,
    post: post._id,
  });

  if (existingBookmark) {
    await existingBookmark.deleteOne();
  } else {
    await Bookmark.create({
      user: user._id,
      post: post._id,
    });
  }

  revalidatePath(`/blogs/${slug}`);
  revalidatePath("/bookmarks");
}