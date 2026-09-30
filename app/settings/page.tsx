import { auth } from "@/auth";
import { connectToDatabase } from "@/lib/mongodb";
import User from "@/models/User";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

async function updateProfile(formData: FormData) {
  "use server";

  const session = await auth();

  if (!session?.user?.email) {
    redirect("/api/auth/signin");
  }

  const name = String(formData.get("name") ?? "").trim();
  const username = String(formData.get("username") ?? "")
    .trim()
    .toLowerCase();
  const location = String(formData.get("location") ?? "").trim();
  const bio = String(formData.get("bio") ?? "").trim();

  const skills = String(formData.get("skills") ?? "")
    .split(",")
    .map((skill) => skill.trim())
    .filter(Boolean);

  await connectToDatabase();

  await User.findOneAndUpdate(
    { email: session.user.email.toLowerCase() },
    {
      name,
      username,
      location,
      bio,
      skills,
    },
    {
      runValidators: true,
    }
  );

  revalidatePath("/profile");
  revalidatePath(`/profile/${username}`);
  redirect("/profile");
}

export default async function SettingsPage() {
  const session = await auth();

  if (!session?.user?.email) {
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
    <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-12">
      <section>
        <h1 className="text-3xl font-bold text-gray-900">
          Profile Settings
        </h1>

        <p className="mt-2 text-gray-600">
          Update your public developer profile.
        </p>
      </section>

      <form
        action={updateProfile}
        className="mt-8 space-y-6 rounded-xl border border-gray-200 bg-white p-6"
      >
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700"
          >
            Full name
          </label>

          <input
            id="name"
            name="name"
            type="text"
            required
            defaultValue={user.name}
            className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3"
          />
        </div>

        <div>
          <label
            htmlFor="username"
            className="block text-sm font-medium text-gray-700"
          >
            Username
          </label>

          <input
            id="username"
            name="username"
            type="text"
            required
            defaultValue={user.username}
            className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3"
          />
        </div>

        <div>
          <label
            htmlFor="location"
            className="block text-sm font-medium text-gray-700"
          >
            Location
          </label>

          <input
            id="location"
            name="location"
            type="text"
            defaultValue={user.location ?? ""}
            className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3"
          />
        </div>

        <div>
          <label
            htmlFor="bio"
            className="block text-sm font-medium text-gray-700"
          >
            Bio
          </label>

          <textarea
            id="bio"
            name="bio"
            rows={4}
            defaultValue={user.bio ?? ""}
            className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3"
          />
        </div>

        <div>
          <label
            htmlFor="skills"
            className="block text-sm font-medium text-gray-700"
          >
            Skills
          </label>

          <input
            id="skills"
            name="skills"
            type="text"
            defaultValue={user.skills.join(", ")}
            className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3"
          />

          <p className="mt-2 text-sm text-gray-500">
            Separate each skill with a comma.
          </p>
        </div>

        <button
          type="submit"
          className="rounded-lg bg-blue-600 px-5 py-3 font-medium text-white"
        >
          Save Changes
        </button>
      </form>
    </main>
  );
}