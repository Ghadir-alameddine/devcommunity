import Link from "next/link";

export default function Navbar() {
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
        </div>
      </nav>
    </header>
  );
}