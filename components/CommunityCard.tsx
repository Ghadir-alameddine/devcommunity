import Link from "next/link";

type CommunityCardProps = {
  name: string;
  slug: string;
  description: string;
  topics: string[];
};

export default function CommunityCard({
  name,
  slug,
  description,
  topics,
}: CommunityCardProps) {
  return (
    <article className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <h2 className="text-xl font-semibold text-gray-900">{name}</h2>

      <p className="mt-2 text-gray-600">{description}</p>

      <div className="mt-4 flex flex-wrap gap-2">
        {topics.map((topic) => (
          <span
            key={topic}
            className="rounded-full bg-blue-50 px-3 py-1 text-sm text-blue-700"
          >
            {topic}
          </span>
        ))}
      </div>

      <Link
        href={`/communities/${slug}`}
        className="mt-5 inline-block font-medium text-blue-600 hover:text-blue-800"
      >
        View community
      </Link>
    </article>
  );
}