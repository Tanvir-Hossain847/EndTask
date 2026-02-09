"use client";
import React, { useState, useEffect } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { HiOutlineCollection, HiOutlinePencil } from "react-icons/hi";

export default function MyListingsPage() {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, active: 0, completed: 0 });

  useEffect(() => {
    if (user?.uid) fetchProjects();
  }, [user]);

  const fetchProjects = async () => {
    try {
      const res = await fetch(`/api/projects?buyerId=${user.uid}`);
      if (res.ok) {
        const data = await res.json();
        setProjects(data);
        
        const active = data.filter(p => ["OPEN", "ASSIGNED", "IN_PROGRESS"].includes(p.status)).length;
        const completed = data.filter(p => p.status === "COMPLETED").length;
        setStats({ total: data.length, active, completed });
      }
    } catch (error) {
      console.error("Failed to fetch projects:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      OPEN: "badge-primary",
      ASSIGNED: "badge-secondary",
      IN_PROGRESS: "badge-warning",
      COMPLETED: "badge-success",
    };
    return <span className={`badge badge-xs ${styles[status] || "badge-outline"}`}>{status}</span>;
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "-";
    return new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  return (
    <ProtectedRoute allowedRoles={["BUYER", "ADMIN"]}>
      <div className="min-h-screen bg-black py-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <HiOutlineCollection className="w-5 h-5 text-primary" />
              <h1 className="text-base font-medium">My Projects</h1>
            </div>
            <Link href="/projects/create" className="btn btn-primary btn-sm gap-1">
              <HiOutlinePencil className="w-3 h-3" />
              New Project
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            <div className="bg-base-100 border border-white/5 rounded-lg p-3">
              <p className="text-xs text-white/40 mb-1">Total</p>
              <p className="text-lg font-medium text-primary">{stats.total}</p>
            </div>
            <div className="bg-base-100 border border-white/5 rounded-lg p-3">
              <p className="text-xs text-white/40 mb-1">Active</p>
              <p className="text-lg font-medium text-primary">{stats.active}</p>
            </div>
            <div className="bg-base-100 border border-white/5 rounded-lg p-3">
              <p className="text-xs text-white/40 mb-1">Completed</p>
              <p className="text-lg font-medium text-primary">{stats.completed}</p>
            </div>
          </div>

          {/* Loading */}
          {loading && (
            <div className="flex justify-center py-12">
              <span className="loading loading-spinner loading-sm text-primary"></span>
            </div>
          )}

          {/* Projects List */}
          {!loading && (
            <div className="space-y-3">
              {projects.map((project) => (
                <div key={project._id} className="bg-base-100 border border-white/5 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="text-sm font-medium">{project.title}</h3>
                      <p className="text-xs text-white/40">Created {formatDate(project.createdAt)}</p>
                    </div>
                    {getStatusBadge(project.status)}
                  </div>
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center gap-4 text-xs">
                      <span className="text-primary font-medium">${project.budget}</span>
                      <span className="text-white/40">Due: {formatDate(project.deadline)}</span>
                    </div>
                    <Link href={`/projects/${project._id}`} className="btn btn-ghost btn-xs">
                      Manage
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Empty State */}
          {!loading && projects.length === 0 && (
            <div className="text-center py-12 text-white/40">
              <HiOutlineCollection className="w-10 h-10 mx-auto mb-3 opacity-50" />
              <p className="text-sm">No projects yet</p>
              <Link href="/projects/create" className="btn btn-primary btn-sm mt-4">
                Create Project
              </Link>
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
