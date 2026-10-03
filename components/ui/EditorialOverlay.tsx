"use client";

import { ReactNode, useEffect, useRef } from "react";
import Image from "next/image";
import { ArrowUpRight, X } from "lucide-react";

export default function EditorialOverlay({ eyebrow, title, image, imageAlt, children, onClose }: {
  eyebrow: string; title: string; image: string; imageAlt: string; children: ReactNode; onClose: () => void;
}) {
  const closeButton = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    const priorOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButton.current?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (event.key !== "Tab" || !panel.current) return;
      const elements = [...panel.current.querySelectorAll<HTMLElement>('button:not([disabled]), a[href], input, textarea')];
      if (!elements.length) return;
      const first = elements[0], last = elements[elements.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = priorOverflow;
      previous?.focus();
    };
  }, [onClose]);
  return (
    <div className="editorial-overlay" role="dialog" aria-modal="true" aria-label={title}>
      <button className="editorial-backdrop" type="button" tabIndex={-1} onClick={onClose} aria-label="Close story" />
      <div className="editorial-panel" ref={panel}>
        <div className="editorial-panel-top"><span>AUREVIA / GLOBAL ADVISORY</span><button ref={closeButton} type="button" onClick={onClose}>CLOSE <X size={20} /></button></div>
        <div className="editorial-panel-body">
          <div className="editorial-panel-photo"><Image src={image} alt={imageAlt} fill sizes="(max-width: 800px) 100vw, 48vw" /></div>
          <div className="editorial-panel-copy"><span className="eyebrow">{eyebrow}</span><h2>{title}</h2>{children}<a href="#contact" onClick={onClose}>START A CONVERSATION <ArrowUpRight size={18} /></a></div>
        </div>
      </div>
    </div>
  );
}
