import { NextResponse } from "next/server";
import { getDatabase } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

// GET /api/projects/[id]/requests - Get all requests for a project
export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const db = await getDatabase();
    const requests = db.collection("requests");

    const projectRequests = await requests
      .find({ projectId: id })
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json(projectRequests);
  } catch (error) {
    console.error("GET requests error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST /api/projects/[id]/requests - Solver requests to work on project
export async function POST(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { solverId, solverEmail, solverName, message } = body;

    if (!solverId || !solverEmail) {
      return NextResponse.json({ error: "Solver info required" }, { status: 400 });
    }

    const db = await getDatabase();
    const requests = db.collection("requests");

    // Check if already requested
    const existing = await requests.findOne({ projectId: id, solverId });
    if (existing) {
      return NextResponse.json({ error: "Already requested" }, { status: 400 });
    }

    const newRequest = {
      projectId: id,
      solverId,
      solverEmail,
      solverName: solverName || "",
      message: message || "",
      status: "PENDING",
      createdAt: new Date().toISOString(),
    };

    const result = await requests.insertOne(newRequest);

    return NextResponse.json(
      { ...newRequest, _id: result.insertedId },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST request error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
