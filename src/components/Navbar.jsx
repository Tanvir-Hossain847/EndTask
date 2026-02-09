"use client";

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push('/auth/login');
  };

  const renderLinks = () => {
    if (loading) return null;
    if (!user) {
      return (
        <li><Link href="/auth/login">Login</Link></li>
      );
    }

    switch (user.role) {
      case 'ADMIN':
        return (
          <>
            <li><Link href="/admin/dashboard">User Governance</Link></li>
            <li><Link href="/admin/audit">System Audit</Link></li>
          </>
        );
      case 'BUYER':
        return (
          <>
            <li><Link href="/projects/create">Post a Project</Link></li>
            <li><Link href="/projects/my-listings">My Projects</Link></li>
          </>
        );
      case 'SOLVER':
        return (
          <>
            <li><Link href="/projects/browse">Browse Projects</Link></li>
            <li><Link href="/solver/my-tasks">My Tasks</Link></li>
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
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" />
            </svg>
          </div>
          <ul tabIndex={0} className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow">
            {renderLinks()}
          </ul>
        </div>
        <Link href="/" className="btn btn-ghost text-xl font-bold tracking-tight">
          END<span className="text-primary">TASK</span>
        </Link>
      </div>

      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1 gap-2">
          {renderLinks()}
        </ul>
      </div>

      <div className="navbar-end gap-2">
        {user ? (
          <div className="dropdown dropdown-end">
            <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar placeholder">
              <div className="bg-neutral text-neutral-content rounded-full w-10 border-2 border-primary/20">
                <span>{(user.name || user.email)?.charAt(0).toUpperCase()}</span>
              </div>
            </div>
            <ul tabIndex={0} className="mt-3 z-[1] p-2 shadow-xl menu menu-sm dropdown-content bg-base-100 rounded-box w-52 border border-base-200">
              <li className="menu-title text-xs opacity-50 uppercase tracking-widest">{user.role}</li>
              <div className="divider my-0 opacity-20"></div>
              <li><Link href="/profile">Profile Settings</Link></li>
              <li><button onClick={handleLogout} className="text-error font-semibold">Logout</button></li>
            </ul>
          </div>
        ) : (
          <div className="flex gap-2">
            <Link href="/auth/login" className="btn btn-ghost btn-sm">Login</Link>
            <Link href="/auth/register" className="btn btn-primary btn-sm">Join</Link>
          </div>
        )}
      </div>
    </div>
  );
}