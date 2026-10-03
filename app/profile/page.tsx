import { auth } from "@/auth";
import { connectToDatabase } from "@/lib/mongodb";
import User from "@/models/User";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function ProfilePage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/api/auth/signin");
  }

  if (!session.user.email) {
    redirect("/api/auth/signin");
  }

  await connectToDatabase();

  const user = await User.findOne({
    email: session.user.email.toLowerCase(),
  }).lean();

  if (!user) {
    redirect("/api/auth/signin");
  }

  return (
    <main className="mx-auto w-full max-w-4xl flex-1 px-6 py-12">
      <section className="rounded-xl border border-gray-200 bg-white p-8">
        <h1 className="text-3xl font-bold text-gray-900">{user.name}</h1>

        <p className="mt-2 text-gray-600">@{user.username}</p>

        <p className="mt-6 text-gray-700">
          {user.bio || "No bio added yet."}
        </p>

        <p className="mt-3 text-gray-600">
          {user.location || "No location added yet."}
        </p>

        <div className="mt-6">
          <h2 className="font-semibold text-gray-900">Skills</h2>

          {user.skills.length > 0 ? (
            <div className="mt-3 flex flex-wrap gap-2">
              {user.skills.map((skill: string) => (
                <span
                  key={skill}
                  className="rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-700"
                >
                  {skill}
                </span>
              ))}
            </div>
          ) : (
            <p className="mt-2 text-gray-600">No skills added yet.</p>
          )}
        </div>

        <Link
          href="/settings"
          className="mt-8 inline-block rounded-lg bg-blue-600 px-5 py-3 font-medium text-white"
        >
          Edit Profile
        </Link>
      </section>
    </main>
  );
}