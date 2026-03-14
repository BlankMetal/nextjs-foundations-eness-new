// Step 4: Server-side redirect for authentication
// redirect() runs on the server — the browser never sees this page if auth fails

import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";

export default async function ProtectedPage() {
  const session = await getSession();

  // If no session, redirect before any UI renders
  if (!session) {
    redirect("/nav-demo");
  }

  return (
    <main className="mx-auto max-w-2xl p-8">
      <h1 className="mb-4 font-bold text-2xl">Protected Content</h1>
      <p>Welcome, {session.user.name}!</p>
    </main>
  );
}
