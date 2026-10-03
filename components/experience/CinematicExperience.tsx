"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useSectionVisible } from "@/hooks/useSectionVisible";
import { useCompact } from "@/hooks/useCompact";

const HeroCanvas = dynamic(() => import("./GlobeScene").then((m) => m.HeroCanvas), { ssr: false });

export default function CinematicExperience() {
  const shell = useRef<HTMLElement>(null);
  const progress = useRef(0);
  const chapter = useRef<HTMLSpanElement>(null);
  const [ready, setReady] = useState(false);
  const reduced = useReducedMotion();
  const compact = useCompact();
  const visible = useSectionVisible(shell, true);

  useEffect(() => {
    let active = true;
    document.fonts.ready.then(() => requestAnimationFrame(() => {
      if (active) setReady(true);
    }));
    return () => { active = false; };
  }, []);

  useEffect(() => {
    if (!shell.current) return;
    gsap.registerPlugin(ScrollTrigger);
    const context = gsap.context(() => {
      const frames = gsap.utils.toArray<HTMLElement>(".story-frame");
      gsap.set(frames, { autoAlpha: 0 });
      gsap.set(frames[0], { autoAlpha: 1 });
      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: shell.current,
          start: "top top",
          end: "bottom bottom",
          scrub: reduced ? true : 0.85,
          onUpdate(self) {
            progress.current = self.progress;
            if (chapter.current) chapter.current.textContent = `0${self.progress < 0.18 ? 1 : self.progress < 0.46 ? 2 : self.progress < 0.72 ? 3 : 4} — 04`;
          },
        },
      });
      timeline.to({}, { duration: 100 }, 0);
      timeline.fromTo(".hero-rail i b", { scaleX: 0 }, { scaleX: 1, duration: 100, ease: "none" }, 0);
      timeline.to(".globe-hint", { autoAlpha: 0, y: -16, duration: 7, ease: "power2.in" }, 21);
      const stages = [
        { show: 0, hide: 17 },
        { show: 18, hide: 37 },
        { show: 46, hide: 65 },
        { show: 72, hide: 94 },
      ];
      stages.forEach(({ show, hide }, i) => {
        if (i > 0) timeline.fromTo(frames[i], { autoAlpha: 0, y: reduced ? 0 : 50 }, { autoAlpha: 1, y: 0, duration: 4, ease: "power2.out" }, show);
        if (i > 0 && !reduced) timeline.fromTo(frames[i].querySelectorAll("h2 > span"),
          { clipPath: "inset(0 100% 0 0)", x: i % 2 ? 38 : -38 },
          { clipPath: "inset(0 0% 0 0)", x: 0, duration: 7, stagger: 0.8, ease: "power3.out" }, show + 0.5);
        timeline.to(frames[i], { autoAlpha: 0, y: reduced ? 0 : -65, duration: 4, ease: "power2.in" }, hide);
      });
    }, shell);
    return () => context.revert();
  }, [reduced]);

  return (
    <section className="cinematic" ref={shell} aria-label="Aurevia global strategy story">
      <div className="cinematic-sticky">
        {!ready && <div className="brand-loader" role="status" aria-label="Loading Aurevia experience">
          <span className="brand-loader-name">AUREVIA</span>
          <span className="loader-line" />
          <span>GLOBAL SIGNAL <strong>00%</strong></span>
        </div>}
        <div className="cinematic-vignette" />
        <div className="story-frame story-one">
          <div className="eyebrow">INDEPENDENT THINKING / GLOBAL PERSPECTIVE</div>
          <h1><span>COMPLEX</span><span>MARKETS<span className="period">.</span></span></h1>
          <p>Across borders, industries and moments of change.</p>
        </div>
        <div className="story-frame story-two">
          <div className="eyebrow">01 / THE POINT OF VIEW</div>
          <h2><span>CLEAR</span><span><em>DECISIONS.</em></span></h2>
          <p>See the whole picture. Move with purpose.</p>
        </div>
        <div className="story-frame story-three">
          <div className="eyebrow">02 / A CONNECTED WORLD</div>
          <h2><span>STRATEGY</span><span>WITHOUT</span><span><em>BORDERS.</em></span></h2>
          <p>Signals become connections. Connections become opportunity.</p>
        </div>
        <div className="story-frame story-four">
          <div className="eyebrow">03 / THE AUREVIA APPROACH</div>
          <h2><span>FROM COMPLEXITY</span><span>TO <em>CLARITY.</em></span></h2>
          <p>Many possible paths. One considered direction.</p>
        </div>
        <div className="hero-rail" aria-hidden="true"><span>SCROLL TO EXPLORE</span><i><b /></i><span ref={chapter}>01 — 04</span></div>
        <div className="globe-hint" aria-hidden="true"><span className="globe-hint-symbol">↔</span><span>DRAG TO TURN<br /><span className="zoom-hint-desktop">DOUBLE CLICK TO ZOOM IN</span><span className="zoom-hint-touch">DOUBLE TAP TO ZOOM IN</span></span></div>
        <div className="story-coordinate" aria-hidden="true">51°30&apos;N / 00°07&apos;W &nbsp;·&nbsp; GLOBAL SIGNAL</div>
        {visible && <HeroCanvas progress={progress} reduced={reduced} compact={compact} />}
      </div>
    </section>
  );
}
