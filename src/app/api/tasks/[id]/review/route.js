import { NextResponse } from "next/server";
import { getDatabase } from "@/lib/mongodb";
import { ObjectId } from "mongodb";


export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { action, feedback } = body; 

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

    
    if (action === "ACCEPT") {
      const task = taskResult;
      
      
      let project = await projects.findOne({ _id: new ObjectId(task.projectId) });
      if (!project) {
        
        project = await projects.findOne({ _id: task.projectId });
      }

      if (project && task.solverId) {
        
        
        
        
        
        
        
        
        
        if (project.status !== "COMPLETED") {
          
          
          
          const payoutAmount = Number(project.budget) || 0;
          
          if (payoutAmount > 0) {
            
            await users.updateOne(
              { uid: task.solverId },
              { $inc: { balance: payoutAmount } }
            );

            
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
