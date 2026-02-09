"use client";
import React from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import { HiOutlineDocumentReport, HiOutlineCheckCircle, HiOutlineClock } from "react-icons/hi";

export default function AuditPage() {
  // Mock audit logs
  const auditLogs = [
    { id: 1, action: "User Login", user: "john@example.com", time: "2 minutes ago", type: "info" },
    { id: 2, action: "Project Created", user: "buyer@example.com", time: "15 minutes ago", type: "success" },
    { id: 3, action: "Failed Login Attempt", user: "unknown@test.com", time: "1 hour ago", type: "warning" },
    { id: 4, action: "Role Changed", user: "admin@example.com", time: "3 hours ago", type: "info" },
    { id: 5, action: "Project Completed", user: "solver@example.com", time: "5 hours ago", type: "success" },
  ];

  const getTypeIcon = (type) => {
    switch (type) {
      case "success":
        return <HiOutlineCheckCircle className="w-3.5 h-3.5 text-primary" />;
      case "warning":
        return <HiOutlineClock className="w-3.5 h-3.5 text-primary/60" />;
      default:
        return <HiOutlineClock className="w-3.5 h-3.5 text-primary/40" />;
    }
  };

  return (
    <ProtectedRoute allowedRoles={["ADMIN"]}>
      <div className="min-h-screen bg-black py-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center gap-2 mb-6">
            <HiOutlineDocumentReport className="w-5 h-5 text-primary" />
            <h1 className="text-base font-medium">System Audit</h1>
          </div>

          <div className="grid grid-cols-4 gap-3 mb-6">
            <div className="bg-base-100 border border-white/5 rounded-lg p-3">
              <p className="text-xs text-white/40 mb-1">Total Events</p>
              <p className="text-lg font-medium text-primary">1,234</p>
            </div>
            <div className="bg-base-100 border border-white/5 rounded-lg p-3">
              <p className="text-xs text-white/40 mb-1">Today</p>
              <p className="text-lg font-medium text-primary">56</p>
            </div>
            <div className="bg-base-100 border border-white/5 rounded-lg p-3">
              <p className="text-xs text-white/40 mb-1">Warnings</p>
              <p className="text-lg font-medium text-primary/70">3</p>
            </div>
            <div className="bg-base-100 border border-white/5 rounded-lg p-3">
              <p className="text-xs text-white/40 mb-1">Errors</p>
              <p className="text-lg font-medium text-primary/50">0</p>
            </div>
          </div>

          <div className="bg-base-100 border border-white/5 rounded-lg p-4">
            <h2 className="text-sm font-medium mb-4">Recent Activity</h2>
            <div className="overflow-x-auto">
              <table className="table table-xs">
                <thead>
                  <tr className="text-white/40 border-white/5">
                    <th className="font-normal text-xs">Status</th>
                    <th className="font-normal text-xs">Action</th>
                    <th className="font-normal text-xs">User</th>
                    <th className="font-normal text-xs">Time</th>
                  </tr>
                </thead>
                <tbody>
                  {auditLogs.map((log) => (
                    <tr key={log.id} className="border-white/5 hover:bg-white/5">
                      <td>{getTypeIcon(log.type)}</td>
                      <td className="text-xs">{log.action}</td>
                      <td className="text-xs text-white/50">{log.user}</td>
                      <td className="text-xs text-white/30">{log.time}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
