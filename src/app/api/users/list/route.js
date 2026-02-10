import { NextResponse } from "next/server";
import { getUsersCollection } from "@/lib/mongodb";


export async function GET() {
  try {
    const users = await getUsersCollection();
    const allUsers = await users.find({}).toArray();

    return NextResponse.json(allUsers);
  } catch (error) {
    console.error("GET /api/users/list error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
