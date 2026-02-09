"use client";

import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("SOLVER");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { register } = useAuth();

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const result = await register(email, password, role);
    if (result.success) {
      router.push("/dashboard");
    } else {
      setError(result.error || "Registration failed.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-base-300 to-base-100 p-6">
      <div className="card w-full max-w-md bg-base-100 shadow-2xl border border-white/10">
        <div className="card-body p-8">
          <div className="text-center mb-6">
            <h2 className="text-3xl font-extrabold tracking-tight">Create Account</h2>
            <p className="text-sm opacity-60">Join the Marketplace</p>
          </div>

          {error && (
            <div className="alert alert-error shadow-sm py-2 text-sm rounded-lg mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-4 w-4" fill="none" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleRegister} className="flex flex-col gap-5">
            <div className="form-control w-full">
              <label className="label pt-0 pb-1">
                <span className="label-text text-xs font-bold uppercase tracking-wide">I want to join as:</span>
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  className={`btn h-12 ${role === "SOLVER" ? "btn-primary" : "btn-outline"}`}
                  onClick={() => setRole("SOLVER")}
                >
                  Solver
                </button>
                <button
                  type="button"
                  className={`btn h-12 ${role === "BUYER" ? "btn-primary" : "btn-outline"}`}
                  onClick={() => setRole("BUYER")}
                >
                  Buyer
                </button>
              </div>
            </div>

            <div className="form-control w-full">
              <label className="label pt-0 pb-1">
                <span className="label-text text-xs font-bold uppercase tracking-wide">Email Address</span>
              </label>
              <input
                type="email"
                placeholder="you@example.com"
                className="input input-bordered w-full focus:input-primary transition-all h-12"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-control w-full">
              <label className="label pt-0 pb-1">
                <span className="label-text text-xs font-bold uppercase tracking-wide">Password</span>
              </label>
              <input
                type="password"
                placeholder="••••••••"
                className="input input-bordered w-full focus:input-primary transition-all h-12"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className={`btn btn-neutral w-full mt-2 h-12 text-lg ${loading ? "loading" : ""}`}
              disabled={loading}
            >
              {loading ? "Creating Account..." : "Get Started"}
            </button>
          </form>

          <div className="text-center mt-8 text-sm">
            <span className="opacity-60">Already have an account? </span>
            <Link href="/auth/login" className="font-bold text-primary hover:underline">
              Login here
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}