"use server";

import { auth } from "@/auth";
import { connectToDatabase } from "@/lib/mongodb";
import Post from "@/models/Post";
import User from "@/models/User";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function deletePost(slug: string) {
  const session = await auth();

  if (!session?.user?.email) {
    redirect("/api/auth/signin");
  }

  await connectToDatabase();

  const user = await User.findOne({
    email: session.user.email.toLowerCase(),
  });

  if (!user) {
    throw new Error("Authenticated user was not found.");
  }

  const post = await Post.findOne({ slug });

  if (!post) {
    throw new Error("Article was not found.");
  }

  if (post.author.toString() !== user._id.toString()) {
    throw new Error("Forbidden: you do not own this article.");
  }

  await post.deleteOne();

  revalidatePath("/blogs");
  redirect("/blogs");
}