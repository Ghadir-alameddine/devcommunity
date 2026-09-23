type EditBlogPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function EditBlogPage({
  params,
}: EditBlogPageProps) {
  const { slug } = await params;

  return (
    <main>
      <h1>Edit Blog</h1>
      <p>Editing blog: {slug}</p>
    </main>
  );
}