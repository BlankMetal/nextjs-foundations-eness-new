// Mock auth helper for the navigation lesson
// In a real app, this would check cookies, JWT tokens, or a session store

export async function getSession() {
  // Simulate: toggle this to `true` to see the protected page content
  const isLoggedIn = false;

  if (!isLoggedIn) return null;

  return {
    user: { name: "Jane Developer" },
  };
}
