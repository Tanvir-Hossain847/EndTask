"use client";

import React from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push("/auth/login");
  };

  const renderLinks = () => {
    if (loading) return null;
    if (!user) {
      return (
        <li>
          <Link href="/auth/login">Login</Link>
        </li>
      );
    }

    switch (user.role) {
      case "ADMIN":
        return (
          <>
            <li>
              <Link href="/admin/dashboard">User Governance</Link>
            </li>
            <li>
              <Link href="/admin/audit">System Audit</Link>
            </li>
          </>
        );
      case "BUYER":
        return (
          <>
            <li>
              <Link href="/projects/create">Post a Project</Link>
            </li>
            <li>
              <Link href="/projects/my-listings">My Projects</Link>
            </li>
          </>
        );
      case "SOLVER":
        return (
          <>
            <li>
              <Link href="/projects/browse">Browse Projects</Link>
            </li>
            <li>
              <Link href="/solver/my-tasks">My Tasks</Link>
            </li>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="navbar bg-base-100 shadow-sm px-4 lg:px-8">
      <div className="navbar-start">
        {/* Mobile Dropdown */}
        <div className="dropdown">
          <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h8m-8 6h16"
              />
            </svg>
          </div>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow"
          >
            {renderLinks()}
          </ul>
        </div>
        <Link
          href="/"
          className="btn btn-ghost text-xl font-bold tracking-tight"
        >
          END<span className="text-primary">TASK</span>
        </Link>
      </div>

      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1 gap-2">{renderLinks()}</ul>
      </div>

      <div className="navbar-end gap-2">
        {user ? (
          <div className="flex items-center gap-4">
            {user.role === "SOLVER" && (
              <div className="flex flex-col items-end mr-2">
                <span className="text-xs text-white/40 uppercase tracking-widest text-[10px]">
                  Balance
                </span>
                <span className="text-sm font-medium text-primary font-mono">
                  ${user.balance?.toLocaleString() || 0}
                </span>
              </div>
            )}

            <div className="dropdown dropdown-end">
              <div
                tabIndex={0}
                role="button"
                className="flex items-center gap-2 pl-4 border-l border-white/10 cursor-pointer hover:bg-white/5 p-1 rounded-lg transition-colors"
              >
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-medium leading-none">
                    {user.name || user.email.split("@")[0]}
                  </p>
                  <p
                    className={`text-[10px] uppercase tracking-wide mt-1 ${
                      user.role === "ADMIN"
                        ? "text-success"
                        : user.role === "SOLVER"
                          ? "text-primary"
                          : "text-secondary"
                    }`}
                  >
                    {user.role}
                  </p>
                </div>
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border ${
                    user.role === "ADMIN"
                      ? "bg-success/10 border-success text-success"
                      : user.role === "SOLVER"
                        ? "bg-primary/10 border-primary text-primary"
                        : "bg-secondary/10 border-secondary text-secondary"
                  }`}
                >
                  {user.email[0].toUpperCase()}
                </div>
              </div>
              <ul
                tabIndex={0}
                className="dropdown-content z-[1] menu p-2 shadow-2xl bg-base-100 rounded-box w-52 border border-white/10 mt-4"
              >
                <li className="menu-title opacity-50 text-[10px] tracking-widest uppercase">
                  {user.role} Account
                </li>
                <div className="divider my-0 opacity-10"></div>
                <li>
                  <Link href="/dashboard">Dashboard</Link>
                </li>
                <li>
                  <Link href="/profile">Profile Settings</Link>
                </li>
                <div className="divider my-0 opacity-10"></div>
                <li>
                  <button onClick={handleLogout} className="text-error">
                    Sign Out
                  </button>
                </li>
              </ul>
            </div>
          </div>
        ) : (
          <div className="flex gap-2">
            <Link href="/auth/login" className="btn btn-ghost btn-sm">
              Login
            </Link>
            <Link href="/auth/register" className="btn btn-primary btn-sm">
              Join
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
