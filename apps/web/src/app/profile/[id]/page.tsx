import { Suspense } from "react";

// -- Mock data fetching (staggered delays to visualize streaming) --

async function fetchUserProfile(_id: string) {
  await new Promise((resolve) => setTimeout(resolve, 200)); // Fastest
  return {
    name: "Demo User",
    email: "demo@example.com",
    joinedAt: new Date("2024-01-15"),
  };
}

async function fetchUserStats(_id: string) {
  await new Promise((resolve) => setTimeout(resolve, 400)); // Medium
  return { posts: 42, followers: 1234, following: 567 };
}

async function fetchUserActivity(_id: string) {
  await new Promise((resolve) => setTimeout(resolve, 600)); // Slowest
  return [
    { type: "post", title: "My first post", date: new Date() },
    { type: "comment", title: "Great article!", date: new Date() },
    { type: "like", title: "Liked a post", date: new Date() },
  ];
}

// -- Each async component fetches its own data and streams independently --

async function ProfileHeader({ id }: { id: string }) {
  const profile = await fetchUserProfile(id);
  return (
    <section>
      <h1 className="font-bold text-2xl">{profile.name}</h1>
      <p className="text-gray-600">{profile.email}</p>
    </section>
  );
}

async function ProfileStats({ id }: { id: string }) {
  const stats = await fetchUserStats(id);
  return (
    <section className="flex gap-4">
      <div>
        <strong>{stats.posts}</strong> posts
      </div>
      <div>
        <strong>{stats.followers}</strong> followers
      </div>
      <div>
        <strong>{stats.following}</strong> following
      </div>
    </section>
  );
}

async function ProfileActivity({ id }: { id: string }) {
  const activity = await fetchUserActivity(id);
  return (
    <section>
      <h2 className="mb-2 font-semibold text-xl">Recent Activity</h2>
      <ul className="space-y-2">
        {activity.map((item, i) => (
          <li key={i} className="text-gray-700">
            {item.title}
          </li>
        ))}
      </ul>
    </section>
  );
}

// -- Skeleton fallbacks that match the shape of real content --

function HeaderSkeleton() {
  return (
    <section className="animate-pulse">
      <div className="mb-2 h-8 w-48 rounded bg-gray-200" />
      <div className="h-4 w-32 rounded bg-gray-200" />
    </section>
  );
}

function StatsSkeleton() {
  return (
    <section className="flex animate-pulse gap-4">
      <div className="h-6 w-20 rounded bg-gray-200" />
      <div className="h-6 w-20 rounded bg-gray-200" />
      <div className="h-6 w-20 rounded bg-gray-200" />
    </section>
  );
}

function ActivitySkeleton() {
  return (
    <section className="animate-pulse">
      <div className="mb-2 h-6 w-32 rounded bg-gray-200" />
      <div className="space-y-2">
        <div className="h-4 w-full rounded bg-gray-200" />
        <div className="h-4 w-full rounded bg-gray-200" />
        <div className="h-4 w-3/4 rounded bg-gray-200" />
      </div>
    </section>
  );
}

// -- Page: each section wrapped in its own Suspense boundary --

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <main className="mx-auto max-w-2xl space-y-6 p-8">
      {/* Streams at ~200ms */}
      <Suspense fallback={<HeaderSkeleton />}>
        <ProfileHeader id={id} />
      </Suspense>

      {/* Streams at ~400ms */}
      <Suspense fallback={<StatsSkeleton />}>
        <ProfileStats id={id} />
      </Suspense>

      {/* Streams at ~600ms */}
      <Suspense fallback={<ActivitySkeleton />}>
        <ProfileActivity id={id} />
      </Suspense>
    </main>
  );
}
