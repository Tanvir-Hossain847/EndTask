import { NextResponse } from "next/server";
import { getUsersCollection } from "@/lib/mongodb";


export async function GET(request, { params }) {
  try {
    const { uid } = await params;

    const users = await getUsersCollection();
    const user = await users.findOne({ uid });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error("GET /api/users/[uid] error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}


export async function PUT(request, { params }) {
  try {
    const { uid } = await params;
    const body = await request.json();
    const { name, bio, avatar, role } = body;

    const users = await getUsersCollection();

    const updateFields = { updatedAt: new Date().toISOString() };
    if (name !== undefined) updateFields.name = name;
    if (bio !== undefined) updateFields.bio = bio;
    if (avatar !== undefined) updateFields.avatar = avatar;
    if (role !== undefined) updateFields.role = role;

    const result = await users.updateOne({ uid }, { $set: updateFields });

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const updatedUser = await users.findOne({ uid });
    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error("PUT /api/users/[uid] error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
