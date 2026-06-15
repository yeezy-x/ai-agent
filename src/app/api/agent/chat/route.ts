import { NextRequest, NextResponse } from "next/server";
import { runAgent } from "@/agent/agent";

export async function POST(req: NextRequest) {
  const body = await req.json();

  if (!body.message || typeof body.message !== "string") {
    return NextResponse.json({ error: "Message is required" }, { status: 400 });
  }

  try {
    const result = await runAgent(body.message);
    return NextResponse.json(result);
  } catch (err) {
    console.error("agent chat error:", err);

    return NextResponse.json(
      {
        error:
          err instanceof Error
            ? err.message
            : String(err),
      },
      { status: 500 }
    );
  }
}