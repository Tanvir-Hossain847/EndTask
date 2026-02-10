import { NextResponse } from "next/server";
import { getDatabase } from "@/lib/mongodb";
import { ObjectId } from "mongodb";


export async function PUT(request, { params }) {
  try {
    const { id, rid } = await params;
    const body = await request.json();
    const { action } = body; 

    if (!["ACCEPT", "REJECT"].includes(action)) {
      return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

    const db = await getDatabase();
    const requests = db.collection("requests");
    const projects = db.collection("projects");

    
    const req = await requests.findOne({ _id: new ObjectId(rid) });
    if (!req) {
      return NextResponse.json({ error: "Request not found" }, { status: 404 });
    }

    if (action === "ACCEPT") {
      
      await requests.updateOne(
        { _id: new ObjectId(rid) },
        { $set: { status: "ACCEPTED", updatedAt: new Date().toISOString() } }
      );

      
      await requests.updateMany(
        { projectId: id, _id: { $ne: new ObjectId(rid) } },
        { $set: { status: "REJECTED", updatedAt: new Date().toISOString() } }
      );

      
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
