"use client";
import React, { useState, useEffect } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { HiOutlineUsers, HiOutlineShieldCheck, HiOutlineCollection, HiOutlineRefresh } from "react-icons/hi";

export default function AdminDashboard() {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [resetting, setResetting] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [usersRes, projectsRes] = await Promise.all([
        fetch("/api/users/list"),
        fetch("/api/projects"),
      ]);
      
      if (usersRes.ok) setUsers(await usersRes.json());
      if (projectsRes.ok) setProjects(await projectsRes.json());
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async () => {
    if (!confirm("Are you sure? This will delete all projects, tasks, and requests. User accounts will remain.")) return;
    setResetting(true);
    try {
      await fetch("/api/seed?force=true", { method: "POST" });
      await fetchData();
      alert("Database reset successfully!");
    } catch (error) {
      console.error("Reset failed:", error);
    } finally {
      setResetting(false);
    }
  };

  const handleRoleChange = async (uid, newRole) => {
    // ... existing handleRoleChange code ...
    try {
      const res = await fetch(`/api/users/${uid}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: newRole }),
      });
      if (res.ok) {
        setUsers(users.map(u => u.uid === uid ? { ...u, role: newRole } : u));
      }
    } catch (error) {
      console.error("Failed to update role:", error);
    }
  };

  return (
    <ProtectedRoute allowedRoles={["ADMIN"]}>
      <div className="min-h-screen bg-black py-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <HiOutlineShieldCheck className="w-6 h-6 text-primary" />
              <h1 className="text-lg font-semibold">Admin Panel</h1>
            </div>
            <button 
              onClick={handleReset} 
              disabled={resetting}
              className="btn btn-error btn-xs gap-1"
            >
              <HiOutlineRefresh className={`w-3 h-3 ${resetting ? "animate-spin" : ""}`} />
              {resetting ? "Resetting..." : "Reset Data"}
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-base-100 border border-white/5 rounded-lg p-4">
              <p className="text-xs text-white/40">Users</p>
              <p className="text-xl font-semibold">{users.length}</p>
            </div>
            <div className="bg-base-100 border border-white/5 rounded-lg p-4">
              <p className="text-xs text-white/40">Projects</p>
              <p className="text-xl font-semibold">{projects.length}</p>
            </div>
            <div className="bg-base-100 border border-white/5 rounded-lg p-4">
              <p className="text-xs text-white/40">Open Projects</p>
              <p className="text-xl font-semibold text-primary">
                {projects.filter(p => p.status === "OPEN").length}
              </p>
            </div>
          </div>

          {/* User Management */}
          <div className="bg-base-100 border border-white/5 rounded-lg p-4 mb-6">
            <h2 className="text-sm font-medium mb-4 flex items-center gap-2">
              <HiOutlineUsers className="w-4 h-4" /> User Management
            </h2>
            
            {loading ? (
              <div className="flex justify-center py-8">
                <span className="loading loading-spinner loading-sm"></span>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="table table-xs">
                  <thead>
                    <tr className="text-white/40">
                      <th>Email</th>
                      <th>Name</th>
                      <th>Current Role</th>
                      <th>Change Role</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((u) => (
                      <tr key={u.uid} className="border-white/5">
                        <td className="text-xs">{u.email}</td>
                        <td className="text-xs text-white/60">{u.name || "-"}</td>
                        <td>
                          <span className={`badge badge-xs ${
                            u.role === "ADMIN" ? "badge-primary" : 
                            u.role === "BUYER" ? "badge-secondary" : "badge-outline"
                          }`}>
                            {u.role}
                          </span>
                        </td>
                        <td>
                          <select
                            className="select select-xs bg-black border-white/10"
                            value={u.role}
                            onChange={(e) => handleRoleChange(u.uid, e.target.value)}
                            disabled={u.uid === user?.uid}
                          >
                            <option value="SOLVER">SOLVER</option>
                            <option value="BUYER">BUYER</option>
                            <option value="ADMIN">ADMIN</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Projects Overview */}
          <div className="bg-base-100 border border-white/5 rounded-lg p-4">
            <h2 className="text-sm font-medium mb-4 flex items-center gap-2">
              <HiOutlineCollection className="w-4 h-4" /> All Projects
            </h2>
            <div className="space-y-2">
              {projects.slice(0, 5).map((project) => (
                <div key={project._id} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                  <div>
                    <p className="text-xs font-medium">{project.title}</p>
                    <p className="text-xs text-white/40">{project.buyerEmail}</p>
                  </div>
                  <span className={`badge badge-xs ${
                    project.status === "OPEN" ? "badge-primary" :
                    project.status === "ASSIGNED" ? "badge-secondary" : "badge-outline"
                  }`}>
                    {project.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
