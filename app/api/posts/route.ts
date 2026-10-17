import { auth } from "@/auth";
import { connectToDatabase } from "@/lib/mongodb";
import Community from "@/models/Community";
import Post from "@/models/Post";
import User from "@/models/User";
import { postSchema } from "@/schemas/post";
import { NextRequest, NextResponse } from "next/server";

function escapeRegex(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// GET /api/posts?search=next&page=1&limit=6
export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();

    const searchParams = request.nextUrl.searchParams;

    const search = searchParams.get("search")?.trim() ?? "";
    const page = Math.max(Number(searchParams.get("page")) || 1, 1);
    const limit = Math.min(
      Math.max(Number(searchParams.get("limit")) || 6, 1),
      20
    );

    const query: {
      published: boolean;
      $or?: Array<Record<string, unknown>>;
    } = {
      published: true,
    };

    if (search) {
      const searchRegex = new RegExp(escapeRegex(search), "i");

      query.$or = [
        { title: searchRegex },
        { content: searchRegex },
        { tags: searchRegex },
      ];
    }

    const [posts, totalPosts] = await Promise.all([
      Post.find(query)
        .populate("author", "name username")
        .populate("community", "name slug")
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),

      Post.countDocuments(query),
    ]);

    return NextResponse.json(
      {
        posts,
        pagination: {
          page,
          limit,
          totalPosts,
          totalPages: Math.ceil(totalPosts / limit),
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("GET /api/posts error:", error);

    return NextResponse.json(
      { message: "Unable to load posts." },
      { status: 500 }
    );
  }
}

// POST /api/posts
export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json(
        { message: "You must sign in first." },
        { status: 401 }
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

    const community = await Community.findOne({
      slug: validation.data.community,
    });

    if (!community) {
      return NextResponse.json(
        { message: "Community was not found." },
        { status: 404 }
      );
    }

    const slugBase = validation.data.title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

    const tags = validation.data.tags
      ? validation.data.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean)
      : [];

    const post = await Post.create({
      title: validation.data.title,
      slug: `${slugBase}-${Date.now()}`,
      content: validation.data.content,
      author: user._id,
      community: community._id,
      tags,
      published: true,
    });

    return NextResponse.json(
      {
        message: "Post created successfully.",
        post,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/posts error:", error);

    return NextResponse.json(
      { message: "Unable to create the post." },
      { status: 500 }
    );
  }
}