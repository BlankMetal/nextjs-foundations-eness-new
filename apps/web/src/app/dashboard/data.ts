// Same simulated fetches, but fetchStats randomly fails
// to demonstrate Promise.allSettled() error handling.

export async function fetchUser(): Promise<{ name: string; email: string }> {
  await new Promise((resolve) => setTimeout(resolve, 200));
  return { name: "John Doe", email: "john@example.com" };
}

export async function fetchPosts(): Promise<
  Array<{ id: number; title: string }>
> {
  await new Promise((resolve) => setTimeout(resolve, 300));
  return [
    { id: 1, title: "Getting Started with Next.js" },
    { id: 2, title: "Server Components Deep Dive" },
    { id: 3, title: "Caching Strategies" },
  ];
}

export async function fetchStats(): Promise<{ views: number; likes: number }> {
  await new Promise((resolve) => setTimeout(resolve, 250));

  // Simulate a flaky API — fails ~50% of the time
  if (Math.random() > 0.5) {
    throw new Error("Stats service temporarily unavailable");
  }

  return { views: 1234, likes: 567 };
}
