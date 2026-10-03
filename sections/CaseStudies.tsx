"use client";

import { useCallback, useState } from "react";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { caseStudies } from "@/data/caseStudies";
import EditorialOverlay from "@/components/ui/EditorialOverlay";

export default function CaseStudies() {
  const [open, setOpen] = useState<number | null>(null);
  const close = useCallback(() => setOpen(null), []);
  const study = open === null ? null : caseStudies[open];
  return (
    <section className="work-section" id="work">
      <div className="section-topline"><span>SELECTED THINKING</span><span>04 / ILLUSTRATIVE WORK</span></div>
      <div className="work-heading"><h2 className="line-reveal">WORK THAT<br /><em>CHANGES THE FRAME.</em></h2><p>Three illustrative engagements show how our disciplines come together around a clear decision.</p></div>
      <div className="case-list">
        {caseStudies.map((item, i) => <article className="case-study" key={item.number}>
          <button className="case-image" type="button" onClick={() => setOpen(i)} data-cursor="OPEN" aria-label={`Open illustrative case study: ${item.title}`}>
            <Image src={item.image} alt={item.imageAlt} fill sizes="(max-width: 800px) 100vw, 65vw" /><span>CASE STUDY / {item.number}</span>
          </button>
          <div className="case-copy">
            <div className="case-meta"><span>{item.number} / 03</span><span>{item.sector.toUpperCase()}</span></div>
            <h3>{item.title}</h3><p>{item.summary}</p>
            <div className="case-outcome"><span>ILLUSTRATIVE OUTCOME</span><strong>{item.outcome}</strong></div>
            <button type="button" className="case-open" onClick={() => setOpen(i)} data-cursor="OPEN" aria-label={`Open ${item.title}`}><ArrowUpRight size={24} strokeWidth={1.2} /></button>
          </div>
        </article>)}
      </div>
      <p className="content-disclosure">The engagements above are fictional examples created for this portfolio concept.</p>
      {study && <EditorialOverlay onClose={close} eyebrow={`ILLUSTRATIVE CASE / ${study.number} / ${study.sector.toUpperCase()}`} title={study.title} image={study.image} imageAlt={study.imageAlt}>
        <p className="editorial-dek">{study.summary}</p>
        <dl><dt>THE QUESTION</dt><dd>{study.challenge}</dd><dt>THE APPROACH</dt><dd>{study.approach}</dd><dt>THE DIRECTION</dt><dd>{study.direction}</dd></dl>
        <p className="editorial-disclaimer">A fictional case study for this portfolio demonstration.</p>
      </EditorialOverlay>}
    </section>
  );
}
