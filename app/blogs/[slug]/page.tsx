type blogsPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function Page({ params }: blogsPageProps) {
  const { slug } = await params;

  return(
    <main>
        <h1>Blog Details</h1>
        <p>Blog slug:{slug}</p>
    </main>
  )
}