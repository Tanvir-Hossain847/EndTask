"use client";
import React, { useState, useEffect } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth } from "@/context/AuthContext";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import FileUpload from "@/components/FileUpload";
import {
  HiOutlineArrowLeft,
  HiOutlineClock,
  HiOutlineUser,
  HiOutlineCheck,
  HiOutlineX,
  HiOutlinePlus,
  HiOutlineDownload,
} from "react-icons/hi";

export default function ProjectDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [project, setProject] = useState(null);
  const [requests, setRequests] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hasRequested, setHasRequested] = useState(false);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [newTask, setNewTask] = useState({ title: "", description: "", deadline: "" });

  const isBuyer = user?.uid === project?.buyerId;
  const isSolver = user?.uid === project?.assignedSolverId || user?.email === project?.assignedSolverEmail;
  const isAdmin = user?.role === "ADMIN";

  useEffect(() => {
    if (id) fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      const [projectRes, requestsRes, tasksRes] = await Promise.all([
        fetch(`/api/projects/${id}`),
        fetch(`/api/projects/${id}/requests`),
        fetch(`/api/projects/${id}/tasks`),
      ]);

      if (projectRes.ok) setProject(await projectRes.json());
      if (requestsRes.ok) {
        const reqData = await requestsRes.json();
        setRequests(reqData);
        setHasRequested(reqData.some((r) => r.solverId === user?.uid || r.solverEmail === user?.email));
      }
      if (tasksRes.ok) setTasks(await tasksRes.json());
    } catch (error) {
      console.error("Failed to fetch:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRequest = async () => {
    try {
      const res = await fetch(`/api/projects/${id}/requests`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          solverId: user.uid,
          solverEmail: user.email,
          solverName: user.name || "",
          message: "I would like to work on this project.",
        }),
      });
      if (res.ok) {
        setHasRequested(true);
        fetchData();
      }
    } catch (error) {
      console.error("Request failed:", error);
    }
  };

  const handleRequestAction = async (requestId, action) => {
    try {
      const res = await fetch(`/api/projects/${id}/requests/${requestId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });
      if (res.ok) fetchData();
    } catch (error) {
      console.error("Action failed:", error);
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/projects/${id}/tasks`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...newTask,
          solverId: user.uid,
          solverEmail: user.email,
          projectTitle: project.title,
        }),
      });
      if (res.ok) {
        setNewTask({ title: "", description: "", deadline: "" });
        setShowTaskForm(false);
        fetchData();
      }
    } catch (error) {
      console.error("Create task failed:", error);
    }
  };

  const handleReviewTask = async (taskId, action, feedback = "") => {
    try {
      const res = await fetch(`/api/tasks/${taskId}/review`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, feedback }),
      });
      if (res.ok) fetchData();
    } catch (error) {
      console.error("Review failed:", error);
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      OPEN: "badge-primary",
      ASSIGNED: "badge-secondary",
      IN_PROGRESS: "badge-warning",
      COMPLETED: "badge-success",
    };
    return <span className={`badge badge-sm ${styles[status] || "badge-outline"}`}>{status}</span>;
  };

  const formatDate = (d) => (d ? new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "-");

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <span className="loading loading-spinner loading-sm text-primary"></span>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center">
        <p className="text-white/40 mb-4">Project not found</p>
        <Link href="/dashboard" className="btn btn-primary btn-sm">Back to Dashboard</Link>
      </div>
    );
  }

  return (
    <ProtectedRoute allowedRoles={["SOLVER", "BUYER", "ADMIN"]}>
      <div className="min-h-screen bg-black py-8">
        <div className="max-w-4xl mx-auto px-4">
          <button onClick={() => router.back()} className="flex items-center gap-1 text-xs text-white/40 hover:text-white mb-6">
            <HiOutlineArrowLeft className="w-3 h-3" /> Back
          </button>

          {/* Header */}
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-lg font-medium mb-1">{project.title}</h1>
              <p className="text-xs text-white/40">by {project.buyerName || project.buyerEmail}</p>
            </div>
            {getStatusBadge(project.status)}
          </div>

          {/* Details */}
          <div className="bg-base-100 border border-white/5 rounded-lg p-4 mb-4">
            <p className="text-xs text-white/60 leading-relaxed">{project.description}</p>
          </div>

          <div className="grid grid-cols-3 gap-3 mb-6">
            <div className="bg-base-100 border border-white/5 rounded-lg p-3">
              <p className="text-xs text-white/40">Budget</p>
              <p className="text-sm font-medium text-primary">${project.budget}</p>
            </div>
            <div className="bg-base-100 border border-white/5 rounded-lg p-3">
              <p className="text-xs text-white/40">Deadline</p>
              <p className="text-sm font-medium">{formatDate(project.deadline)}</p>
            </div>
            <div className="bg-base-100 border border-white/5 rounded-lg p-3">
              <p className="text-xs text-white/40">Category</p>
              <p className="text-sm font-medium">{project.category}</p>
            </div>
          </div>

          {/* Solver Actions - Request to Work */}
          {user?.role === "SOLVER" && project.status === "OPEN" && !hasRequested && (
            <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 mb-6">
              <p className="text-sm mb-3">Interested in this project?</p>
              <button onClick={handleRequest} className="btn btn-primary btn-sm">Request to Work</button>
            </div>
          )}

          {hasRequested && project.status === "OPEN" && (
            <div className="bg-base-100 border border-white/5 rounded-lg p-4 mb-6">
              <p className="text-xs text-white/40">✓ You've requested to work on this project</p>
            </div>
          )}

          {/* Buyer: View Requests */}
          {(isBuyer || isAdmin) && project.status === "OPEN" && requests.length > 0 && (
            <div className="bg-base-100 border border-white/5 rounded-lg p-4 mb-6">
              <h3 className="text-sm font-medium mb-3">Solver Requests ({requests.length})</h3>
              <div className="space-y-2">
                {requests.filter(r => r.status === "PENDING").map((req) => (
                  <div key={req._id} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                    <div>
                      <p className="text-xs font-medium">{req.solverName || req.solverEmail}</p>
                      <p className="text-xs text-white/40">{req.message}</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleRequestAction(req._id, "ACCEPT")}
                        className="btn btn-success btn-xs gap-1"
                      >
                        <HiOutlineCheck className="w-3 h-3" /> Accept
                      </button>
                      <button
                        onClick={() => handleRequestAction(req._id, "REJECT")}
                        className="btn btn-ghost btn-xs"
                      >
                        <HiOutlineX className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Assigned Solver Info */}
          {project.assignedSolverEmail && (
            <div className="bg-base-100 border border-primary/20 rounded-lg p-4 mb-6">
              <div className="flex items-center gap-2">
                <HiOutlineUser className="w-4 h-4 text-primary" />
                <span className="text-xs">Assigned: {project.assignedSolverEmail}</span>
              </div>
            </div>
          )}

          {/* Tasks Section */}
          {(isSolver || isBuyer || isAdmin) && project.status !== "OPEN" && (
            <div className="bg-base-100 border border-white/5 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium">Tasks ({tasks.length})</h3>
                {isSolver && (
                  <button onClick={() => setShowTaskForm(!showTaskForm)} className="btn btn-primary btn-xs gap-1">
                    <HiOutlinePlus className="w-3 h-3" /> Add Task
                  </button>
                )}
              </div>

              {/* New Task Form */}
              {showTaskForm && (
                <form onSubmit={handleCreateTask} className="mb-4 p-3 bg-black/30 rounded-lg">
                  <input
                    type="text"
                    placeholder="Task title"
                    className="input input-sm input-bordered w-full mb-2 bg-black"
                    value={newTask.title}
                    onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                    required
                  />
                  <textarea
                    placeholder="Description"
                    className="textarea textarea-sm textarea-bordered w-full mb-2 bg-black"
                    value={newTask.description}
                    onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                  />
                  <input
                    type="date"
                    className="input input-sm input-bordered w-full mb-2 bg-black"
                    value={newTask.deadline}
                    onChange={(e) => setNewTask({ ...newTask, deadline: e.target.value })}
                  />
                  <div className="flex gap-2">
                    <button type="submit" className="btn btn-primary btn-xs">Create</button>
                    <button type="button" onClick={() => setShowTaskForm(false)} className="btn btn-ghost btn-xs">Cancel</button>
                  </div>
                </form>
              )}

              {/* Tasks List */}
              <div className="space-y-3">
                {tasks.map((task) => (
                  <div key={task._id} className="p-3 border border-white/5 rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="text-xs font-medium">{task.title}</p>
                        <p className="text-xs text-white/40">{task.description}</p>
                      </div>
                      <span className={`badge badge-xs ${
                        task.status === "COMPLETED" ? "badge-success" :
                        task.status === "SUBMITTED" ? "badge-secondary" :
                        task.status === "IN_PROGRESS" ? "badge-primary" : "badge-outline"
                      }`}>{task.status}</span>
                    </div>

                    {/* Submission */}
                    {task.submissionUrl && (
                      <div className="flex items-center justify-between mt-2 p-2 bg-black/30 rounded">
                        <span className="text-xs text-white/50">Submitted {formatDate(task.submittedAt)}</span>
                        <a href={task.submissionUrl} download className="btn btn-ghost btn-xs gap-1">
                          <HiOutlineDownload className="w-3 h-3" /> Download
                        </a>
                      </div>
                    )}

                    {/* Buyer Review Actions */}
                    {(isBuyer || isAdmin) && task.status === "SUBMITTED" && (
                      <div className="flex gap-2 mt-2">
                        <button onClick={() => handleReviewTask(task._id, "ACCEPT")} className="btn btn-success btn-xs">Accept</button>
                        <button onClick={() => handleReviewTask(task._id, "REJECT")} className="btn btn-ghost btn-xs">Reject</button>
                      </div>
                    )}

                    {/* Solver Upload */}
                    {isSolver && (task.status === "IN_PROGRESS" || task.status === "REJECTED") && (
                      <div className="mt-2">
                        <FileUpload taskId={task._id} solverId={user?.uid} onUploadComplete={fetchData} />
                      </div>
                    )}

                    {/* Feedback */}
                    {task.feedback && (
                      <div className="mt-2 p-2 bg-success/10 rounded">
                        <p className="text-xs text-white/60">{task.feedback}</p>
                      </div>
                    )}
                  </div>
                ))}

                {tasks.length === 0 && (
                  <p className="text-xs text-white/40 text-center py-4">No tasks yet</p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
