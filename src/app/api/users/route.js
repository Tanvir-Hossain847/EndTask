import { NextResponse } from "next/server";
import { getUsersCollection } from "@/lib/mongodb";

// GET /api/users?uid=xxx - Get user by Firebase UID
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const uid = searchParams.get("uid");

    if (!uid) {
      return NextResponse.json({ error: "UID is required" }, { status: 400 });
    }

    const users = await getUsersCollection();
    const user = await users.findOne({ uid });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error("GET /api/users error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// POST /api/users - Create or update user
export async function POST(request) {
  try {
    const body = await request.json();
    const { uid, email, role, name, bio, avatar } = body;

    if (!uid || !email) {
      return NextResponse.json(
        { error: "UID and email are required" },
        { status: 400 }
      );
    }

    const users = await getUsersCollection();

    // Upsert: Update if exists, create if not
    const result = await users.updateOne(
      { uid },
      {
        $set: {
          uid,
          email,
          role: role || "SOLVER",
          name: name || "",
          bio: bio || "",
          avatar: avatar || "",
          updatedAt: new Date().toISOString(),
        },
        $setOnInsert: {
          createdAt: new Date().toISOString(),
        },
      },
      { upsert: true }
    );

    // Fetch and return the updated user
    const user = await users.findOne({ uid });

    return NextResponse.json(user, { status: result.upsertedCount > 0 ? 201 : 200 });
  } catch (error) {
    console.error("POST /api/users error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
