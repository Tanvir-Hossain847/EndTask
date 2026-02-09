import { NextResponse } from "next/server";
import { getDatabase } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

// PUT /api/projects/[id]/requests/[rid] - Accept or reject request
export async function PUT(request, { params }) {
  try {
    const { id, rid } = await params;
    const body = await request.json();
    const { action } = body; // ACCEPT or REJECT

    if (!["ACCEPT", "REJECT"].includes(action)) {
      return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

    const db = await getDatabase();
    const requests = db.collection("requests");
    const projects = db.collection("projects");

    // Get the request
    const req = await requests.findOne({ _id: new ObjectId(rid) });
    if (!req) {
      return NextResponse.json({ error: "Request not found" }, { status: 404 });
    }

    if (action === "ACCEPT") {
      // Update request status
      await requests.updateOne(
        { _id: new ObjectId(rid) },
        { $set: { status: "ACCEPTED", updatedAt: new Date().toISOString() } }
      );

      // Reject all other requests for this project
      await requests.updateMany(
        { projectId: id, _id: { $ne: new ObjectId(rid) } },
        { $set: { status: "REJECTED", updatedAt: new Date().toISOString() } }
      );

      // Assign solver to project
      try {
        await projects.updateOne(
          { _id: new ObjectId(id) },
          {
            $set: {
              status: "ASSIGNED",
              assignedSolverId: req.solverId,
              assignedSolverEmail: req.solverEmail,
              updatedAt: new Date().toISOString(),
            },
          }
        );
      } catch {
        await projects.updateOne(
          { _id: id },
          {
            $set: {
              status: "ASSIGNED",
              assignedSolverId: req.solverId,
              assignedSolverEmail: req.solverEmail,
              updatedAt: new Date().toISOString(),
            },
          }
        );
      }
    } else {
      // Just reject this request
      await requests.updateOne(
        { _id: new ObjectId(rid) },
        { $set: { status: "REJECTED", updatedAt: new Date().toISOString() } }
      );
    }

    const updated = await requests.findOne({ _id: new ObjectId(rid) });
    return NextResponse.json(updated);
  } catch (error) {
    console.error("PUT request error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
