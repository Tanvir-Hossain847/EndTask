"use client";
import React from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import {
  HiOutlineHome,
  HiOutlineCollection,
  HiOutlineDocumentAdd,
  HiOutlineSearch,
  HiOutlineClipboardList,
  HiOutlineUsers,
  HiOutlineShieldCheck,
  HiOutlineCog,
  HiOutlineLogout,
} from "react-icons/hi";

export default function Dashboard() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/login");
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <span className="loading loading-spinner loading-md text-primary"></span>
      </div>
    );
  }

  const handleLogout = async () => {
    await logout();
    router.push("/auth/login");
  };

  const getSidebarItems = () => {
    const common = [
      { icon: HiOutlineHome, label: "Dashboard", href: "/dashboard", active: true },
    ];

    const roleItems = {
      ADMIN: [
        { icon: HiOutlineUsers, label: "Users", href: "/admin/dashboard" },
        { icon: HiOutlineShieldCheck, label: "Audit", href: "/admin/audit" },
      ],
      BUYER: [
        { icon: HiOutlineDocumentAdd, label: "New Project", href: "/projects/create" },
        { icon: HiOutlineCollection, label: "My Projects", href: "/projects/my-listings" },
      ],
      SOLVER: [
        { icon: HiOutlineSearch, label: "Browse", href: "/projects/browse" },
        { icon: HiOutlineClipboardList, label: "My Tasks", href: "/solver/my-tasks" },
      ],
    };

    return [...common, ...(roleItems[user.role] || roleItems.SOLVER)];
  };

  return (
    <div className="flex min-h-screen bg-black">
      {/* Sidebar */}
      <aside className="w-56 bg-base-100 border-r border-white/5 flex flex-col">
        <div className="p-4 border-b border-white/5">
          <span className="text-sm font-bold tracking-tight">
            END<span className="text-primary">TASK</span>
          </span>
        </div>

        <nav className="flex-1 p-3">
          <ul className="menu menu-sm gap-1">
            {getSidebarItems().map((item, i) => (
              <li key={i}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-2 text-xs ${item.active ? "bg-primary/10 text-primary" : "text-white/60 hover:text-white"}`}
                >
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="p-3 border-t border-white/5">
          <ul className="menu menu-sm gap-1">
            <li>
              <Link href="/profile" className="flex items-center gap-2 text-xs text-white/60 hover:text-white">
                <HiOutlineCog className="w-4 h-4" />
                Settings
              </Link>
            </li>
            <li>
              <button onClick={handleLogout} className="flex items-center gap-2 text-xs text-white/60 hover:text-white">
                <HiOutlineLogout className="w-4 h-4" />
                Logout
              </button>
            </li>
          </ul>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-lg font-semibold">Dashboard</h1>
            <p className="text-xs text-white/40">Welcome back, {user.name || user.email?.split("@")[0]}</p>
          </div>
          <div className="badge badge-outline badge-sm text-primary border-primary/30">{user.role}</div>
        </div>

        {user.role === "ADMIN" && <AdminContent />}
        {user.role === "BUYER" && <BuyerContent user={user} />}
        {user.role === "SOLVER" && <SolverContent user={user} />}
        {!["ADMIN", "BUYER", "SOLVER"].includes(user.role) && <SolverContent user={user} />}
      </main>
    </div>
  );
}

function AdminContent() {
  const [stats, setStats] = useState({ users: 0, projects: 0, open: 0 });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [usersRes, projectsRes] = await Promise.all([
        fetch("/api/users/list"),
        fetch("/api/projects"),
      ]);
      const users = usersRes.ok ? await usersRes.json() : [];
      const projects = projectsRes.ok ? await projectsRes.json() : [];
      setStats({
        users: users.length,
        projects: projects.length,
        open: projects.filter(p => p.status === "OPEN").length,
      });
    } catch (e) {}
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-4">
        <StatCard label="Total Users" value={stats.users} />
        <StatCard label="Total Projects" value={stats.projects} />
        <StatCard label="Open Projects" value={stats.open} highlight />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <ActionCard title="User Management" desc="Manage users and roles" href="/admin/dashboard" />
        <ActionCard title="System Audit" desc="View activity logs" href="/admin/audit" />
      </div>
    </div>
  );
}

function BuyerContent({ user }) {
  const [stats, setStats] = useState({ total: 0, active: 0, completed: 0 });
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    fetchData();
  }, [user]);

  const fetchData = async () => {
    try {
      const res = await fetch(`/api/projects?buyerId=${user.uid}`);
      if (res.ok) {
        const data = await res.json();
        setProjects(data.slice(0, 3));
        setStats({
          total: data.length,
          active: data.filter(p => ["OPEN", "ASSIGNED"].includes(p.status)).length,
          completed: data.filter(p => p.status === "COMPLETED").length,
        });
      }
    } catch (e) {}
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-4">
        <StatCard label="My Projects" value={stats.total} />
        <StatCard label="Active" value={stats.active} />
        <StatCard label="Completed" value={stats.completed} highlight />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <ActionCard title="Post Project" desc="Create a new project" href="/projects/create" primary />
        <ActionCard title="My Listings" desc="Manage your projects" href="/projects/my-listings" />
      </div>
      {projects.length > 0 && (
        <div className="bg-base-100 border border-white/5 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium">Recent Projects</h3>
            <Link href="/projects/my-listings" className="text-xs text-primary">View all</Link>
          </div>
          <div className="space-y-2">
            {projects.map(p => (
              <div key={p._id} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                <span className="text-xs">{p.title}</span>
                <span className="badge badge-xs badge-primary">{p.status}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function SolverContent({ user }) {
  const [stats, setStats] = useState({ active: 0, completed: 0, total: 0 });
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    fetchData();
  }, [user]);

  const fetchData = async () => {
    try {
      const [tasksRes, projectsRes] = await Promise.all([
        fetch(`/api/tasks?solverEmail=${user.email}`),
        fetch("/api/projects?status=OPEN"),
      ]);
      
      if (tasksRes.ok) {
        const tasksData = await tasksRes.json();
        setTasks(tasksData.slice(0, 3));
        setStats({
          active: tasksData.filter(t => ["TODO", "IN_PROGRESS"].includes(t.status)).length,
          completed: tasksData.filter(t => t.status === "COMPLETED").length,
          total: tasksData.length,
        });
      }
      if (projectsRes.ok) {
        const projectsData = await projectsRes.json();
        setProjects(projectsData.slice(0, 3));
      }
    } catch (e) {}
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-4">
        <StatCard label="Active Tasks" value={stats.active} />
        <StatCard label="Completed" value={stats.completed} />
        <StatCard label="Total Tasks" value={stats.total} highlight />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <ActionCard title="Browse Projects" desc="Find new work" href="/projects/browse" primary />
        <ActionCard title="My Tasks" desc="View assigned tasks" href="/solver/my-tasks" />
      </div>
      
      {tasks.length > 0 && (
        <div className="bg-base-100 border border-white/5 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium">My Tasks</h3>
            <Link href="/solver/my-tasks" className="text-xs text-primary">View all</Link>
          </div>
          <div className="space-y-2">
            {tasks.map(t => (
              <div key={t._id} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                <div>
                  <p className="text-xs">{t.title}</p>
                  <p className="text-xs text-white/40">{t.projectTitle}</p>
                </div>
                <span className={`badge badge-xs ${t.status === "IN_PROGRESS" ? "badge-primary" : "badge-outline"}`}>
                  {t.status === "IN_PROGRESS" ? "Active" : t.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {projects.length > 0 && (
        <div className="bg-base-100 border border-white/5 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium">Available Projects</h3>
            <Link href="/projects/browse" className="text-xs text-primary">View all</Link>
          </div>
          <div className="space-y-2">
            {projects.map(p => (
              <div key={p._id} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                <span className="text-xs">{p.title}</span>
                <span className="text-xs text-primary">${p.budget}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({ label, value, highlight }) {
  return (
    <div className="bg-base-100 border border-white/5 rounded-lg p-4">
      <p className="text-xs text-white/40 mb-1">{label}</p>
      <p className={`text-xl font-semibold ${highlight ? "text-primary" : "text-white"}`}>{value}</p>
    </div>
  );
}

function ActionCard({ title, desc, href, primary }) {
  return (
    <Link
      href={href}
      className={`block rounded-lg p-4 border transition-colors ${
        primary
          ? "bg-primary/10 border-primary/20 hover:border-primary/40"
          : "bg-base-100 border-white/5 hover:border-white/10"
      }`}
    >
      <h3 className={`text-sm font-medium mb-1 ${primary ? "text-primary" : "text-white"}`}>{title}</h3>
      <p className="text-xs text-white/40">{desc}</p>
    </Link>
  );
}
