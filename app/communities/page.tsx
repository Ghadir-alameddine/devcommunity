import CommunityCard from "@/components/CommunityCard";

const communities = [
  {
    name: "Next.js Developers",
    slug: "nextjs-developers",
    description: "Learn, discuss and build applications with Next.js.",
    topics: ["Next.js", "React", "TypeScript"],
  },
  {
    name: "Python Developers",
    slug: "python-developers",
    description: "Share Python knowledge, projects and useful resources.",
    topics: ["Python", "Django", "Data"],
  },
  {
    name: "DevOps Community",
    slug: "devops-community",
    description: "Explore deployment, cloud services and automation.",
    topics: ["Docker", "AWS", "CI/CD"],
  },
];

export default function CommunitiesPage() {
  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-12">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-gray-900">Communities</h1>
        <p className="mt-3 text-gray-600">
          Explore communities and connect with developers who share your
          interests.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {communities.map((community) => (
          <CommunityCard
            key={community.slug}
            name={community.name}
            slug={community.slug}
            description={community.description}
            topics={community.topics}
          />
        ))}
      </div>
    </main>
  );
}