import Link from "next/link";

export default function HomePage() {
  return (
    <main className="flex-1">
      <section className="bg-blue-50 px-6 py-20 text-center">
        <div className="mx-auto max-w-4xl">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 md:text-6xl">
            Connect, learn and build with developers
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-600">
            Join developer communities, publish technical articles and discover
            people who share your interests.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              href="/communities"
              className="rounded-lg bg-blue-600 px-6 py-3 font-medium text-white hover:bg-blue-700"
            >
              Explore Communities
            </Link>

            <Link
              href="/blogs"
              className="rounded-lg border border-blue-600 px-6 py-3 font-medium text-blue-600 hover:bg-blue-100"
            >
              Read Blogs
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-bold text-gray-900">
            Everything developers need
          </h2>
          <p className="mt-3 text-gray-600">
            Explore the main areas of DevCommunity.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <Link
            href="/communities"
            className="rounded-xl border border-gray-200 p-6 transition hover:border-blue-500 hover:shadow-md"
          >
            <h3 className="text-xl font-semibold">Communities</h3>
            <p className="mt-2 text-gray-600">
              Join groups based on technologies and developer interests.
            </p>
          </Link>

          <Link
            href="/blogs"
            className="rounded-xl border border-gray-200 p-6 transition hover:border-blue-500 hover:shadow-md"
          >
            <h3 className="text-xl font-semibold">Developer Blogs</h3>
            <p className="mt-2 text-gray-600">
              Read and publish useful programming articles.
            </p>
          </Link>

          <Link
            href="/profile/ghadir-alameddine"
            className="rounded-xl border border-gray-200 p-6 transition hover:border-blue-500 hover:shadow-md"
          >
            <h3 className="text-xl font-semibold">Developer Profiles</h3>
            <p className="mt-2 text-gray-600">
              Discover developers, their skills and their published work.
            </p>
          </Link>
        </div>
      </section>
    </main>
  );
}