import { connectToDatabase } from "@/lib/mongodb";
import User from "@/models/User";
import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [GitHub,Google],

  callbacks: {
   async signIn({ user, account, profile }) {
  const githubId = account?.providerAccountId;
const email =
  user.email ??
  (githubId ? `${githubId}@users.noreply.github.com` : null);

if (!email) {
  return false;
}

      await connectToDatabase();

      const username =
        typeof profile?.login === "string"
          ? profile.login.toLowerCase()
          : email.split("@")[0].toLowerCase();

      await User.findOneAndUpdate(
        { email:email.toLowerCase() },
        {
          $set: {
            name: user.name ?? username,
            image: user.image,
          },
          $setOnInsert: {
            username,
            skills: [],
          },
        },
        {
          upsert: true,
          new: true,
          runValidators: true,
        }
      );

      return true;
    },
  },
});