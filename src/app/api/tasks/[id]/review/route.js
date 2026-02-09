import { NextResponse } from "next/server";
import { getDatabase } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

// PUT /api/tasks/[id]/review - Buyer accepts or rejects submission
export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { action, feedback } = body; // action: "ACCEPT" or "REJECT"

    if (!["ACCEPT", "REJECT"].includes(action)) {
      return NextResponse.json(
        { error: "Action must be ACCEPT or REJECT" },
        { status: 400 }
      );
    }

    const db = await getDatabase();
    const tasks = db.collection("tasks");
    const projects = db.collection("projects");
    const users = db.collection("users");

    const newStatus = action === "ACCEPT" ? "COMPLETED" : "REJECTED";

    // Update the task
    const taskResult = await tasks.findOneAndUpdate(
      { _id: new ObjectId(id) },
      {
        $set: {
          status: newStatus,
          reviewedAt: new Date().toISOString(),
          feedback: feedback || "",
        },
      },
      { returnDocument: "after" }
    );

    if (!taskResult) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    // Process Payment if Accepted
    if (action === "ACCEPT") {
      const task = taskResult;
      
      // Get the project to find the budget
      let project = await projects.findOne({ _id: new ObjectId(task.projectId) });
      if (!project) {
        // Fallback for string ID
        project = await projects.findOne({ _id: task.projectId });
      }

      if (project && task.solverId) {
        // Simple logic: If this is the only task or we split budget?
        // User request: "get the money".
        // Let's check if the project is now fully completed (all tasks done?)
        // Or simply assign the project budget to the solver now? 
        // Better approach for now: If project is not already COMPLETED, mark it COMPLETED and payout.
        
        // Check if there are other tasks in progress
        // Actually, user flow usually is -> Project Assigned -> Task Created -> Task Submitted -> Task Accepted -> Project Complete.
        
        if (project.status !== "COMPLETED") {
          // Verify if we should complete the project. 
          // Let's assume acceptance of the task completes the project for this workflow simplicity, OR we just pay out the budget.
          
          const payoutAmount = Number(project.budget) || 0;
          
          if (payoutAmount > 0) {
            // Update Solver Balance
            await users.updateOne(
              { uid: task.solverId },
              { $inc: { balance: payoutAmount } }
            );

            // Mark Project as Completed (if not already)
             await projects.updateOne(
              { _id: project._id },
              { $set: { status: "COMPLETED", completedAt: new Date().toISOString() } }
            );
          }
        }
      }
    }

    return NextResponse.json(taskResult);
  } catch (error) {
    console.error("Review task error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
