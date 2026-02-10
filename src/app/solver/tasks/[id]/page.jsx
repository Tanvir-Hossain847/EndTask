"use client";
import React, { useState, useEffect } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth } from "@/context/AuthContext";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import FileUpload from "@/components/FileUpload";
import { HiOutlineArrowLeft, HiOutlineClock, HiOutlineDownload, HiOutlineCheckCircle, HiOutlineCurrencyDollar } from "react-icons/hi";

export default function TaskDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) fetchTask();
  }, [id]);

  const fetchTask = async () => {
    try {
      const res = await fetch(`/api/tasks/${id}`);
      if (res.ok) {
        const data = await res.json();
        setTask(data);
      }
    } catch (error) {
      console.error("Failed to fetch task:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUploadComplete = (data) => {
    setTask((prev) => ({
      ...prev,
      submissionUrl: data.url,
      status: "SUBMITTED",
      submittedAt: new Date().toISOString(),
    }));
    
    updateStatus("SUBMITTED", data.url);
  };

  const updateStatus = async (newStatus, submissionUrl = null) => {
    try {
      const body = { status: newStatus };
      if (submissionUrl) body.submissionUrl = submissionUrl;

      const res = await fetch(`/api/tasks/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (res.ok) {
        const updated = await res.json();
        setTask(updated);
      }
    } catch (error) {
      console.error("Failed to update status:", error);
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      TODO: "badge-outline text-white/50",
      IN_PROGRESS: "badge-primary",
      SUBMITTED: "badge-secondary",
      COMPLETED: "badge-success gap-2",
      REJECTED: "badge-error",
    };
    return (
      <span className={`badge ${styles[status] || "badge-outline"}`}>
        {status === 'COMPLETED' && <HiOutlineCheckCircle className="w-4 h-4" />}
        {status}
      </span>
    );
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "-";
    return new Date(dateStr).toLocaleDateString("en-US", { 
      month: "short", 
      day: "numeric",
      year: "numeric"
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <span className="loading loading-spinner loading-sm text-primary"></span>
      </div>
    );
  }

  if (!task) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center">
        <p className="text-white/40 mb-4">Task not found</p>
        <Link href="/solver/my-tasks" className="btn btn-primary btn-sm">
          Back to Tasks
        </Link>
      </div>
    );
  }

  return (
    <ProtectedRoute allowedRoles={["SOLVER", "ADMIN"]}>
      <div className="min-h-screen bg-black py-8">
        <div className="max-w-3xl mx-auto px-4">
          {}
          <button
            onClick={() => router.back()}
            className="flex items-center gap-1 text-xs text-white/40 hover:text-white mb-6"
          >
            <HiOutlineArrowLeft className="w-3 h-3" />
            Back to Tasks
          </button>

          {}
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-lg font-medium mb-1">{task.title}</h1>
              <p className="text-xs text-white/40">{task.projectTitle}</p>
            </div>
            {getStatusBadge(task.status)}
          </div>

          {}
          {task.status === "COMPLETED" && (
            <div className="alert alert-success shadow-lg mb-6 bg-success/10 border-success/20 text-success">
              <div className="flex flex-col">
                <div className="flex items-center gap-2 font-bold">
                  <HiOutlineCurrencyDollar className="w-6 h-6" />
                  <span>Payment Released</span>
                </div>
                <div className="text-xs opacity-80 mt-1">
                  The buyer has accepted your solution. Funds have been added to your balance.
                </div>
              </div>
            </div>
          )}

          {}
          <div className="bg-base-100 border border-white/5 rounded-lg p-4 mb-4">
            <h2 className="text-sm font-medium mb-3">Description</h2>
            <p className="text-xs text-white/60 leading-relaxed">{task.description}</p>
          </div>

          {}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-base-100 border border-white/5 rounded-lg p-3">
              <p className="text-xs text-white/40 mb-1">Deadline</p>
              <p className="text-sm font-medium flex items-center gap-1">
                <HiOutlineClock className="w-3 h-3 text-primary" />
                {formatDate(task.deadline)}
              </p>
            </div>
            <div className="bg-base-100 border border-white/5 rounded-lg p-3">
              <p className="text-xs text-white/40 mb-1">Created</p>
              <p className="text-sm font-medium">{formatDate(task.createdAt)}</p>
            </div>
          </div>

          {}
          {task.status === "TODO" && (
            <div className="bg-base-100 border border-white/5 rounded-lg p-4 mb-4">
              <p className="text-xs text-white/40 mb-3">Ready to start working?</p>
              <button
                onClick={() => updateStatus("IN_PROGRESS")}
                className="btn btn-primary btn-sm"
              >
                Start Task
              </button>
            </div>
          )}

          {}
          {(task.status === "IN_PROGRESS" || task.status === "REJECTED") && (
            <div className="bg-base-100 border border-white/5 rounded-lg p-4 mb-4">
              <h2 className="text-sm font-medium mb-3">Submit Work</h2>
              <FileUpload
                taskId={task._id}
                solverId={user?.uid}
                onUploadComplete={handleUploadComplete}
              />
            </div>
          )}

          {}
          {(task.submissionUrl || task.status === "SUBMITTED") && (
            <div className="bg-base-100 border border-primary/20 rounded-lg p-4 mb-4">
              <h2 className="text-sm font-medium mb-3 flex items-center gap-2">
                <HiOutlineCheckCircle className="w-4 h-4 text-primary" />
                Submission
              </h2>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-white/60">Submitted: {formatDate(task.submittedAt || new Date())}</p>
                </div>
                {task.submissionUrl && (
                  <a
                    href={task.submissionUrl}
                    download
                    className="btn btn-ghost btn-xs gap-1"
                  >
                    <HiOutlineDownload className="w-3 h-3" />
                    Download
                  </a>
                )}
              </div>
            </div>
          )}

          {}
          {task.feedback && (
            <div className="bg-base-100 border border-white/5 rounded-lg p-4">
              <h2 className="text-sm font-medium mb-2">Buyer Feedback</h2>
              <p className="text-xs text-white/60 italic">"{task.feedback}"</p>
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
