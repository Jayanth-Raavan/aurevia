"use client";

import { useEffect, useRef, useState } from "react";
import { capabilities } from "@/data/capabilities";

function SignalDiagram({ active }: { active: number }) {
  const paths = Array.from({ length: 10 }, (_, i) => {
    const start = 20 + i * 24;
    const end = active === 3 ? 26 + ((i * 3) % 9) * 24 : active === 4 ? 150 - i * 7 : 134;
    const bend = active === 1 ? 92 + Math.sin(i * 1.8) * 42 : active === 2 ? 90 + (i % 3) * 12 : 105;
    return `M 0 ${start} C 75 ${start}, ${bend} ${end}, 280 ${end}`;
  });
  return (
    <div className="signal-diagram" aria-hidden="true">
      <div className="diagram-coordinate">AUREVIA / SYSTEM 0{active + 1}</div>
      <svg viewBox="0 0 280 260" preserveAspectRatio="none">
        {paths.map((d, i) => <path key={i} d={d} className={i === active + 2 ? "diagram-emphasis" : ""} />)}
        <circle cx="280" cy={active === 4 ? 150 : active === 3 ? 155 : 134} r="4" />
      </svg>
      <div className="diagram-meta"><span>INPUT / MULTIPLE SIGNALS</span><span>OUTPUT / DIRECTION</span></div>
    </div>
  );
}

export default function Capabilities() {
  const [active, setActive] = useState(0);
  const refs = useRef<(HTMLElement | null)[]>([]);
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) setActive(Number((entry.target as HTMLElement).dataset.index));
      });
    }, { rootMargin: "-38% 0px -38% 0px" });
    refs.current.forEach((el) => { if (el) observer.observe(el); });
    return () => observer.disconnect();
  }, []);
  return (
    <section id="capabilities" className="capabilities-section">
      <div className="section-topline"><span>WHAT WE DO</span><span>01 / CAPABILITIES</span></div>
      <div className="capabilities-layout">
        <div className="capability-visual">
          <div className="capability-side-title">THE WORK THAT<br />MOVES YOU FORWARD.</div>
          <SignalDiagram active={active} />
          <div className="capability-progress"><span>0{active + 1}</span><span className="capability-progress-track"><i style={{ transform: `scaleX(${(active + 1) / 5})` }} /></span><span>05</span></div>
        </div>
        <div className="capability-chapters">
          {capabilities.map((item, i) => <article className={`capability-chapter ${active === i ? "is-active" : ""}`} data-index={i} key={item.id} ref={(el) => { refs.current[i] = el; }}>
            <span className="chapter-index">/ {item.id} &nbsp;&nbsp; AUREVIA PRACTICE</span>
            <h3>{item.title}</h3>
            <p className="chapter-statement">{item.statement}</p>
            <p className="chapter-copy">{item.description}</p>
            <div className="chapter-services">{item.services.map((service) => <span key={service}>{service}</span>)}</div>
          </article>)}
        </div>
      </div>
    </section>
  );
}
