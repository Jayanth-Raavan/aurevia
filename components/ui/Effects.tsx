"use client";

import { useEffect, useRef, useState } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "@/hooks/useReducedMotion";

export function Effects() {
  const reduced = useReducedMotion();
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    if (reduced) return;
    const lenis = new Lenis({ duration: 1.1, smoothWheel: true, wheelMultiplier: 0.9 });
    let raf = 0;
    const animate = (time: number) => {
      lenis.raf(time);
      raf = requestAnimationFrame(animate);
    };
    raf = requestAnimationFrame(animate);
    lenis.on("scroll", ScrollTrigger.update);
    const onAnchor = (event: MouseEvent) => {
      const anchor = (event.target as HTMLElement).closest<HTMLAnchorElement>('a[href^="#"]');
      if (anchor?.hash && document.querySelector(anchor.hash)) {
        event.preventDefault();
        lenis.scrollTo(anchor.hash, { offset: 0, duration: 1.1 });
        history.replaceState(null, "", anchor.hash);
      }
    };
    document.addEventListener("click", onAnchor);
    return () => {
      document.removeEventListener("click", onAnchor);
      cancelAnimationFrame(raf);
      lenis.destroy();
    };
  }, [reduced]);

  useEffect(() => {
    if (reduced) return;
    const elements = gsap.utils.toArray<HTMLElement>(".line-reveal");
    const instances = elements.map((el) => gsap.fromTo(el,
      { clipPath: "inset(0 0 100% 0)", y: 34 },
      { clipPath: "inset(0 0 0% 0)", y: 0, duration: 1.25, ease: "power3.out", scrollTrigger: { trigger: el, start: "top 86%", once: true } }
    ));
    return () => { instances.forEach((instance) => instance.kill()); };
  }, [reduced]);

  useEffect(() => {
    if (reduced) return;
    const diagram = document.querySelector<HTMLElement>(".manifesto-signal");
    if (!diagram) return;
    const reveal = gsap.fromTo(diagram,
      { autoAlpha: 0, scale: 0.88, rotation: -8 },
      { autoAlpha: 1, scale: 1, rotation: 0, duration: 1.4, ease: "power3.out", scrollTrigger: { trigger: diagram, start: "top 86%", once: true } }
    );
    return () => { reveal.scrollTrigger?.kill(); reveal.kill(); };
  }, [reduced]);

  useEffect(() => {
    if (reduced || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const elements = document.querySelectorAll<HTMLElement>(".nav-cta, .contact-primary");
    const cleanups = [...elements].map((element) => {
      const move = (event: PointerEvent) => {
        const rect = element.getBoundingClientRect();
        const x = (event.clientX - rect.left - rect.width / 2) * 0.12;
        const y = (event.clientY - rect.top - rect.height / 2) * 0.12;
        element.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      };
      const leave = () => { element.style.transform = ""; };
      element.addEventListener("pointermove", move);
      element.addEventListener("pointerleave", leave);
      return () => { element.removeEventListener("pointermove", move); element.removeEventListener("pointerleave", leave); element.style.transform = ""; };
    });
    return () => cleanups.forEach((cleanup) => cleanup());
  }, [reduced]);
  return <Cursor />;
}

function Cursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);
  useEffect(() => {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    setEnabled(true);
    let x = -100, y = -100, rx = -100, ry = -100, raf = 0;
    const move = (event: PointerEvent) => {
      x = event.clientX; y = event.clientY;
      const target = (event.target as HTMLElement).closest<HTMLElement>("a, button, input, textarea, [data-cursor]");
      const label = target?.dataset.cursor || (target ? "VIEW" : "");
      if (ring.current) {
        ring.current.dataset.label = label;
        ring.current.classList.toggle("cursor-active", !!target);
      }
    };
    const frame = () => {
      rx += (x - rx) * 0.14; ry += (y - ry) * 0.14;
      if (dot.current) dot.current.style.transform = `translate3d(${x}px,${y}px,0)`;
      if (ring.current) ring.current.style.transform = `translate3d(${rx}px,${ry}px,0)`;
      raf = requestAnimationFrame(frame);
    };
    document.addEventListener("pointermove", move);
    raf = requestAnimationFrame(frame);
    return () => { document.removeEventListener("pointermove", move); cancelAnimationFrame(raf); };
  }, []);
  if (!enabled) return null;
  return <><div ref={dot} className="cursor-dot" aria-hidden="true" /><div ref={ring} className="cursor-ring" aria-hidden="true"><span /></div></>;
}
