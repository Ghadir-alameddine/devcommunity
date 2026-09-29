import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function ProfilePage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/api/auth/signin");
  }

  return (
    <main>
      <h1>Profile</h1>
      <p>Developer profile!</p>
    </main>
  );
}