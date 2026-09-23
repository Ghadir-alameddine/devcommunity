type CommunityPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function CommunityPage({
  params,
}: CommunityPageProps) {
  const { slug } = await params;

  return (
    <main>
      <h1>Community Details</h1>
      <p>Community slug: {slug}</p>
    </main>
  );
}