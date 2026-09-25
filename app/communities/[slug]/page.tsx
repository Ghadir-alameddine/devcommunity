import Link from "next/link";
import { notFound } from "next/navigation";

const communities = [
  {
    name: "Next.js Developers",
    slug: "nextjs-developers",
    description: "Learn, discuss and build applications with Next.js.",
    topics: ["Next.js", "React", "TypeScript"],
    members: 1240,
    creator: "Ghadir Alameddine",
  },
  {
    name: "Python Developers",
    slug: "python-developers",
    description: "Share Python knowledge, projects and useful resources.",
    topics: ["Python", "Django", "Data"],
    members: 980,
    creator: "Maya Haddad",
  },
  {
    name: "DevOps Community",
    slug: "devops-community",
    description: "Explore deployment, cloud services and automation.",
    topics: ["Docker", "AWS", "CI/CD"],
    members: 760,
    creator: "Karim Ali",
  },
];

type CommunityPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function CommunityPage({
  params,
}: CommunityPageProps) {
  const { slug } = await params;

  const community = communities.find(
    (community) => community.slug === slug
  );

  if (!community) {
    notFound();
  }

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-12">
      <section className="rounded-2xl border border-gray-200 bg-white p-8">
        <div className="flex flex-col justify-between gap-6 md:flex-row">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {community.name}
            </h1>

            <p className="mt-4 max-w-2xl text-gray-600">
              {community.description}
            </p>

            <p className="mt-4 text-sm text-gray-500">
              {community.members} members · Created by {community.creator}
            </p>
          </div>

          <button className="h-fit rounded-lg bg-blue-600 px-6 py-3 font-medium text-white">
            Join Community
          </button>
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
          {community.topics.map((topic) => (
            <span
              key={topic}
              className="rounded-full bg-blue-50 px-3 py-1 text-sm text-blue-700"
            >
              {topic}
            </span>
          ))}
        </div>
      </section>

      <section className="mt-12">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Recent Articles</h2>

          <Link href="/blogs" className="font-medium text-blue-600">
            View all blogs
          </Link>
        </div>

        <p className="mt-6 rounded-xl border border-gray-200 p-6 text-gray-600">
          Community articles will appear here.
        </p>
      </section>
    </main>
  );
}