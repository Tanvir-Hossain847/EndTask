import React from 'react';
import Link from 'next/link';

export default function Core() {
  const steps = [
    { title: "Post", desc: "Buyers define project scope", icon: "📝", color: "bg-blue-500/10 text-blue-600" },
    { title: "Match", desc: "Solvers request & get assigned", icon: "🤝", color: "bg-purple-500/10 text-purple-600" },
    { title: "Execute", desc: "Tasks tracked in real-time", icon: "⚙️", color: "bg-orange-500/10 text-orange-600" },
    { title: "Deliver", desc: "Final artifacts verified", icon: "✅", color: "bg-green-500/10 text-green-600" },
  ];

  return (
    <div className="min-h-screen bg-base-100">
      {/* --- HERO SECTION --- */}
      <section className="hero py-20 bg-base-200">
        <div className="hero-content text-center">
          <div className="max-w-2xl">
            <h1 className="text-5xl font-bold leading-tight">
              The Protocol for <span className="text-primary">Problem Solving</span>
            </h1>
            <p className="py-6 text-lg opacity-70">
              A role-based marketplace designed for state-correctness. 
              Enforcing rigid transitions from <b>DRAFT</b> to <b>COMPLETED</b>.
            </p>
            <div className="flex gap-4 justify-center">
              <Link href="/register" className="btn btn-primary px-8">Get Started</Link>
              <Link href="/projects" className="btn btn-outline px-8">Browse Work</Link>
            </div>
          </div>
        </div>
      </section>

      {/* --- WORKFLOW STEPS --- */}
      <section className="py-20 px-4 max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold">System Architecture</h2>
          <p className="opacity-60">A finite-state machine with strict permissions.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, index) => (
            <div key={index} className="card bg-base-100 shadow-sm border border-base-300 hover:border-primary transition-colors">
              <div className="card-body items-center text-center">
                <div className={`w-12 h-12 ${step.color} rounded-lg flex items-center justify-center text-2xl mb-2`}>
                  {step.icon}
                </div>
                <h3 className="card-title text-sm uppercase tracking-widest">{step.title}</h3>
                <p className="text-xs opacity-70">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* --- ROLE GOVERNANCE --- */}
      <section className="bg-neutral text-neutral-content py-20">
        <div className="max-w-5xl mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl font-bold mb-6">Role-Based Governance</h2>
            <div className="space-y-4">
              <div className="flex items-center gap-4 bg-white/5 p-4 rounded-lg">
                <div className="badge badge-primary">Buyer</div>
                <p className="text-sm">Creates projects & reviews submissions.</p>
              </div>
              <div className="flex items-center gap-4 bg-white/5 p-4 rounded-lg">
                <div className="badge badge-secondary">Solver</div>
                <p className="text-sm">Manages tasks & uploads ZIP files.</p>
              </div>
              <div className="flex items-center gap-4 bg-white/5 p-4 rounded-lg">
                <div className="badge badge-accent">Admin</div>
                <p className="text-sm">Governs system access & role assignment.</p>
              </div>
            </div>
          </div>
          
          {/* Static State Visualizer */}
          <div className="bg-base-300 p-8 rounded-2xl text-base-content border border-base-100">
             <div className="flex justify-between items-center mb-4">
                <span className="font-mono text-[10px] uppercase opacity-50">System Truth</span>
                <div className="badge badge-success badge-sm">IN_PROGRESS</div>
             </div>
             <div className="space-y-4">
                <div className="w-full bg-base-100 rounded-full h-2">
                  <div className="bg-primary h-2 rounded-full" style={{ width: '65%' }}></div>
                </div>
                <div className="flex justify-between text-[10px] font-bold opacity-70 uppercase">
                    <span>Task List Generated</span>
                    <span>65% Complete</span>
                </div>
             </div>
          </div>
        </div>
      </section>
    </div>
  );
}