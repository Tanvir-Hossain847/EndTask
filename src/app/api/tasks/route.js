import { NextResponse } from "next/server";
import { getDatabase } from "@/lib/mongodb";

// GET /api/tasks - Get tasks for a solver
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const solverId = searchParams.get("solverId");
    const solverEmail = searchParams.get("solverEmail");
    const status = searchParams.get("status");

    const db = await getDatabase();
    const collection = db.collection("tasks");

    // Build query filter
    const filter = {};
    if (solverId) filter.solverId = solverId;
    if (solverEmail) filter.solverEmail = solverEmail;
    if (status) filter.status = status;

    const tasks = await collection
      .find(filter)
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json(tasks);
  } catch (error) {
    console.error("GET /api/tasks error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
