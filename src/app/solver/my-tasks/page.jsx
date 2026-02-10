"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth } from "@/context/AuthContext";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import FileUpload from "@/components/FileUpload";
import { HiOutlineArrowLeft, HiOutlineClock, HiOutlineDownload, HiOutlineCheckCircle, HiOutlineCurrencyDollar, HiOutlinePlay } from "react-icons/hi";

export default function MyTasksPage() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("todo"); 

  useEffect(() => {
    if (user?.email) {
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    try {
      const [tasksRes, projectsRes] = await Promise.all([
        fetch(`/api/tasks?solverEmail=${user.email}`),
        fetch(`/api/projects?solverId=${user.uid}`)
      ]);

      if (tasksRes.ok) setTasks(await tasksRes.json());
      if (projectsRes.ok) {
        const allProjects = await projectsRes.json();
        setProjects(allProjects.filter(p => p.assignedSolverId === user.uid && p.status !== 'COMPLETED'));
      }
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateTaskStatus = async (taskId, newStatus) => {
    try {
      const res = await fetch(`/api/tasks/${taskId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        fetchData(); 
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
      COMPLETED: "badge-success",
      REJECTED: "badge-error",
    };
    return <span className={`badge badge-xs ${styles[status] || "badge-outline"}`}>{status}</span>;
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "-";
    return new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  
  const todoTasks = tasks.filter(t => t.status === "TODO");
  const activeTasks = tasks.filter(t => ["IN_PROGRESS", "SUBMITTED", "REJECTED"].includes(t.status));
  const completedTasks = tasks.filter(t => ["COMPLETED"].includes(t.status));

  return (
    <ProtectedRoute allowedRoles={["SOLVER", "ADMIN"]}>
      <div className="min-h-screen bg-black py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex items-center gap-2 mb-6">
            <Link href="/dashboard" className="btn btn-ghost btn-square btn-sm">
                <HiOutlineArrowLeft className="w-5 h-5" />
            </Link>
            <h1 className="text-xl font-bold">My Workspace</h1>
          </div>

          {}
          <div className="grid grid-cols-4 gap-3 mb-8">
             <div className="bg-base-100 border border-white/5 rounded-lg p-3">
              <p className="text-xs text-white/40 mb-1">Assigned</p>
              <p className="text-xl font-medium text-white">{projects.length}</p>
            </div>
            <div className="bg-base-100 border border-white/5 rounded-lg p-3">
              <p className="text-xs text-white/40 mb-1">To Do</p>
              <p className="text-xl font-medium text-white">{todoTasks.length}</p>
            </div>
            <div className="bg-base-100 border border-white/5 rounded-lg p-3">
              <p className="text-xs text-white/40 mb-1">In Progress</p>
              <p className="text-xl font-medium text-primary">{activeTasks.length}</p>
            </div>
            <div className="bg-base-100 border border-white/5 rounded-lg p-3">
              <p className="text-xs text-white/40 mb-1">Earnings</p>
              <p className="text-xl font-medium text-success">${user?.balance?.toLocaleString() || 0}</p>
            </div>
          </div>

          {}
          <div className="tabs tabs-boxed bg-base-100 p-1 mb-6 w-full sm:w-fit overflow-x-auto flex-nowrap">
            <button 
              className={`tab tab-sm ${activeTab === 'projects' ? 'tab-active bg-primary text-primary-content' : ''}`}
              onClick={() => setActiveTab('projects')}
            >
              Projects ({projects.length})
            </button>
            <button 
              className={`tab tab-sm ${activeTab === 'todo' ? 'tab-active bg-primary text-primary-content' : ''}`}
              onClick={() => setActiveTab('todo')}
            >
              Backlog ({todoTasks.length})
            </button>
            <button 
              className={`tab tab-sm ${activeTab === 'active' ? 'tab-active bg-primary text-primary-content' : ''}`}
              onClick={() => setActiveTab('active')}
            >
              Active ({activeTasks.length})
            </button>
            <button 
              className={`tab tab-sm ${activeTab === 'completed' ? 'tab-active bg-primary text-primary-content' : ''}`}
              onClick={() => setActiveTab('completed')}
            >
              Done ({completedTasks.length})
            </button>
          </div>

          {loading && (
            <div className="flex justify-center py-12">
              <span className="loading loading-spinner loading-sm text-primary"></span>
            </div>
          )}

          {!loading && (
            <div className="space-y-3 min-h-[300px]">
              
              {}
              {activeTab === 'projects' && (
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="space-y-3"
                >
                  {projects.length === 0 && <p className="text-sm text-white/40 text-center py-8">No active projects assigned.</p>}
                  {projects.map(p => (
                    <motion.div 
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      key={p._id} 
                      className="bg-base-100 border border-white/5 rounded-lg p-4 flex justify-between items-center group hover:border-white/10 transition-colors"
                    >
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-sm font-medium text-white group-hover:text-primary transition-colors">{p.title}</h3>
                          <span className="badge badge-primary badge-xs badge-outline">Project</span>
                        </div>
                        <p className="text-xs text-white/40 mb-1">Budget: ${p.budget}</p>
                      </div>
                      <Link href={`/projects/${p._id}`} className="btn btn-sm btn-ghost border border-white/5">
                        Manage
                      </Link>
                    </motion.div>
                  ))}
                  <div className="text-center mt-4">
                     <Link href="/projects/browse" className="btn btn-primary btn-sm btn-outline">Find More Work</Link>
                  </div>
                </motion.div>
              )}

              {}
              {activeTab === 'todo' && (
                <motion.div 
                   initial={{ opacity: 0, x: -20 }}
                   animate={{ opacity: 1, x: 0 }}
                   exit={{ opacity: 0, x: 20 }}
                   className="space-y-3"
                >
                  {todoTasks.length === 0 && <p className="text-sm text-white/40 text-center py-8">No tasks in backlog. Check your projects or create tasks.</p>}
                  <AnimatePresence>
                  {todoTasks.map((task) => (
                    <motion.div 
                      layout
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      key={task._id} 
                      className="bg-base-100 border border-white/5 rounded-lg p-4 hover:border-white/10 transition-colors"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="text-sm font-medium">{task.title}</h3>
                          <p className="text-xs text-white/40">{task.projectTitle}</p>
                        </div>
                        {getStatusBadge(task.status)}
                      </div>
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center gap-3 text-xs text-white/40">
                          <span className="flex items-center gap-1">
                            <HiOutlineClock className="w-3 h-3" />
                            Due: {formatDate(task.deadline)}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Link href={`/solver/tasks/${task._id}`} className="btn btn-ghost btn-xs text-white/60">
                            Details
                          </Link>
                          <button 
                            onClick={() => updateTaskStatus(task._id, "IN_PROGRESS")}
                            className="btn btn-primary btn-xs gap-1"
                          >
                            <HiOutlinePlay className="w-3 h-3" />
                            Start Working
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                  </AnimatePresence>
                </motion.div>
              )}

              {}
              {activeTab === 'active' && (
                <motion.div 
                   initial={{ opacity: 0, x: -20 }}
                   animate={{ opacity: 1, x: 0 }}
                   exit={{ opacity: 0, x: 20 }}
                   className="space-y-3"
                >
                  {activeTasks.length === 0 && <p className="text-sm text-white/40 text-center py-8">No active tasks being worked on.</p>}
                  <AnimatePresence>
                  {activeTasks.map((task) => (
                    <motion.div 
                      layout
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      key={task._id} 
                      className="bg-base-100 border border-primary/20 rounded-lg p-4 shadow-sm shadow-primary/5"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="text-sm font-medium">{task.title}</h3>
                          <p className="text-xs text-white/40">{task.projectTitle}</p>
                        </div>
                        {getStatusBadge(task.status)}
                      </div>
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center gap-3 text-xs text-white/40">
                          <span className="flex items-center gap-1">
                            <HiOutlineClock className="w-3 h-3" />
                            Due: {formatDate(task.deadline)}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Link href={`/solver/tasks/${task._id}`} className="btn btn-ghost btn-xs text-white/60">
                            Details
                          </Link>
                          <Link href={`/solver/tasks/${task._id}`} className="btn btn-primary btn-xs gap-1">
                            <HiOutlineDownload className="w-3 h-3" />
                            {task.status === "REJECTED" ? "Resubmit" : "Submit"}
                          </Link>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                  </AnimatePresence>
                </motion.div>
              )}

               {}
               {activeTab === 'completed' && (
                <motion.div 
                   initial={{ opacity: 0, x: -20 }}
                   animate={{ opacity: 1, x: 0 }}
                   exit={{ opacity: 0, x: 20 }}
                   className="space-y-3"
                >
                  {completedTasks.length === 0 && <p className="text-sm text-white/40 text-center py-8">No completed tasks yet.</p>}
                  <AnimatePresence>
                  {completedTasks.map((task) => (
                    <motion.div 
                      layout
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      key={task._id} 
                      className="bg-base-100 border border-white/5 rounded-lg p-4 opacity-75 grayscale hover:grayscale-0 transition-all"
                    >

                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="text-sm font-medium line-through decoration-white/30">{task.title}</h3>
                          <p className="text-xs text-white/40">{task.projectTitle}</p>
                        </div>
                        {getStatusBadge(task.status)}
                      </div>
                      <div className="flex items-center justify-between mt-3">
                         <div className="text-xs text-success flex items-center gap-1">
                            {task.status === 'COMPLETED' && <HiOutlineCheckCircle className="w-3 h-3" />}
                            Earned
                         </div>
                         <Link href={`/solver/tasks/${task._id}`} className="btn btn-ghost btn-xs text-white/40">
                            View
                          </Link>
                      </div>
                    </motion.div>
                  ))}
                  </AnimatePresence>
                </motion.div>
              )}

            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
