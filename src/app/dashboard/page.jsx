"use client";
import React from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Dashboard() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/login");
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
      <div className="card bg-base-100 shadow-xl border border-base-200">
        <div className="card-body">
          <h2 className="card-title">Welcome, {user.email}</h2>
          <div className="badge badge-primary mb-4">{user.role}</div>
          <p>This is your personal dashboard.</p>
          
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
             {user.role === 'SOLVER' && (
                <div className="stats shadow">
                  <div className="stat">
                    <div className="stat-title">Tasks Completed</div>
                    <div className="stat-value">0</div>
                    <div className="stat-desc">Start browsing projects</div>
                  </div>
                </div>
             )}
             {user.role === 'BUYER' && (
                <div className="stats shadow">
                  <div className="stat">
                    <div className="stat-title">Active Projects</div>
                    <div className="stat-value">0</div>
                    <div className="stat-desc">Post a new project</div>
                  </div>
                </div>
             )}
          </div>
        </div>
      </div>
    </div>
  );
}
