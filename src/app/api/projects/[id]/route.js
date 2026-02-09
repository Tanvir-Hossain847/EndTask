import { NextResponse } from "next/server";
import { getDatabase } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

// GET /api/projects/[id] - Get single project
export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const db = await getDatabase();
    
    let project;
    try {
      project = await db.collection("projects").findOne({ _id: new ObjectId(id) });
    } catch {
      // If not valid ObjectId, try as string id
      project = await db.collection("projects").findOne({ _id: id });
    }

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    return NextResponse.json(project);
  } catch (error) {
    console.error("GET project error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PUT /api/projects/[id] - Update project
export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { status, assignedSolverId, assignedSolverEmail, title, description, budget, deadline } = body;

    const db = await getDatabase();
    const projects = db.collection("projects");

    const updateFields = { updatedAt: new Date().toISOString() };
    if (status) updateFields.status = status;
    if (assignedSolverId !== undefined) updateFields.assignedSolverId = assignedSolverId;
    if (assignedSolverEmail !== undefined) updateFields.assignedSolverEmail = assignedSolverEmail;
    if (title) updateFields.title = title;
    if (description) updateFields.description = description;
    if (budget !== undefined) updateFields.budget = budget;
    if (deadline) updateFields.deadline = deadline;

    let result;
    try {
      result = await projects.updateOne({ _id: new ObjectId(id) }, { $set: updateFields });
    } catch {
      result = await projects.updateOne({ _id: id }, { $set: updateFields });
    }

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    let updated;
    try {
      updated = await projects.findOne({ _id: new ObjectId(id) });
    } catch {
      updated = await projects.findOne({ _id: id });
    }

    return NextResponse.json(updated);
  } catch (error) {
    console.error("PUT project error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
