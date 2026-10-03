import Image from "next/image";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import Navigation from "@/components/ui/Navigation";
import { Effects } from "@/components/ui/Effects";
import CinematicExperience from "@/components/experience/CinematicExperience";
import ManifestoSignal from "@/components/experience/ManifestoSignal";
import ClosingGlobe from "@/components/experience/ClosingGlobe";
import ContactForm from "@/components/ui/ContactForm";
import Capabilities from "@/sections/Capabilities";
import Industries from "@/sections/Industries";
import GlobalPresence from "@/sections/GlobalPresence";
import CaseStudies from "@/sections/CaseStudies";
import Perspectives from "@/sections/Perspectives";
import { leadership } from "@/data/leadership";

export default function Home() {
  return (
    <main id="top">
      <Navigation />
      <Effects />
      <CinematicExperience />

      <section className="manifesto-section" id="about">
        <div className="section-topline"><span>THE AUREVIA VIEW</span><span>AN INTRODUCTION / 00</span></div>
        <div className="manifesto-grid">
          <div className="manifesto-lead"><span className="small-glyph">✳</span><ManifestoSignal /><span>THE POWER OF<br />A CLEARER VIEW</span></div>
          <div>
            <h2 className="line-reveal">THE WORLD DOESN&apos;T<br />NEED MORE <em>NOISE.</em><br />IT NEEDS DIRECTION.</h2>
            <p>We help organizations see what matters, decide with confidence, and move with clarity. Our work connects business, technology, operations, risk and the people who make change possible.</p>
            <a className="text-link" href="#capabilities" data-cursor="VIEW">EXPLORE OUR THINKING <ArrowUpRight size={19} strokeWidth={1.4} /></a>
          </div>
        </div>
        <div className="manifesto-image">
          <Image src="/assets/structure.webp" alt="Monumental architecture viewed from below" fill sizes="100vw" />
          <div className="manifesto-image-caption"><span>FORM FOLLOWS A CLEAR IDEA.</span><span>AUREVIA / GLOBAL ADVISORY</span></div>
        </div>
      </section>

      <Capabilities />
      <Industries />
      <GlobalPresence />

      <CaseStudies />

      <section className="impact-section">
        <div className="section-topline"><span>WHAT TRANSFORMATION CAN UNLOCK</span><span>05 / POSSIBILITIES</span></div>
        <div className="impact-head"><h2 className="line-reveal">BETTER<br /><em>DECISIONS</em><br />MOVE EVERYTHING.</h2><p>Progress is more than a single number. It shows up in how quickly teams decide, how well systems connect and how confidently organizations adapt.</p></div>
        <div className="impact-visual" aria-label="Four illustrative transformation outcomes">
          <svg viewBox="0 0 1200 260" preserveAspectRatio="none" aria-hidden="true">
            <path className="impact-muted" d="M0 200 C180 230 200 70 370 110 S560 240 700 175 S940 30 1200 130" />
            <path className="impact-main" d="M0 190 C175 195 230 180 340 165 S540 130 650 118 S860 86 970 67 S1090 48 1200 32" />
          </svg>
          <div className="impact-label impact-label-a"><span>01</span>FASTER DECISIONS</div>
          <div className="impact-label impact-label-b"><span>02</span>CONNECTED OPERATIONS</div>
          <div className="impact-label impact-label-c"><span>03</span>CLEARER PERFORMANCE</div>
          <div className="impact-label impact-label-d"><span>04</span>RESILIENT GROWTH</div>
        </div>
        <p className="impact-caption">Illustrative outcomes, not historical performance claims.</p>
      </section>

      <Perspectives />

      <section className="leadership-section">
        <div className="section-topline"><span>THE PEOPLE BEHIND THE PERSPECTIVE</span><span>07 / LEADERSHIP</span></div>
        <div className="leadership-head"><h2 className="line-reveal">INTELLIGENCE IS<br /><em>HUMAN.</em></h2><p>Disciplines come together through people who see both the detail and the wider picture.</p></div>
        <div className="leader-grid">
          {leadership.map((person, i) => <article className="leader" key={person.name}>
            <div className="leader-image"><Image src={person.image} alt={`Illustrative portrait for ${person.name}`} fill sizes="(max-width: 800px) 100vw, 33vw" style={{ objectPosition: i === 0 ? "center 26%" : "center 18%" }} /></div>
            <div className="leader-top"><span>0{i + 1}</span><span>{person.role}</span></div>
            <h3>{person.name}</h3>
            <div className="leader-detail"><span>{person.focus}</span><span>{person.markets}</span></div>
          </article>)}
        </div>
        <p className="content-disclosure">Leadership identities and roles are fictional; portraits are illustrative stock imagery.</p>
      </section>

      <section className="contact-section" id="contact">
        <ClosingGlobe />
        <div className="section-topline"><span>THE NEXT CHAPTER</span><span>08 / LET&apos;S BEGIN</span></div>
        <div className="contact-intro">
          <span className="contact-intro-kicker">ONE CONVERSATION CAN CHANGE THE FRAME.</span>
          <h2 className="line-reveal">THE NEXT MOVE<br />STARTS WITH <em>A<br />CONVERSATION.</em></h2>
          <div className="contact-actions"><a href="#contact-form" className="contact-primary" data-cursor="TALK">START A CONVERSATION <ArrowDownRight size={21} strokeWidth={1.3} /></a><a href="#capabilities" className="contact-secondary" data-cursor="VIEW">EXPLORE CAPABILITIES <ArrowUpRight size={18} /></a></div>
        </div>
        <div id="contact-form" className="contact-form-layout">
          <div className="contact-form-aside"><span>ENQUIRIES / GLOBAL</span><h3>LET&apos;S MAKE<br /><em>IT CLEAR.</em></h3><p>Tell us the challenge you are working through. This demonstration form shows the intended experience.</p></div>
          <ContactForm />
        </div>
      </section>

      <footer className="site-footer">
        <div className="footer-top"><a href="#top" className="footer-brand">AUREVIA<span>.</span></a><span>COMPLEX MARKETS. CLEAR DECISIONS.</span><a href="#top" aria-label="Back to top">BACK TO TOP ↑</a></div>
        <div className="footer-bottom"><span>© {new Date().getFullYear()} AUREVIA GLOBAL ADVISORY</span><span>FICTIONAL PORTFOLIO CONCEPT / ALL CONTENT ILLUSTRATIVE</span><span>DESIGNED FOR A CLEARER VIEW</span></div>
      </footer>
    </main>
  );
}
