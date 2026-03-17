import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const vitals = await request.json();

    // Log to server console — swap this for a real analytics service in production
    console.log("Core Web Vitals:", vitals);

    // Example: forward to a database or external analytics service
    // await db.vitals.create({ data: vitals })

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to record vitals" },
      { status: 500 }
    );
  }
}
