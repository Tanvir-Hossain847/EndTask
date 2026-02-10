import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { getDatabase } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

// Configure Cloudinary
if (process.env.CLOUDINARY_URL) {
  cloudinary.config({
    cloudinary_url: process.env.CLOUDINARY_URL,
  });
} else {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
}

// POST /api/upload - Upload a ZIP file to Cloudinary
export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");
    const taskId = formData.get("taskId");

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

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Upload to Cloudinary using upload_stream (more reliable for raw files)
    const uploadResult = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          resource_type: "raw",
          folder: "racoai_submissions",
          public_id: `${Date.now()}_${file.name.replace(/\.[^/.]+$/, "")}`,
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      uploadStream.end(buffer);
    });

    const fileUrl = uploadResult.secure_url;

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
      url: fileUrl,
      size: file.size,
      public_id: uploadResult.public_id,
    });
  } catch (error) {
    console.error("Cloudinary Upload error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// Configure for larger file uploads
export const config = {
  api: {
    bodyParser: false,
  },
};
