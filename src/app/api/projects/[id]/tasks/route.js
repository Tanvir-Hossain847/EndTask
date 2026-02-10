import { NextResponse } from "next/server";
import { getDatabase } from "@/lib/mongodb";
import { ObjectId } from "mongodb";


export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const db = await getDatabase();
    const tasks = db.collection("tasks");

    const projectTasks = await tasks
      .find({ projectId: id })
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json(projectTasks);
  } catch (error) {
    console.error("GET tasks error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}


export async function POST(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { title, description, deadline, solverId, solverEmail, projectTitle } = body;

    if (!title) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }

    const db = await getDatabase();
    const tasks = db.collection("tasks");

    const task = {
      projectId: id,
      projectTitle: projectTitle || "",
      title,
      description: description || "",
      deadline: deadline || null,
      status: "TODO",
      solverId: solverId || null,
      solverEmail: solverEmail || null,
      submissionUrl: null,
      submittedAt: null,
      feedback: null,
      createdAt: new Date().toISOString(),
    };

    const result = await tasks.insertOne(task);

    return NextResponse.json(
      { ...task, _id: result.insertedId },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST task error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
