"use client";
import { useState } from "react";
import Reveal from "@/components/ui/Reveal";
import ArrowLink from "@/components/ui/ArrowLink";
import { calendlyUrl, contactEmail } from "@/lib/site";

const fields = [
  { name: "name", label: "Name", type: "text", autoComplete: "name", required: true },
  { name: "email", label: "Email", type: "email", autoComplete: "email", required: true },
  { name: "company", label: "Company", type: "text", autoComplete: "organization", required: false },
] as const;

type FormState = Record<(typeof fields)[number]["name"] | "message", string>;

const inputClass =
  "w-full border-0 border-b border-line bg-transparent px-0 py-3 text-base text-ink placeholder:text-ink/30 focus:border-primary focus:outline-none focus:ring-0 transition-colors";

/**
 * The site has no backend, so the form composes an email in the visitor's own
 * mail app. Swap handleSubmit for an API call once a form endpoint exists.
 */
export default function ContactSection() {
  const [form, setForm] = useState<FormState>({ name: "", email: "", company: "", message: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const subject = `Enquiry from ${form.name}${form.company ? ` (${form.company})` : ""}`;
    const body = `${form.message}\n\n— ${form.name}\n${form.email}${form.company ? `\n${form.company}` : ""}`;
    window.location.href = `mailto:${contactEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  return (
    <section className="bg-paper pb-20 pt-2 md:pb-28">
      <div className="mx-auto grid max-w-7xl gap-16 px-6 md:grid-cols-12">
        <Reveal className="md:col-span-5">
          <div className="grain relative overflow-hidden rounded-3xl bg-carbon p-8 text-paper md:p-10">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-primary/35 blur-[90px]"
            />
            <div className="relative">
              <p className="label text-primary-light">Fastest route</p>
              <h2 className="font-display mt-5 text-3xl font-extrabold leading-[1.05] md:text-4xl">
                Book a meeting with the team.
              </h2>
              <p className="mt-4 leading-relaxed text-paper/65">
                Pick a time to talk about deployment at your site, a partnership or
                an investment.
              </p>
              <div className="mt-8">
                <ArrowLink href={calendlyUrl} external>
                  Schedule on Calendly
                </ArrowLink>
              </div>
            </div>
          </div>

          <div className="mt-10 border-t border-line pt-8">
            <p className="label text-ink/50">Email</p>
            <a
              href={`mailto:${contactEmail}`}
              className="font-display mt-2 inline-block text-2xl font-bold transition-colors hover:text-primary"
            >
              {contactEmail}
            </a>
          </div>
        </Reveal>

        <Reveal className="md:col-span-6 md:col-start-7" delay={0.1}>
          <h2 className="font-display text-3xl font-extrabold md:text-4xl">Or send us a note.</h2>
          <p className="mt-3 text-ink/60">
            We welcome enquiries and collaborations on waste-to-worth solutions.
          </p>
          <form onSubmit={handleSubmit} className="mt-10 space-y-8">
            {fields.map((field) => (
              <div key={field.name}>
                <label htmlFor={field.name} className="label text-ink/55">
                  {field.label}
                  {!field.required && <span className="text-ink/35"> · optional</span>}
                </label>
                <input
                  id={field.name}
                  name={field.name}
                  type={field.type}
                  autoComplete={field.autoComplete}
                  required={field.required}
                  value={form[field.name]}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>
            ))}
            <div>
              <label htmlFor="message" className="label text-ink/55">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                rows={4}
                required
                value={form.message}
                onChange={handleChange}
                placeholder="Tell us about your site, feedstock or interest…"
                className={`${inputClass} resize-none`}
              />
            </div>
            <div className="flex flex-wrap items-center gap-4">
              <button
                type="submit"
                className="group inline-flex items-center gap-3 rounded-full bg-ink py-3 pl-6 pr-3 text-sm font-semibold text-paper transition-colors hover:bg-primary focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
              >
                Write email
                <span aria-hidden="true" className="grid h-7 w-7 place-items-center rounded-full bg-paper/15 transition-transform duration-300 group-hover:-rotate-45">
                  →
                </span>
              </button>
              <p className="text-xs text-ink/45">Opens your mail app with the message filled in.</p>
            </div>
          </form>
        </Reveal>
      </div>
    </section>
  );
}
