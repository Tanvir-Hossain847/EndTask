import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

// Animation Variants for reusability
const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2 }
  }
};

export default function Home() {
  const steps = [
    { title: "Post", desc: "Buyers define project scope", icon: "📝", color: "bg-blue-500/10 text-blue-500" },
    { title: "Match", desc: "Solvers request & get assigned", icon: "🤝", color: "bg-purple-500/10 text-purple-500" },
    { title: "Execute", desc: "Tasks tracked in real-time", icon: "⚙️", color: "bg-orange-500/10 text-orange-500" },
    { title: "Deliver", desc: "Final artifacts verified", icon: "✅", color: "bg-green-500/10 text-green-500" },
  ];

  return (
    <div className="min-h-screen bg-base-100 overflow-x-hidden">
      
      {/* --- HERO SECTION --- */}
      <section className="hero min-h-[80vh] bg-gradient-to-b from-base-200 to-base-100">
        <div className="hero-content text-center">
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            className="max-w-3xl"
          >
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="badge badge-outline badge-primary mb-4 py-3 px-6"
            >
              🚀 Version 1.0 State-Engine Ready
            </motion.div>
            
            <h1 className="text-6xl font-black tracking-tight mb-6">
              The Protocol for <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
                Problem Solving
              </span>
            </h1>
            
            <p className="py-6 text-xl opacity-70 leading-relaxed">
              A high-integrity project marketplace. We don't just connect people; 
              we enforce a <b>finite-state machine</b> to ensure work actually gets done.
            </p>

            <div className="flex gap-4 justify-center">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link href="/register" className="btn btn-primary btn-lg px-10 shadow-lg shadow-primary/20">
                  Start a Project
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link href="/projects/browse" className="btn btn-ghost btn-lg px-10">
                  Browse Work
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* --- WORKFLOW STEPPER (STAGGERED ANIMATION) --- */}
      <section className="py-24 px-4 max-w-7xl mx-auto">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="grid grid-cols-1 md:grid-cols-4 gap-8"
        >
          {steps.map((step, index) => (
            <motion.div 
              key={index}
              variants={fadeInUp}
              whileHover={{ y: -10 }}
              className="card bg-base-100 shadow-2xl border border-base-300 relative overflow-hidden group"
            >
              <div className="card-body items-center text-center p-8">
                <div className={`w-16 h-16 ${step.color} rounded-2xl flex items-center justify-center text-3xl mb-4 transition-transform group-hover:rotate-12`}>
                  {step.icon}
                </div>
                <h3 className="card-title text-sm uppercase tracking-[0.2em] mb-2">{step.title}</h3>
                <p className="text-sm opacity-60 leading-relaxed">{step.desc}</p>
              </div>
              {/* Visual connector for desktop */}
              {index < 3 && (
                <div className="hidden md:block absolute top-1/2 -right-4 translate-z-0 z-10 opacity-20">
                   <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                </div>
              )}
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* --- LIVE STATE PREVIEW SECTION --- */}
      <section className="bg-neutral text-neutral-content py-24 relative overflow-hidden">
        {/* Background Decorative Blob */}
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0]
          }}
          transition={{ duration: 20, repeat: Infinity }}
          className="absolute -top-24 -left-24 w-96 h-96 bg-primary/10 rounded-full blur-3xl"
        />

        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold mb-8">Role-Based Governance</h2>
            <div className="space-y-6">
              {[
                { role: "Buyer", task: "Accepts/Rejects Submissions", color: "badge-primary" },
                { role: "Solver", task: "Owns Delivery & ZIP Uploads", color: "badge-secondary" },
                { role: "Admin", task: "Manages Access & Roles", color: "badge-accent" }
              ].map((item, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.2 }}
                  className="flex items-center gap-4 bg-white/5 p-4 rounded-xl border border-white/10"
                >
                  <span className={`badge ${item.color} badge-lg font-bold`}>{item.role}</span>
                  <span className="text-sm opacity-80">{item.task}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
          
          <motion.div 
             initial={{ opacity: 0, scale: 0.8 }}
             whileInView={{ opacity: 1, scale: 1 }}
             viewport={{ once: true }}
             className="bg-base-100 p-8 rounded-3xl shadow-3xl text-base-content border border-white/10"
          >
             <div className="flex justify-between items-center mb-8">
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase tracking-widest opacity-50 font-bold">Project ID: 8802</span>
                  <span className="font-bold text-lg">E-Commerce Audit</span>
                </div>
                <motion.div 
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="badge badge-success gap-2"
                >
                  <span className="w-2 h-2 rounded-full bg-current animate-pulse" />
                  IN_PROGRESS
                </motion.div>
             </div>

             <div className="space-y-6">
                <div>
                  <div className="flex justify-between text-xs mb-2 font-mono">
                    <span>Task Completion</span>
                    <span>75%</span>
                  </div>
                  <div className="h-3 bg-base-300 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        whileInView={{ width: '75%' }}
                        transition={{ duration: 2, delay: 0.5 }}
                        className="h-full bg-gradient-to-r from-primary to-secondary"
                      />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                   <div className="p-3 bg-base-200 rounded-lg border border-base-300">
                      <p className="text-[10px] opacity-50 uppercase">Requests</p>
                      <p className="text-xl font-bold">12</p>
                   </div>
                   <div className="p-3 bg-base-200 rounded-lg border border-base-300">
                      <p className="text-[10px] opacity-50 uppercase">Timeline</p>
                      <p className="text-xl font-bold">4 Days</p>
                   </div>
                </div>
             </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}