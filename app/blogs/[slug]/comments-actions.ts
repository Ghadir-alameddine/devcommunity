"use server";

import { auth } from "@/auth";
import { connectToDatabase } from "@/lib/mongodb";
import Comment from "@/models/Comment";
import Post from "@/models/Post";
import User from "@/models/User";
import { commentSchema } from "@/schemas/comment";
import mongoose from "mongoose";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createComment(
  slug: string,
  formData: FormData
) {
  const session = await auth();

  if (!session?.user?.email) {
    redirect("/api/auth/signin");
  }

  const validation = commentSchema.safeParse({
    content: formData.get("content"),
  });

  if (!validation.success) {
    throw new Error(
      validation.error.issues[0]?.message ?? "Invalid comment."
    );
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

  await Comment.create({
    content: validation.data.content,
    author: user._id,
    post: post._id,
  });

  revalidatePath(`/blogs/${slug}`);
}

export async function deleteComment(
  commentId: string,
  slug: string
) {
  const session = await auth();

  if (!session?.user?.email) {
    redirect("/api/auth/signin");
  }

  if (!mongoose.isValidObjectId(commentId)) {
    throw new Error("Invalid comment ID.");
  }

  await connectToDatabase();

  const user = await User.findOne({
    email: session.user.email.toLowerCase(),
  });

  if (!user) {
    throw new Error("User account was not found.");
  }

  const comment = await Comment.findById(commentId);

  if (!comment) {
    throw new Error("Comment was not found.");
  }

  if (comment.author.toString() !== user._id.toString()) {
    throw new Error("You cannot delete another user's comment.");
  }

  await comment.deleteOne();

  revalidatePath(`/blogs/${slug}`);
}