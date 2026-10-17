import { auth } from "@/auth";
import { connectToDatabase } from "@/lib/mongodb";
import Community from "@/models/Community";
import Post from "@/models/Post";
import User from "@/models/User";
import { postSchema } from "@/schemas/post";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

// GET /api/posts/[id]
export async function GET(
  request: NextRequest,
  { params }: RouteContext
) {
  try {
    const { id } = await params;

    if (!mongoose.isValidObjectId(id)) {
      return NextResponse.json(
        { message: "Invalid post ID." },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const post = await Post.findOne({
      _id: id,
      published: true,
    })
      .populate("author", "name username ")
      .populate("community", "name slug")
      .lean();

    if (!post) {
      return NextResponse.json(
        { message: "Post was not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({ post }, { status: 200 });
  } catch (error) {
    console.error("GET /api/posts/[id] error:", error);

    return NextResponse.json(
      { message: "Unable to load the post." },
      { status: 500 }
    );
  }
}

// PATCH /api/posts/[id]
export async function PATCH(
  request: NextRequest,
  { params }: RouteContext
) {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json(
        { message: "You must sign in first." },
        { status: 401 }
      );
    }

    const { id } = await params;

    if (!mongoose.isValidObjectId(id)) {
      return NextResponse.json(
        { message: "Invalid post ID." },
        { status: 400 }
      );
    }

    const body = await request.json();
    const validation = postSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          message: "Invalid post data.",
          errors: validation.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const user = await User.findOne({
      email: session.user.email.toLowerCase(),
    });

    if (!user) {
      return NextResponse.json(
        { message: "User account was not found." },
        { status: 404 }
      );
    }

    const post = await Post.findById(id);

    if (!post) {
      return NextResponse.json(
        { message: "Post was not found." },
        { status: 404 }
      );
    }

    if (post.author.toString() !== user._id.toString()) {
      return NextResponse.json(
        { message: "You cannot edit another user's post." },
        { status: 403 }
      );
    }

    const community = await Community.findOne({
      slug: validation.data.community,
    });

    if (!community) {
      return NextResponse.json(
        { message: "Community was not found." },
        { status: 404 }
      );
    }

    const tags = validation.data.tags
      ? validation.data.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean)
      : [];

    post.title = validation.data.title;
    post.content = validation.data.content;
    post.community = community._id;
    post.tags = tags;

    await post.save();

    return NextResponse.json(
      {
        message: "Post updated successfully.",
        post,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("PATCH /api/posts/[id] error:", error);

    return NextResponse.json(
      { message: "Unable to update the post." },
      { status: 500 }
    );
  }
}

// DELETE /api/posts/[id]
export async function DELETE(
  request: NextRequest,
  { params }: RouteContext
) {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json(
        { message: "You must sign in first." },
        { status: 401 }
      );
    }

    const { id } = await params;

    if (!mongoose.isValidObjectId(id)) {
      return NextResponse.json(
        { message: "Invalid post ID." },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const user = await User.findOne({
      email: session.user.email.toLowerCase(),
    });

    if (!user) {
      return NextResponse.json(
        { message: "User account was not found." },
        { status: 404 }
      );
    }

    const post = await Post.findById(id);

    if (!post) {
      return NextResponse.json(
        { message: "Post was not found." },
        { status: 404 }
      );
    }

    if (post.author.toString() !== user._id.toString()) {
      return NextResponse.json(
        { message: "You cannot delete another user's post." },
        { status: 403 }
      );
    }

    await post.deleteOne();

    return NextResponse.json(
      { message: "Post deleted successfully." },
      { status: 200 }
    );
  } catch (error) {
    console.error("DELETE /api/posts/[id] error:", error);

    return NextResponse.json(
      { message: "Unable to delete the post." },
      { status: 500 }
    );
  }
}