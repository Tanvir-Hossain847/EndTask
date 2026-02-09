"use client";
import React from "react";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function Projects() {
  return (
    <ProtectedRoute allowedRoles={['SOLVER', 'BUYER', 'ADMIN']}>
      <div className="p-8 max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Browse Projects</h1>
        <div className="alert alert-info shadow-lg mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          <span>This is a placeholder for the projects list. Real data will come from Firestore.</span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Mock Project Card */}
          {[1, 2, 3].map((i) => (
             <div key={i} className="card bg-base-100 shadow-xl border border-base-200 hover:border-primary transition-colors cursor-pointer">
              <div className="card-body">
                <div className="badge badge-secondary mb-2">Web Development</div>
                <h2 className="card-title">E-commerce Platform Fixes</h2>
                <p className="text-sm opacity-70">Need help fixing cart issues on a Next.js site.</p>
                <div className="card-actions justify-between items-center mt-4">
                  <div className="font-bold text-lg">$500</div>
                  <button className="btn btn-primary btn-sm">View Details</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </ProtectedRoute>
  );
}
