type profilePageProps = {
  params: Promise<{ username: string }>;
};

export default async function Page({ params }: profilePageProps) {
  const { username } = await params;
  return(
    <main>
        <h1>Username</h1>
        <p>profile username:{username}</p>
    </main>
  )
}