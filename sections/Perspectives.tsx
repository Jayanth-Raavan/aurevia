"use client";

import { useCallback, useState } from "react";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { insights } from "@/data/insights";
import EditorialOverlay from "@/components/ui/EditorialOverlay";

export default function Perspectives() {
  const [open, setOpen] = useState<number | null>(null);
  const close = useCallback(() => setOpen(null), []);
  const article = open === null ? null : insights[open];
  return (
    <section id="insights" className="insights-section">
      <div className="section-topline"><span>IDEAS FOR WHAT COMES NEXT</span><span>06 / PERSPECTIVES</span></div>
      <div className="insights-head"><h2 className="line-reveal">PERSPECTIVES<span className="period">.</span></h2><p>Questions shaping the next era of enterprise.</p></div>
      <div className="insights-grid">
        {insights.map((item, i) => <button type="button" className={`insight insight-${i + 1}`} key={item.issue} onClick={() => setOpen(i)} data-cursor="OPEN" aria-label={`Open perspective: ${item.title}`}>
          <div className="insight-image"><Image src={item.image} alt={`Editorial visual for ${item.title}`} fill sizes={i === 0 ? "(max-width: 800px) 100vw, 55vw" : "(max-width: 800px) 100vw, 30vw"} /></div>
          <div className="insight-meta"><span>ISSUE {item.issue} / {item.category}</span><ArrowUpRight size={20} strokeWidth={1.2} /></div>
          <h3>{item.title}</h3>
        </button>)}
      </div>
      <p className="content-disclosure">Perspectives are illustrative editorial excerpts for this portfolio concept.</p>
      {article && <EditorialOverlay onClose={close} eyebrow={`PERSPECTIVE / ISSUE ${article.issue} / ${article.category}`} title={article.title} image={article.image} imageAlt={`Editorial visual for ${article.title}`}>
        <p className="editorial-dek">{article.dek}</p>
        <p className="editorial-body">{article.body}</p>
        <p className="editorial-disclaimer">An illustrative excerpt, not published research.</p>
      </EditorialOverlay>}
    </section>
  );
}
