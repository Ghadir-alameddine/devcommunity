import CommunityCard from "@/components/CommunityCard";
import { connectToDatabase } from "@/lib/mongodb";
import Community from "@/models/Community";

export const dynamic = "force-dynamic";

export default async function CommunitiesPage() {
  await connectToDatabase();

  const communities = await Community.find({})
    .sort({ createdAt: -1 })
    .lean();

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-12">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-gray-900">
          Communities
        </h1>

        <p className="mt-3 text-gray-600">
          Explore communities and connect with developers who share your
          interests.
        </p>
      </div>

      {communities.length === 0 ? (
        <p className="rounded-xl border border-gray-200 p-6 text-gray-600">
          No communities are available yet.
        </p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {communities.map((community) => (
            <CommunityCard
              key={community._id.toString()}
              name={community.name}
              slug={community.slug}
              description={community.description}
              topics={community.topics ?? []}
            />
          ))}
        </div>
      )}
    </main>
  );
}