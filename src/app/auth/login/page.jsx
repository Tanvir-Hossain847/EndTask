"use client";

import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FaGoogle } from "react-icons/fa";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { login, googleLogin } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const result = await login(email, password);
    if (result.success) {
      router.push("/dashboard");
    } else {
      setError(result.error || "Invalid credentials.");
    }
    setLoading(false);
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError("");

    const result = await googleLogin();
    if (result.success) {
      router.push("/dashboard");
    } else {
      setError(result.error || "Google sign-in failed.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-base-300 to-base-100 p-6">
      <div className="card w-full max-w-md bg-base-100 shadow-2xl border border-white/10">
        <div className="card-body p-8">
          <div className="text-center mb-6">
            <h2 className="text-3xl font-extrabold tracking-tight">Welcome Back</h2>
            <p className="text-sm opacity-60">Log in to your account</p>
          </div>

          {error && (
            <div className="alert alert-error shadow-sm py-2 text-sm rounded-lg mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-4 w-4" fill="none" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{error}</span>
            </div>
          )}

          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={loading}
            className="btn btn-outline w-full flex items-center gap-3 border-base-300 hover:bg-base-200 h-12"
          >
            <FaGoogle className="text-lg text-primary" />
            Continue with Google
          </button>

          <div className="divider text-xs opacity-40 uppercase my-6">Or with Email</div>

          <form onSubmit={handleLogin} className="flex flex-col gap-5">
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
              className={`btn btn-primary w-full mt-2 h-12 text-lg ${loading ? "loading" : ""}`}
              disabled={loading}
            >
              Sign In
            </button>
          </form>

          <div className="text-center mt-8 text-sm">
            <span className="opacity-60">Don&apos;t have an account? </span>
            <Link href="/auth/register" className="font-bold text-primary hover:underline">
              Create one
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
