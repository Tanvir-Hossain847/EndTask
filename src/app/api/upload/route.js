import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { existsSync } from "fs";
import path from "path";
import { getDatabase } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

// POST /api/upload - Upload a ZIP file
export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");
    const taskId = formData.get("taskId");
    const solverId = formData.get("solverId");

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Validate file type
    if (!file.name.endsWith(".zip")) {
      return NextResponse.json(
        { error: "Only ZIP files are allowed" },
        { status: 400 }
      );
    }

    // Validate file size (max 50MB)
    const MAX_SIZE = 50 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { error: "File too large. Maximum size is 50MB" },
        { status: 400 }
      );
    }

    // Create uploads directory if it doesn't exist
    const uploadsDir = path.join(process.cwd(), "public", "uploads");
    if (!existsSync(uploadsDir)) {
      await mkdir(uploadsDir, { recursive: true });
    }

    // Generate unique filename
    const timestamp = Date.now();
    const safeFilename = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
    const filename = `${timestamp}_${safeFilename}`;
    const filepath = path.join(uploadsDir, filename);

    // Save file
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filepath, buffer);

    const fileUrl = `/uploads/${filename}`;

    // If taskId provided, update the task with submission
    if (taskId) {
      const db = await getDatabase();
      const tasks = db.collection("tasks");
      
      await tasks.updateOne(
        { _id: new ObjectId(taskId) },
        {
          $set: {
            submissionUrl: fileUrl,
            submittedAt: new Date().toISOString(),
            status: "SUBMITTED",
          },
        }
      );
    }

    return NextResponse.json({
      success: true,
      filename,
      url: fileUrl,
      size: file.size,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// Configure for larger file uploads
export const config = {
  api: {
    bodyParser: false,
  },
};
