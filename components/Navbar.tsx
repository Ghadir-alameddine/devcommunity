import Link from "next/link";
import { auth, signIn, signOut } from "@/auth";

export default async function Navbar() {
  const session = await auth();

  return (
    <header className="border-b border-gray-200 bg-white">
      <nav className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-6 py-4">
        <Link href="/" className="text-xl font-bold text-blue-600">
          DevCommunity
        </Link>

        <div className="flex flex-wrap items-center gap-5">
          <Link href="/communities">Communities</Link>
          <Link href="/blogs">Blogs</Link>
          <Link href="/dashboard">Dashboard</Link>
          <Link href="/bookmarks">Bookmarks</Link>
          <Link href="/settings">Settings</Link>

          {session?.user ? (
            <form
              action={async () => {
                "use server";
                await signOut({ redirectTo: "/" });
              }}
            >
              <button type="submit">Sign out</button>
            </form>
          ) : (
            <form
              action={async () => {
                "use server";
                await signIn("github");
              }}
            >
              <button type="submit">Sign in</button>
            </form>
          )}
        </div>
      </nav>
    </header>
  );
}