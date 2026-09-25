import Link from "next/link";

const statistics = [
  { label: "Published Articles", value: 3 },
  { label: "Joined Communities", value: 2 },
  { label: "Saved Articles", value: 5 },
];

const articles = [
  {
    title: "Understanding Dynamic Routes in Next.js",
    slug: "understanding-dynamic-routes",
    status: "Published",
  },
  {
    title: "My Journey Learning Full-Stack Development",
    slug: "my-full-stack-journey",
    status: "Draft",
  },
];
const communities = [
  {
    name: "Next.js Developers",
    slug: "nextjs-developers",
    role: "Member",
  },
  {
    name: "DevOps Community",
    slug: "devops-community",
    role: "Member",
  },
];

export default function DashboardPage() {
  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-12">
      <section className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, Ghadir
          </h1>

          <p className="mt-2 text-gray-600">
            Manage your articles, communities and developer profile.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link
            href="/blogs/create"
            className="rounded-lg bg-blue-600 px-5 py-3 font-medium text-white"
          >
            Create Article
          </Link>

          <Link
            href="/settings"
            className="rounded-lg border border-gray-300 px-5 py-3 font-medium"
          >
            Edit Profile
          </Link>
        </div>
      </section>
      <section className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
  {statistics.map((statistic) => (
    <div
      key={statistic.label}
      className="rounded-xl border border-gray-200 bg-white p-6"
    >
      <p className="text-sm font-medium text-gray-500">
        {statistic.label}
      </p>

      <p className="mt-3 text-3xl font-bold text-gray-900">
        {statistic.value}
      </p>
    </div>
  ))}
</section>

<section className="mt-10">
  <div className="flex items-center justify-between">
    <h2 className="text-2xl font-bold text-gray-900">My Articles</h2>

    <Link href="/blogs" className="text-sm font-medium text-blue-600">
      View all
    </Link>
  </div>

  <div className="mt-5 space-y-4">
    {articles.map((article) => (
      <div
        key={article.slug}
        className="flex items-center justify-between rounded-xl border border-gray-200 bg-white p-5"
      >
        <div>
          <h3 className="font-semibold text-gray-900">{article.title}</h3>
          <p className="mt-1 text-sm text-gray-500">{article.status}</p>
        </div>

        <Link
          href={`/blogs/${article.slug}/edit`}
          className="text-sm font-medium text-blue-600"
        >
          Edit
        </Link>
      </div>
    ))}
  </div>
</section>
<section className="mt-10">
  <div className="flex items-center justify-between">
    <h2 className="text-2xl font-bold text-gray-900">
      My Communities
    </h2>

    <Link
      href="/communities"
      className="text-sm font-medium text-blue-600"
    >
      Explore communities
    </Link>
  </div>

  <div className="mt-5 grid gap-4 sm:grid-cols-2">
    {communities.map((community) => (
      <Link
        key={community.slug}
        href={`/communities/${community.slug}`}
        className="rounded-xl border border-gray-200 bg-white p-5"
      >
        <h3 className="font-semibold text-gray-900">
          {community.name}
        </h3>

        <p className="mt-1 text-sm text-gray-500">
          {community.role}
        </p>
      </Link>
    ))}
  </div>
</section>


    </main>
  );
}