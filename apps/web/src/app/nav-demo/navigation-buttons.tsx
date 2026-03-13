"use client";

// Client Component for programmatic navigation with useRouter.
// Must be a Client Component because useRouter uses React hooks.

import { useRouter } from "next/navigation";

export function NavigationButtons() {
  const router = useRouter();

  return (
    <div className="flex gap-4">
      {/* push: adds a new entry to the history stack — back button works */}
      <button
        type="button"
        onClick={() => router.push("/nav-demo/page-a")}
        className="rounded bg-green-600 px-4 py-2 text-white hover:bg-green-700"
      >
        router.push()
      </button>

      {/* back: navigate to the previous history entry */}
      <button
        type="button"
        onClick={() => router.back()}
        className="rounded border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50"
      >
        router.back()
      </button>

      {/* replace: swaps the current history entry — back button skips it */}
      <button
        type="button"
        onClick={() => router.replace("/nav-demo/page-b")}
        className="rounded bg-orange-600 px-4 py-2 text-white hover:bg-orange-700"
      >
        router.replace()
      </button>
    </div>
  );
}
