import { fetchPosts, fetchUser } from "../data";

// A flaky version of fetchStats that fails ~50% of the time
async function fetchStatsFlaky(): Promise<{ views: number; likes: number }> {
  await new Promise((resolve) => setTimeout(resolve, 250));
  if (Math.random() > 0.5) {
    throw new Error("Stats service temporarily unavailable");
  }
  return { views: 1234, likes: 567 };
}

async function fetchDashboardData() {
  // Promise.allSettled never rejects — it returns the status of each promise.
  // Each result is either { status: "fulfilled", value: ... }
  // or { status: "rejected", reason: ... }
  const results = await Promise.allSettled([
    fetchUser(),
    fetchPosts(),
    fetchStatsFlaky(),
  ]);

  // Extract successful results, provide fallbacks for failures
  const user =
    results[0].status === "fulfilled"
      ? results[0].value
      : { name: "Guest", email: "" };

  const posts = results[1].status === "fulfilled" ? results[1].value : [];

  const stats =
    results[2].status === "fulfilled"
      ? results[2].value
      : { views: 0, likes: 0 };

  // Track which fetches failed so we can show warnings in the UI
  const failures = results
    .map((result, index) => {
      if (result.status === "rejected") {
        const labels = ["User", "Posts", "Stats"];
        return { source: labels[index], reason: String(result.reason) };
      }
      return null;
    })
    .filter(Boolean);

  return { user, posts, stats, failures };
}

export default async function ResilientDemoPage() {
  const { user, posts, stats, failures } = await fetchDashboardData();

  return (
    <main className="mx-auto max-w-2xl p-8">
      <h1 className="mb-6 font-bold text-3xl">
        Resilient Fetching (Promise.allSettled)
      </h1>

      {/* Show warnings for any failed fetches */}
      {failures.length > 0 && (
        <div className="mb-6 rounded-lg border-2 border-amber-200 bg-amber-50 p-4">
          <h2 className="font-semibold text-amber-800">Partial Data</h2>
          <p className="text-amber-700 text-sm">
            Some data sources failed. Showing fallback values:
          </p>
          <ul className="mt-2 list-inside list-disc text-amber-600 text-sm">
            {failures.map((f) => (
              <li key={f!.source}>
                {f!.source}: {f!.reason}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Success banner when everything loads */}
      {failures.length === 0 && (
        <div className="mb-6 rounded-lg border-2 border-green-200 bg-green-50 p-4">
          <p className="text-green-700">All data loaded successfully.</p>
        </div>
      )}

      <div className="space-y-6">
        <div className="rounded-lg border p-4">
          <h2 className="mb-2 font-semibold">User</h2>
          <p>Name: {user.name}</p>
          {user.email && <p>Email: {user.email}</p>}
        </div>

        <div className="rounded-lg border p-4">
          <h2 className="mb-2 font-semibold">Posts</h2>
          {posts.length > 0 ? (
            <ul className="list-inside list-disc">
              {posts.map((post) => (
                <li key={post.id}>{post.title}</li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No posts available.</p>
          )}
        </div>

        <div className="rounded-lg border p-4">
          <h2 className="mb-2 font-semibold">Stats</h2>
          <p>Views: {stats.views.toLocaleString()}</p>
          <p>Likes: {stats.likes.toLocaleString()}</p>
        </div>
      </div>

      {/* Decision guide */}
      <div className="mt-8 rounded bg-gray-100 p-4">
        <h3 className="mb-2 font-semibold">When to use which?</h3>
        <pre className="overflow-x-auto font-mono text-sm">
          {`// Promise.all — fail fast, all-or-nothing
// Use when ALL data is required to render
await Promise.all([fetchA(), fetchB()])

// Promise.allSettled — resilient, partial data OK
// Use when some data is optional
await Promise.allSettled([fetchA(), fetchB()])`}
        </pre>
      </div>
    </main>
  );
}
