"use server";

import { auth } from "@/auth";
import { connectToDatabase } from "@/lib/mongodb";
import Community from "@/models/Community";
import Post from "@/models/Post";
import User from "@/models/User";
import { postSchema } from "@/schemas/post";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

function createSlug(title: string) {
  const baseSlug = title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

  return `${baseSlug || "article"}-${Date.now()}`;
}

export async function createPost(formData: FormData) {
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
    throw new Error(result.error.issues[0]?.message ?? "Invalid article data.");
  }

  await connectToDatabase();

  const user = await User.findOne({
    email: session.user.email.toLowerCase(),
  });

  if (!user) {
    throw new Error("Authenticated user was not found.");
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

  const post = await Post.create({
    title: result.data.title,
    slug: createSlug(result.data.title),
    content: result.data.content,
    author: user._id,
    community: community._id,
    tags: [...new Set(tags)],
    published: true,
  });

  revalidatePath("/blogs");
  redirect(`/blogs/${post.slug}`);
}