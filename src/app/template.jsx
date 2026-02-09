"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

export default function Template({ children }) {
  const pathname = usePathname();
  const containerRef = useRef(null);

  useGSAP(() => {
    // Simple elegant fade-in and slide-up
    gsap.fromTo(
      containerRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }
    );
  }, { scope: containerRef, dependencies: [pathname] }); // Re-run on route change

  return (
    <div ref={containerRef} className="min-h-screen">
      {children}
    </div>
  );
}
