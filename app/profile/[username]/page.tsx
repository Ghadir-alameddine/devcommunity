import Link from "next/link";
import { notFound } from "next/navigation";

const developers = [
  {
    name: "Ghadir Alameddine",
    username: "ghadir-alameddine",
    location: "Lebanon",
    bio: "Computer and Communication Engineering student building full-stack applications.",
    skills: ["Next.js", "TypeScript", "React", "MongoDB"],
    communities: [
      { name: "Next.js Developers", slug: "nextjs-developers" },
      { name: "DevOps Community", slug: "devops-community" },
    ],
    articles: [
      {
        title: "Understanding Dynamic Routes in Next.js",
        slug: "understanding-dynamic-routes",
      },
    ],
  },
];

type ProfilePageProps = {
  params: Promise<{
    username: string;
  }>;
};

export default async function ProfilePage({
  params,
}: ProfilePageProps) {
  const { username } = await params;

  const developer = developers.find(
    (developer) => developer.username === username
  );

  if (!developer) {
    notFound();
  }

  return (
    <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-12">
      <section className="rounded-2xl border border-gray-200 bg-white p-8">
        <div className="flex flex-col justify-between gap-6 md:flex-row">
          <div>
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 text-xl font-bold text-blue-700">
              GA
            </div>

            <h1 className="mt-5 text-3xl font-bold text-gray-900">
              {developer.name}
            </h1>

            <p className="mt-1 text-gray-500">@{developer.username}</p>
            <p className="mt-2 text-sm text-gray-500">{developer.location}</p>

            <p className="mt-5 max-w-2xl text-gray-700">{developer.bio}</p>
          </div>

          <Link
            href="/settings"
            className="h-fit rounded-lg border border-gray-300 px-5 py-2 font-medium"
          >
            Edit Profile
          </Link>
        </div>

        <div className="mt-7 flex flex-wrap gap-2">
          {developer.skills.map((skill) => (
            <span
              key={skill}
              className="rounded-full bg-blue-50 px-3 py-1 text-sm text-blue-700"
            >
              {skill}
            </span>
          ))}
        </div>
      </section>

      <div className="mt-10 grid gap-8 md:grid-cols-2">
        <section>
          <h2 className="text-2xl font-bold text-gray-900">
            Joined Communities
          </h2>

          <div className="mt-5 space-y-3">
            {developer.communities.map((community) => (
              <Link
                key={community.slug}
                href={`/communities/${community.slug}`}
                className="block rounded-xl border border-gray-200 p-5 hover:border-blue-500"
              >
                {community.name}
              </Link>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900">
            Published Articles
          </h2>

          <div className="mt-5 space-y-3">
            {developer.articles.map((article) => (
              <Link
                key={article.slug}
                href={`/blogs/${article.slug}`}
                className="block rounded-xl border border-gray-200 p-5 hover:border-blue-500"
              >
                {article.title}
              </Link>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}