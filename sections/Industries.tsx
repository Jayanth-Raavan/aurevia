"use client";

import { useState } from "react";
import Image from "next/image";
import { industries } from "@/data/industries";
import { ArrowUpRight } from "lucide-react";

export default function Industries() {
  const [active, setActive] = useState(0);
  return (
    <section id="industries" className="industries-section">
      <div className="section-topline"><span>WHERE WE WORK</span><span>02 / INDUSTRIES</span></div>
      <div className="industry-heading"><h2 className="line-reveal">DEEP CONTEXT.<br /><em>WIDER PERSPECTIVE.</em></h2><p>Different sectors. Shared pressure to see further and act sooner.</p></div>
      <div className="industries-layout">
        <div className="industry-list">
          {industries.map((industry, i) => (
            <button type="button" key={industry.name} onMouseEnter={() => setActive(i)} onFocus={() => setActive(i)} onClick={() => setActive(i)}
              className={`industry-item ${i === active ? "active" : ""}`} aria-pressed={i === active}>
              <span className="industry-num">0{i + 1}</span><span>{industry.name}</span><ArrowUpRight size={22} strokeWidth={1.2} />
            </button>
          ))}
        </div>
        <div className="industry-photo">
          {industries.map((industry, i) => <Image key={industry.name} src={industry.image} alt={`${industry.name} sector visual`} fill sizes="(max-width: 800px) 100vw, 42vw" className={i === active ? "shown" : ""} />)}
          <div className="industry-caption"><span>0{active + 1} / 07</span><span>{industries[active].note}</span></div>
        </div>
      </div>
    </section>
  );
}
