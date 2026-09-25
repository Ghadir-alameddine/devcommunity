export default function SettingsPage() {
  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-12">
      <section>
        <h1 className="text-3xl font-bold text-gray-900">
          Profile Settings
        </h1>

        <p className="mt-2 text-gray-600">
          Update your public developer profile.
        </p>
      </section>

      <form className="mt-8 space-y-6 rounded-xl border border-gray-200 bg-white p-6">
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700"
          >
            Full name
          </label>

          <input
            id="name"
            name="name"
            type="text"
            defaultValue="Ghadir Alameddine"
            className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3"
          />
        </div>

        <div>
          <label
            htmlFor="username"
            className="block text-sm font-medium text-gray-700"
          >
            Username
          </label>

          <input
            id="username"
            name="username"
            type="text"
            defaultValue="ghadir-alameddine"
            className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3"
          />
        </div>

        <div>
  <label
    htmlFor="location"
    className="block text-sm font-medium text-gray-700"
  >
    Location
  </label>

  <input
    id="location"
    name="location"
    type="text"
    defaultValue="Lebanon"
    className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3"
  />
</div>

<div>
  <label
    htmlFor="bio"
    className="block text-sm font-medium text-gray-700"
  >
    Bio
  </label>

  <textarea
    id="bio"
    name="bio"
    rows={4}
    defaultValue="CCE student and full-stack developer."
    className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3"
  />
</div>

<div>
  <label
    htmlFor="skills"
    className="block text-sm font-medium text-gray-700"
  >
    Skills
  </label>

  <input
    id="skills"
    name="skills"
    type="text"
    defaultValue="Next.js, TypeScript, React, MongoDB"
    className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3"
  />

  <p className="mt-2 text-sm text-gray-500">
    Separate each skill with a comma.
  </p>
</div>

        <button
          type="submit"
          className="rounded-lg bg-blue-600 px-5 py-3 font-medium text-white"
        >
          Save Changes
        </button>

        
      </form>
    </main>
  );
}