"use Client";
import React from 'react';
import Link from 'next/link';

export default function Navbar({ user, onLogout }) {
  // Logic to determine links based on user role
  const renderLinks = () => {
    if (!user) {
      return (
        <li><Link href="/login">Login</Link></li>
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
          WORK<span className="text-primary">FLOW</span>
        </Link>
      </div>

      {/* Desktop Menu */}
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1 gap-2">
          {renderLinks()}
        </ul>
      </div>

      <div className="navbar-end gap-2">
        {user ? (
          <div className="dropdown dropdown-end">
            <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar placeholder">
              <div className="bg-neutral text-neutral-content rounded-full w-10">
                <span>{user.name?.charAt(0)}</span>
              </div>
            </div>
            <ul tabIndex={0} className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52">
              <li className="menu-title text-xs opacity-50">{user.role}</li>
              <li><Link href="/profile">Profile Settings</Link></li>
              <li><button onClick={onLogout} className="text-error">Logout</button></li>
            </ul>
          </div>
        ) : (
          <Link href="/register" className="btn btn-primary btn-sm">Join Marketplace</Link>
        )}
      </div>
    </div>
  );
}