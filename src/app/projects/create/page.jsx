"use client";
import React, { useState } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { HiOutlineDocumentAdd, HiOutlineCurrencyDollar, HiOutlineCalendar } from "react-icons/hi";

export default function CreateProjectPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    budget: "",
    category: "Web Development",
    deadline: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          budget: Number(formData.budget),
          buyerId: user.uid,
          buyerEmail: user.email,
          buyerName: user.name || "",
        }),
      });

      if (res.ok) {
        router.push("/projects/my-listings");
      } else {
        const data = await res.json();
        setError(data.error || "Failed to create project");
      }
    } catch (err) {
      setError("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProtectedRoute allowedRoles={["BUYER", "ADMIN"]}>
      <div className="min-h-screen bg-black py-12">
        <div className="max-w-3xl mx-auto px-4">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 bg-primary/10 rounded-xl">
              <HiOutlineDocumentAdd className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-white">Post a New Project</h1>
              <p className="text-sm text-white/40">Provide details to attract the best solvers</p>
            </div>
          </div>

          <div className="bg-base-100 border border-white/5 rounded-2xl p-6 md:p-8 relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

            {error && (
              <div className="alert alert-error bg-error/10 border-error/20 text-error mb-6 text-sm">
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6 relative">
              {/* Project Title */}
              <div className="form-control w-full">
                <label className="label px-0">
                  <span className="label-text text-sm font-medium text-white/80">Project Title</span>
                </label>
                <input
                  type="text"
                  className="input flex items-center w-full bg-black border border-white/10 focus:border-primary/50 focus:outline-none transition-colors rounded-lg px-4 h-12"
                  placeholder="e.g. Build a Responsive Portfolio Website"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Category */}
                <div className="form-control w-full">
                  <label className="label px-0">
                    <span className="label-text text-sm font-medium text-white/80">Category</span>
                  </label>
                  <select
                    className="select w-full bg-black border border-white/10 focus:border-primary/50 focus:outline-none transition-colors rounded-lg px-4 h-12"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  >
                    <option>Web Development</option>
                    <option>Mobile Development</option>
                    <option>Backend Development</option>
                    <option>DevOps</option>
                    <option>Data Science</option>
                    <option>Design & Creative</option>
                    <option>Other</option>
                  </select>
                </div>

                {/* Deadline */}
                <div className="form-control w-full">
                  <label className="label px-0">
                    <span className="label-text text-sm font-medium text-white/80">Deadline</span>
                  </label>
                  <div className="relative">
                    <HiOutlineCalendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30 pointer-events-none" />
                    <input
                      type="date"
                      className="input flex items-center w-full bg-black border border-white/10 focus:border-primary/50 focus:outline-none transition-colors rounded-lg pl-12 pr-4 h-12 text-white/80"
                      value={formData.deadline}
                      onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="form-control w-full">
                <label className="label px-0">
                  <span className="label-text text-sm font-medium text-white/80">Description</span>
                  <span className="label-text-alt text-white/30">Markdown supported</span>
                </label>
                <textarea
                  className="textarea w-full bg-black border border-white/10 focus:border-primary/50 focus:outline-none transition-colors rounded-lg p-4 h-40 text-base leading-relaxed resize-none"
                  placeholder="Describe your project requirements, deliverables, and any technical constraints..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                />
              </div>

              {/* Budget */}
              <div className="form-control w-full">
                <label className="label px-0">
                  <span className="label-text text-sm font-medium text-white/80">Budget</span>
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center bg-white/5 rounded-md text-white/50">
                    <HiOutlineCurrencyDollar className="w-5 h-5" />
                  </div>
                  <input
                    type="number"
                    className="input flex items-center w-full bg-black border border-white/10 focus:border-primary/50 focus:outline-none transition-colors rounded-lg pl-16 pr-4 h-12 text-lg font-medium"
                    placeholder="1000"
                    value={formData.budget}
                    onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                    required
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-white/30">USD</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-6 border-t border-white/5 mt-8">
                <button
                  type="button"
                  onClick={() => router.back()}
                  className="btn btn-ghost hover:bg-white/5 text-white/60 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`btn btn-primary px-8 ${loading ? "loading" : ""}`}
                  disabled={loading}
                >
                  {loading ? "Posting..." : "Post Project"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
