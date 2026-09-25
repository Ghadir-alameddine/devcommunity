import Link from "next/link";

type EditArticlePageProps = {
  params: Promise<{ slug: string }>;
};

export default async function EditArticlePage({
  params,
}: EditArticlePageProps) {
  const { slug } = await params;

  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-12">
      <section>
        <h1 className="text-3xl font-bold text-gray-900">
          Edit Article
        </h1>

        <p className="mt-2 text-gray-600">
          Update your article information and content.
        </p>
      </section>

      <form className="mt-8 space-y-6 rounded-xl border border-gray-200 bg-white p-6">
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
            defaultValue="Understanding Dynamic Routes in Next.js"
            className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3"
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
            defaultValue="nextjs-developers"
            className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3"
          >
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
            defaultValue="Next.js, TypeScript, Routing"
            className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3"
          />
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
            defaultValue="Dynamic routes allow us to create pages using URL parameters."
            className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3"
          />
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            type="submit"
            className="rounded-lg bg-blue-600 px-5 py-3 font-medium text-white"
          >
            Save Changes
          </button>

          <Link
            href={`/blogs/${slug}`}
            className="rounded-lg border border-gray-300 px-5 py-3 font-medium"
          >
            Cancel
          </Link>
        </div>
      </form>
    </main>
  );
}