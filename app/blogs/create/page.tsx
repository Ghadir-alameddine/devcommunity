import {auth} from "@/auth";
import {redirect} from "next/navigation";
import { createPost } from "./actions";

import Link from "next/link";

export default async function CreateArticlePage() {
  const session =await auth();
  if (!session?.user){
    redirect ("/api/auth/signin");
  }
  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-12">
      <section>
        <h1 className="text-3xl font-bold text-gray-900">
          Create Article
        </h1>

        <p className="mt-2 text-gray-600">
          Share your knowledge with the developer community.
        </p>
      </section>

      <form
  action={createPost}
  className="mt-8 space-y-6 rounded-xl border border-gray-200 bg-white p-6"
>
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700"
          >
            Article title
          </label>

          <input
            id="title"
            name="title"
            type="text"
            placeholder="Enter your article title"
            className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3" required
          />
        </div>

        <div>
          <label
            htmlFor="community"
            className="block text-sm font-medium text-gray-700"
          >
            Community
          </label>

          <select
            id="community"
            name="community"
            defaultValue=""
            className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3"   required 
          >
            <option value="" disabled>
              Select a community
            </option>
            <option value="nextjs-developers">Next.js Developers</option>
            <option value="python-developers">Python Developers</option>
            <option value="devops-community">DevOps Community</option>
          </select>
        </div>

        <div>
          <label
            htmlFor="tags"
            className="block text-sm font-medium text-gray-700"
          >
            Tags
          </label>

          <input
            id="tags"
            name="tags"
            type="text"
            placeholder="Next.js, TypeScript, Routing"
            className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3"  required
          />

          <p className="mt-2 text-sm text-gray-500">
            Separate each tag with a comma.
          </p>
        </div>

        <div>
          <label
            htmlFor="content"
            className="block text-sm font-medium text-gray-700"
          >
            Article content
          </label>

          <textarea
            id="content"
            name="content"
            rows={12}
            placeholder="Write your article here..."
            className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3" required
          />
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            type="submit"
            className="rounded-lg bg-blue-600 px-5 py-3 font-medium text-white"
          >
            Publish Article
          </button>

          <Link
            href="/blogs"
            className="rounded-lg border border-gray-300 px-5 py-3 font-medium"
          >
            Cancel
          </Link>
        </div>
      </form>
    </main>
  );
}