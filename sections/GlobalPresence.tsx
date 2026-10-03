"use client";

import dynamic from "next/dynamic";
import { useRef, useState } from "react";
import { locations } from "@/data/locations";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useSectionVisible } from "@/hooks/useSectionVisible";
import { useCompact } from "@/hooks/useCompact";

const PresenceCanvas = dynamic(() => import("@/components/experience/GlobeScene").then((m) => m.PresenceCanvas), { ssr: false });

export default function GlobalPresence() {
  const [selected, setSelected] = useState(0);
  const reduced = useReducedMotion();
  const compact = useCompact();
  const section = useRef<HTMLElement>(null);
  const visible = useSectionVisible(section);
  return (
    <section className="presence-section" id="presence" ref={section}>
      <div className="section-topline"><span>ONE CONNECTED PERSPECTIVE</span><span>03 / GLOBAL PRESENCE</span></div>
      <div className="presence-title"><h2 className="line-reveal">GLOBAL<br />PERSPECTIVE.<br /><em>LOCAL UNDERSTANDING.</em></h2></div>
      <div className="presence-stage">
        {visible && <PresenceCanvas selected={selected} reduced={reduced} compact={compact} />}
        <div className="presence-drag-hint" aria-hidden="true"><span>↔</span> DRAG TO TURN · <span className="zoom-hint-desktop">DOUBLE CLICK TO ZOOM IN</span><span className="zoom-hint-touch">DOUBLE TAP TO ZOOM IN</span></div>
        <div className="presence-info">
          <div className="presence-info-top">SELECT A CITY <span>↘</span></div>
          <div className="location-list">
            {locations.slice(0, 5).map((location, i) => <button className={selected === i ? "selected" : ""} onMouseEnter={() => setSelected(i)} onFocus={() => setSelected(i)} onClick={() => setSelected(i)} type="button" key={location.name} aria-pressed={selected === i}><span>{location.name}</span><small>{location.region}</small></button>)}
          </div>
          <div className="location-detail"><span>0{selected + 1} / 05 &nbsp;·&nbsp; {locations[selected].region}</span><p>{locations[selected].note}</p></div>
        </div>
        <div className="presence-axis" aria-hidden="true">THE WORLD IS NOT ONE MARKET. IT IS ONE CONNECTED SYSTEM.</div>
      </div>
    </section>
  );
}
