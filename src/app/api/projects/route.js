import { NextResponse } from "next/server";
import { getDatabase } from "@/lib/mongodb";

// GET /api/projects - List all projects (filtered by role/query)
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const buyerId = searchParams.get("buyerId");
    const solverId = searchParams.get("solverId");

    const db = await getDatabase();
    const collection = db.collection("projects");

    // Build query filter
    const filter = {};
    if (status) filter.status = status;
    if (buyerId) filter.buyerId = buyerId;
    if (solverId) filter.assignedSolverId = solverId;

    const projects = await collection
      .find(filter)
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json(projects);
  } catch (error) {
    console.error("GET /api/projects error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST /api/projects - Create a new project
export async function POST(request) {
  try {
    const body = await request.json();
    const { title, description, budget, deadline, category, buyerId, buyerEmail } = body;

    if (!title || !description || !buyerId) {
      return NextResponse.json(
        { error: "Title, description, and buyerId are required" },
        { status: 400 }
      );
    }

    const db = await getDatabase();
    const collection = db.collection("projects");

    const project = {
      title,
      description,
      budget: Number(budget) || 0,
      deadline: deadline || null,
      category: category || "Other",
      status: "OPEN",
      buyerId,
      buyerEmail: buyerEmail || "",
      assignedSolverId: null,
      createdAt: new Date().toISOString(),
    };

    const result = await collection.insertOne(project);
    
    return NextResponse.json(
      { ...project, _id: result.insertedId },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/projects error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
