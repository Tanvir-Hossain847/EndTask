"use client";
import React, { useState, useEffect } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { HiOutlineSearch, HiOutlineCurrencyDollar, HiOutlineClock, HiOutlineCheckCircle } from "react-icons/hi";

export default function BrowseProjectsPage() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("All");
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [requested, setRequested] = useState({});

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await fetch("/api/projects?status=OPEN");
      if (res.ok) {
        const data = await res.json();
        setProjects(data);
      }
    } catch (error) {
      console.error("Failed to fetch projects:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async (projectId) => {
    try {
      const res = await fetch(`/api/projects/${projectId}/requests`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          solverId: user.uid,
          solverEmail: user.email,
          solverName: user.name || "",
          message: "I'm interested in this project.",
        }),
      });
      if (res.ok) {
        setRequested((prev) => ({ ...prev, [projectId]: true }));
      }
    } catch (error) {
      console.error("Apply failed:", error);
    }
  };

  const filteredProjects = projects.filter((p) => {
    const matchesSearch = p.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = category === "All" || p.category === category;
    return matchesSearch && matchesCategory;
  });

  const formatDeadline = (deadline) => {
    if (!deadline) return "No deadline";
    const date = new Date(deadline);
    const now = new Date();
    const diff = Math.ceil((date - now) / (1000 * 60 * 60 * 24));
    if (diff < 0) return "Overdue";
    if (diff === 0) return "Today";
    if (diff === 1) return "Tomorrow";
    return `${diff} days`;
  };

  return (
    <ProtectedRoute allowedRoles={["SOLVER", "ADMIN"]}>
      <div className="min-h-screen bg-black py-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center gap-3 mb-6">
            <HiOutlineSearch className="w-5 h-5 text-primary" />
            <h1 className="text-base font-medium">Browse Projects</h1>
          </div>

          {/* Filters */}
          <div className="bg-base-100 border border-white/5 rounded-lg p-4 mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Search projects..."
                  className="input input-bordered input-sm w-full bg-black border-white/10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <select
                className="select select-bordered select-sm bg-black border-white/10"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option>All</option>
                <option>Web Development</option>
                <option>Mobile Development</option>
                <option>Backend Development</option>
                <option>DevOps</option>
              </select>
            </div>
          </div>

          {/* Loading */}
          {loading && (
            <div className="flex justify-center py-12">
              <span className="loading loading-spinner loading-md text-primary"></span>
            </div>
          )}

          {/* Results */}
          {!loading && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredProjects.map((project) => (
                <div
                  key={project._id}
                  className="bg-base-100 border border-white/5 rounded-lg p-4 hover:border-white/10 transition-colors"
                >
                  <div className="badge badge-outline badge-xs text-white/40 mb-2">{project.category}</div>
                  <h2 className="text-sm font-medium mb-1">{project.title}</h2>
                  <p className="text-xs text-white/40 line-clamp-2 mb-3">{project.description}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <HiOutlineCurrencyDollar className="w-4 h-4 text-primary" />
                        <span className="text-xs font-medium">${project.budget}</span>
                      </div>
                      <div className="flex items-center gap-1 text-white/40">
                        <HiOutlineClock className="w-3 h-3" />
                        <span className="text-xs">{formatDeadline(project.deadline)}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Link href={`/projects/${project._id}`} className="btn btn-ghost btn-xs">
                        Details
                      </Link>
                      {requested[project._id] ? (
                        <span className="btn btn-ghost btn-xs text-primary gap-1">
                          <HiOutlineCheckCircle className="w-3 h-3" /> Applied
                        </span>
                      ) : (
                        <button onClick={() => handleApply(project._id)} className="btn btn-primary btn-xs">
                          Apply
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Empty State */}
          {!loading && filteredProjects.length === 0 && (
            <div className="text-center py-12 text-white/40">
              <HiOutlineSearch className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p className="text-sm">No projects found</p>
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
