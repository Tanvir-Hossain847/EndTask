"use client";
import React, { useState } from "react";
import { HiOutlineUpload, HiOutlineDocument, HiOutlineCheck } from "react-icons/hi";

export default function FileUpload({ taskId, solverId, onUploadComplete }) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    
    if (!file.name.endsWith(".zip")) {
      setError("Only ZIP files are allowed");
      return;
    }

    
    if (file.size > 50 * 1024 * 1024) {
      setError("File too large. Maximum 50MB");
      return;
    }

    setError("");
    setUploading(true);
    setProgress(0);

    try {
      const formData = new FormData();
      formData.append("file", file);
      if (taskId) formData.append("taskId", taskId);
      if (solverId) formData.append("solverId", solverId);

      
      const progressInterval = setInterval(() => {
        setProgress((p) => Math.min(p + 10, 90));
      }, 100);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      clearInterval(progressInterval);
      setProgress(100);

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Upload failed");
      }

      const data = await res.json();
      setSuccess(true);
      
      if (onUploadComplete) {
        onUploadComplete(data);
      }

      
      setTimeout(() => {
        setSuccess(false);
        setProgress(0);
      }, 2000);
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="w-full">
      <label className="flex flex-col items-center justify-center w-full h-32 border border-dashed border-white/10 rounded-lg hover:border-primary/50 transition-colors cursor-pointer bg-black/30">
        <input
          type="file"
          accept=".zip"
          onChange={handleUpload}
          disabled={uploading}
          className="hidden"
        />
        
        {success ? (
          <div className="flex flex-col items-center text-primary">
            <HiOutlineCheck className="w-8 h-8 mb-2" />
            <span className="text-xs">Upload Complete!</span>
          </div>
        ) : uploading ? (
          <div className="flex flex-col items-center w-full px-8">
            <span className="text-xs text-white/40 mb-2">Uploading...</span>
            <div className="w-full bg-white/10 rounded-full h-1">
              <div
                className="bg-primary h-1 rounded-full transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="text-xs text-white/40 mt-1">{progress}%</span>
          </div>
        ) : (
          <div className="flex flex-col items-center text-white/40">
            <HiOutlineUpload className="w-6 h-6 mb-2" />
            <span className="text-xs">Click to upload ZIP file</span>
            <span className="text-xs opacity-50 mt-1">Max 50MB</span>
          </div>
        )}
      </label>

      {error && (
        <p className="text-xs text-error mt-2">{error}</p>
      )}
    </div>
  );
}
