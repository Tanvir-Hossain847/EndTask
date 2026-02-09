"use client";
import React from "react";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function AdminDashboard() {
  return (
    <ProtectedRoute allowedRoles={['ADMIN']}>
      <div className="p-8">
        <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="card bg-base-100 shadow-xl border border-error/20">
            <div className="card-body">
              <h2 className="card-title text-error">System Audit</h2>
              <p>Review system logs and user activities.</p>
              <div className="card-actions justify-end">
                <button className="btn btn-error btn-sm">View Logs</button>
              </div>
            </div>
          </div>
           <div className="card bg-base-100 shadow-xl border border-base-200">
            <div className="card-body">
              <h2 className="card-title">User Governance</h2>
              <p>Manage users and roles.</p>
              <div className="card-actions justify-end">
                <button className="btn btn-neutral btn-sm">Manage Users</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
