"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useSectionVisible } from "@/hooks/useSectionVisible";
import { useCompact } from "@/hooks/useCompact";

const ClosingCanvas = dynamic(() => import("./GlobeScene").then((m) => m.ClosingCanvas), { ssr: false });

export default function ClosingGlobe() {
  const progress = useRef(0);
  const container = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const compact = useCompact();
  const visible = useSectionVisible(container);
  useEffect(() => {
    const section = document.querySelector(".contact-section");
    const update = () => {
      if (!section) return;
      const rect = section.getBoundingClientRect();
      progress.current = Math.max(0, Math.min(1, -rect.top / Math.max(1, rect.height - innerHeight)));
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);
  return <div className="closing-globe" ref={container}>{visible && <ClosingCanvas progress={progress} reduced={reduced} compact={compact} />}</div>;
}
