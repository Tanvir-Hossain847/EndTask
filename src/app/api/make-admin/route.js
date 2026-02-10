import { NextResponse } from "next/server";
import { getUsersCollection } from "@/lib/mongodb";


export async function POST(request) {
  try {
    const body = await request.json();
    const { email, uid } = body;

    if (!email && !uid) {
      return NextResponse.json(
        { error: "Email or UID is required" },
        { status: 400 }
      );
    }

    const users = await getUsersCollection();

    
    const filter = uid ? { uid } : { email };
    const existingUser = await users.findOne(filter);

    if (existingUser) {
      
      await users.updateOne(filter, { $set: { role: "ADMIN" } });
      return NextResponse.json({ success: true, message: "User promoted to ADMIN" });
    } else {
      
      const newUser = {
        uid: uid || `manual_${Date.now()}`,
        email: email,
        role: "ADMIN",
        name: "",
        bio: "",
        createdAt: new Date().toISOString(),
      };
      await users.insertOne(newUser);
      return NextResponse.json({ success: true, message: "Admin user created", user: newUser });
    }
  } catch (error) {
    console.error("POST /api/make-admin error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
