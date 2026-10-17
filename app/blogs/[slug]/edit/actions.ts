"use server";

import { auth } from "@/auth";
import { connectToDatabase } from "@/lib/mongodb";
import Community from "@/models/Community";
import Post from "@/models/Post";
import User from "@/models/User";
import { postSchema } from "@/schemas/post";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function updatePost(
  slug: string,
  formData: FormData
) {
  const session = await auth();

  if (!session?.user?.email) {
    redirect("/api/auth/signin");
  }

  const result = postSchema.safeParse({
    title: formData.get("title"),
    community: formData.get("community"),
    tags: formData.get("tags"),
    content: formData.get("content"),
  });

  if (!result.success) {
    throw new Error(
      result.error.issues[0]?.message ?? "Invalid article data."
    );
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

  const community = await Community.findOne({
    slug: result.data.community,
  });

  if (!community) {
    throw new Error("Selected community was not found.");
  }

  const tags = (result.data.tags ?? "")
    .split(",")
    .map((tag) => tag.trim().toLowerCase())
    .filter(Boolean);

  post.title = result.data.title;
  post.content = result.data.content;
  post.community = community._id;
  post.tags = [...new Set(tags)];

  await post.save();

  revalidatePath("/blogs");
  revalidatePath(`/blogs/${slug}`);

  redirect(`/blogs/${slug}`);
}