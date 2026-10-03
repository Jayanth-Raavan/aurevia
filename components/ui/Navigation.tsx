"use client";

import { useEffect, useState } from "react";
import { ArrowUpRight, Menu, X } from "lucide-react";

const links = [
  ["Capabilities", "#capabilities"],
  ["Industries", "#industries"],
  ["Work", "#work"],
  ["Insights", "#insights"],
  ["About", "#about"],
];

export default function Navigation() {
  const [open, setOpen] = useState(false);
  const [pastHero, setPastHero] = useState(false);
  useEffect(() => {
    const onScroll = () => setPastHero(window.scrollY > window.innerHeight * 0.6);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  useEffect(() => {
    document.body.classList.toggle("menu-open", open);
    const onKey = (event: KeyboardEvent) => { if (event.key === "Escape") setOpen(false); };
    window.addEventListener("keydown", onKey);
    return () => { document.body.classList.remove("menu-open"); window.removeEventListener("keydown", onKey); };
  }, [open]);
  const close = () => setOpen(false);
  return (
    <>
      <header className={`site-header ${pastHero ? "site-header-solid" : ""} ${open ? "site-header-open" : ""}`}>
        <a className="wordmark" href="#top" aria-label="Aurevia Global Advisory, back to top" onClick={close}>
          <span>AUREVIA<span className="wordmark-dot">.</span></span>
          <small>GLOBAL ADVISORY</small>
        </a>
        <nav className="desktop-nav" aria-label="Primary navigation">
          {links.map(([label, href]) => <a href={href} key={href} data-cursor="VIEW">{label}</a>)}
        </nav>
        <a href="#contact" className="nav-cta" data-cursor="TALK">LET&apos;S TALK <ArrowUpRight size={15} strokeWidth={1.5} /></a>
        <button className="menu-toggle" type="button" onClick={() => setOpen(!open)} aria-expanded={open} aria-controls="mobile-menu" aria-label={open ? "Close menu" : "Open menu"}>
          {open ? <X size={25} /> : <Menu size={25} />}
        </button>
      </header>
      <nav id="mobile-menu" className={`mobile-menu ${open ? "mobile-menu-open" : ""}`} aria-label="Mobile navigation" aria-hidden={!open}>
        <div className="mobile-menu-inner">
          <span className="eyebrow">EXPLORE AUREVIA</span>
          {links.map(([label, href], i) => <a tabIndex={open ? 0 : -1} href={href} onClick={close} key={href}><small>0{i + 1}</small>{label}<ArrowUpRight size={21} /></a>)}
          <a tabIndex={open ? 0 : -1} href="#contact" onClick={close} className="mobile-contact">START A CONVERSATION <ArrowUpRight size={20} /></a>
        </div>
      </nav>
    </>
  );
}
