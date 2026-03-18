import { z } from "zod";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { verifyAuth } from "@/lib/auth";

// Declare exactly what a valid transaction request looks like.
// Zod will reject anything that doesn't match — wrong types, bad formats, out-of-range values.
const TransactionSchema = z.object({
  userId: z.uuid(),                        // must be a valid UUID, not just any string
  amount: z.number().positive().max(10000), // must be > 0 and ≤ 10,000
});

// In-memory rate limiter: tracks request counts per identifier with a 60-second sliding window.
// In production, replace with Redis or Vercel KV so limits work across multiple server instances.
const requestCounts = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(identifier: string): boolean {
  const now = Date.now();
  const limit = requestCounts.get(identifier);

  // First request or window expired — start fresh
  if (!limit || now > limit.resetAt) {
    requestCounts.set(identifier, { count: 1, resetAt: now + 60_000 });
    return false;
  }

  // Over the limit — block this request
  if (limit.count >= 10) {
    return true;
  }

  limit.count++;
  return false;
}

export async function POST(request: NextRequest) {
  try {
    // Rate limiting by IP — stop abuse before doing any real work
    const ip = request.headers.get("x-forwarded-for") || "unknown";
    if (checkRateLimit(ip)) {
      return NextResponse.json(
        { error: "Too many requests" },
        { status: 429 },
      );
    }

    // Authentication — reject requests with no valid token
    const user = await verifyAuth(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    // safeParse returns { success, data } or { success: false, error } — never throws
    const result = TransactionSchema.safeParse(body);

    if (!result.success) {
      console.error("[transaction] Validation failed:", result.error);
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    const { userId, amount } = result.data;

    // Authorization — users can only create transactions for themselves
    if (user.id !== userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    return NextResponse.json({
      success: true,
      transactionId: crypto.randomUUID(),
      userId,
      amount,
      timestamp: Date.now(),
    });
  } catch (error) {
    // Log full details server-side (visible in your terminal, not the browser)
    console.error("[transaction] Unexpected error:", error);
    // Return a generic message — never expose error.message or stack traces
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export function GET() {
  // Mock transaction list
  return NextResponse.json({
    transactions: [
      { id: "1", amount: 100, status: "completed" },
      { id: "2", amount: 250, status: "pending" },
    ],
  });
}
