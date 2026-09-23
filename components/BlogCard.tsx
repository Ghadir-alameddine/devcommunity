import Link from "next/link";

type BlogCardProps = {
  title: string;
  slug: string;
  author: string;
  createdAt: string;
  tags: string[];
};

export default function BlogCard({
  title,
  slug,
  author,
  createdAt,
  tags,
}: BlogCardProps) {
  return (
    <article className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="text-sm text-gray-500">
        <span>{author}</span>
        <span> · {createdAt}</span>
      </div>

      <h2 className="mt-3 text-xl font-semibold text-gray-900">{title}</h2>

      <div className="mt-4 flex flex-wrap gap-2">
        {tags.map((tag) => (
          <span
            key={tag}
            className="rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-700"
          >
            #{tag}
          </span>
        ))}
      </div>

      <Link
        href={`/blogs/${slug}`}
        className="mt-5 inline-block font-medium text-blue-600 hover:text-blue-800"
      >
        Read article
      </Link>
    </article>
  );
}