import { NextResponse } from "next/server";
import { getDatabase } from "@/lib/mongodb";
import seedData from "@/data/seed.json";


export async function POST(request) {
  try {
    const { searchParams } = new URL(request.url);
    const force = searchParams.get("force") === "true";
    
    const db = await getDatabase();
    let results = { projects: 0, tasks: 0 };

    
    const projectsCollection = db.collection("projects");
    if (force) {
      await projectsCollection.deleteMany({});
    }
    const existingProjects = await projectsCollection.countDocuments();
    
    if (existingProjects === 0) {
      await projectsCollection.insertMany(seedData.projects);
      results.projects = seedData.projects.length;
    }

    
    const tasksCollection = db.collection("tasks");
    if (force) {
      await tasksCollection.deleteMany({});
    }
    const existingTasks = await tasksCollection.countDocuments();
    
    if (existingTasks === 0) {
      await tasksCollection.insertMany(seedData.tasks);
      results.tasks = seedData.tasks.length;
    }

    return NextResponse.json({
      success: true,
      message: force ? "Database cleared and reseeded" : "Database seeded successfully",
      inserted: results,
    });
  } catch (error) {
    console.error("Seed error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}


export async function GET() {
  try {
    const db = await getDatabase();
    
    const projectCount = await db.collection("projects").countDocuments();
    const taskCount = await db.collection("tasks").countDocuments();
    const userCount = await db.collection("users").countDocuments();
    const requestCount = await db.collection("requests").countDocuments();

    return NextResponse.json({
      projects: projectCount,
      tasks: taskCount,
      users: userCount,
      requests: requestCount,
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}


export async function DELETE() {
  try {
    const db = await getDatabase();
    
    await db.collection("projects").deleteMany({});
    await db.collection("tasks").deleteMany({});
    await db.collection("requests").deleteMany({});

    return NextResponse.json({ success: true, message: "All data cleared" });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
