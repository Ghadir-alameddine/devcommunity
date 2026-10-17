export default function Loading() {
  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-12">
      <div className="animate-pulse">
        <div className="h-9 w-64 rounded bg-gray-200" />
        <div className="mt-4 h-5 w-96 max-w-full rounded bg-gray-200" />

        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="h-52 rounded-xl border border-gray-200 bg-gray-100"
            />
          ))}
        </div>
      </div>
    </main>
  );
}