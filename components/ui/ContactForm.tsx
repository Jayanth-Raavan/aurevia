"use client";

import { FormEvent, useState } from "react";
import { ArrowUpRight, Check } from "lucide-react";

export default function ContactForm() {
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.reportValidity()) return;
    setSending(true);
    window.setTimeout(() => { setSending(false); setSubmitted(true); form.reset(); }, 250);
  }
  if (submitted) return (
    <div className="contact-success" role="status">
      <Check size={32} strokeWidth={1} />
      <h3>Message validated.</h3>
      <p>This is a portfolio concept, so nothing was sent. The form is ready to connect to a real endpoint.</p>
      <button type="button" onClick={() => setSubmitted(false)}>WRITE ANOTHER MESSAGE <ArrowUpRight size={17} /></button>
    </div>
  );
  return (
    <form className="contact-form" onSubmit={submit}>
      <div className="form-row">
        <label>NAME <input name="name" type="text" placeholder="Your name" autoComplete="name" required minLength={2} /></label>
        <label>WORK EMAIL <input name="email" type="email" placeholder="name@company.com" autoComplete="email" required /></label>
      </div>
      <div className="form-row">
        <label>COMPANY <input name="company" type="text" placeholder="Organization" autoComplete="organization" required /></label>
        <label>ROLE <input name="role" type="text" placeholder="Your role" autoComplete="organization-title" required /></label>
      </div>
      <label>WHAT WOULD YOU LIKE TO DISCUSS? <textarea name="message" rows={3} placeholder="Tell us what is on your mind" required minLength={10} /></label>
      <button type="submit" className="form-submit" disabled={sending}><span>{sending ? "CHECKING..." : "SEND ENQUIRY"}</span><ArrowUpRight size={19} strokeWidth={1.5} /></button>
      <p className="form-note">Portfolio demonstration. No information is transmitted or stored.</p>
    </form>
  );
}
