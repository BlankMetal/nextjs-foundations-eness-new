// Mock auth helper for the navigation lesson
// In a real app, this would check cookies, JWT tokens, or a session store

import type { NextRequest } from "next/server";

export async function getSession() {
  // Simulate: toggle this to `true` to see the protected page content
  const isLoggedIn = false;

  if (!isLoggedIn) return null;

  return {
    user: { name: "Jane Developer" },
  };
}

// API route auth: checks the Authorization header for a Bearer token.
// In production, you'd verify a real JWT or look up a session here.
export async function verifyAuth(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return null;
  }

  // Mock: any Bearer token returns a demo user
  // In production: decode JWT, validate signature, check expiry
  return { id: "550e8400-e29b-41d4-a716-446655440000", role: "user" };
}
