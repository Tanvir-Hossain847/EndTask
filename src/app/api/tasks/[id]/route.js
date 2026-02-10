import { NextResponse } from "next/server";
import { getDatabase } from "@/lib/mongodb";
import { ObjectId } from "mongodb";


export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const db = await getDatabase();
    const tasks = db.collection("tasks");

    const task = await tasks.findOne({ _id: new ObjectId(id) });

    if (!task) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    return NextResponse.json(task);
  } catch (error) {
    console.error("GET task error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}


export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { title, description, deadline, status } = body;

    const db = await getDatabase();
    const tasks = db.collection("tasks");

    const updateFields = { updatedAt: new Date().toISOString() };
    if (title !== undefined) updateFields.title = title;
    if (description !== undefined) updateFields.description = description;
    if (deadline !== undefined) updateFields.deadline = deadline;
    if (status !== undefined) updateFields.status = status;

    const result = await tasks.updateOne(
      { _id: new ObjectId(id) },
      { $set: updateFields }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    const updatedTask = await tasks.findOne({ _id: new ObjectId(id) });
    return NextResponse.json(updatedTask);
  } catch (error) {
    console.error("PUT task error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
