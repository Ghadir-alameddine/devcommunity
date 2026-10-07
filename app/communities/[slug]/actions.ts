"use server";

import { auth } from "@/auth";
import { connectToDatabase } from "@/lib/mongodb";
import Community from "@/models/Community";
import User from "@/models/User";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { Types } from "mongoose";

export async function toggleCommunityMembership(slug: string) {
  const session = await auth();

  if (!session?.user?.email) {
    redirect("/api/auth/signin");
  }

  await connectToDatabase();

  const user = await User.findOne({
    email: session.user.email.toLowerCase(),
  });

  if (!user) {
    throw new Error("User account was not found.");
  }

  const community = await Community.findOne({ slug });

  if (!community) {
    throw new Error("Community was not found.");
  }

const isMember = community.members.some(
  (memberId: Types.ObjectId) =>
    memberId.toString() === user._id.toString()
);
  if (isMember) {
    await Community.updateOne(
      { _id: community._id },
      {
        $pull: {
          members: user._id,
        },
      }
    );
  } else {
    await Community.updateOne(
      { _id: community._id },
      {
        $addToSet: {
          members: user._id,
        },
      }
    );
  }

  revalidatePath(`/communities/${slug}`);
  revalidatePath("/communities");
}