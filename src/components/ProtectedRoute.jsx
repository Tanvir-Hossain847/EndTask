"use client";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ProtectedRoute({ children, allowedRoles = [] }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push("/auth/login");
      } else if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
        // Redirect to main dashboard if role is not allowed
        router.push("/dashboard"); 
      }
    }
  }, [user, loading, router, allowedRoles]);

  if (loading || !user || (allowedRoles.length > 0 && !allowedRoles.includes(user.role))) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="loading loading-spinner loading-lg text-primary"></span>
        <span className="ml-2">Verifying Access...</span>
      </div>
    );
  }

  return children;
}
