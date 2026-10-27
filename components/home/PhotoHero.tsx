import Image from "next/image";
import ArrowLink from "@/components/ui/ArrowLink";
import { keyFigures } from "@/lib/site";

/**
 * Cover: a drone photo of Pertamina NRE's biogas power plant at Sei Mangkei, North Sumatra, with
 * the planned pilot units shown beside the covered lagoon (deck p10). A thin line overlay, in the
 * site's engineering-drawing style, marks the lagoon, the pilot and the mill.
 *
 * The overlay uses the photo's own pixel coordinates (1536 × 864) and the same "cover" crop as the
 * image, so its marks stay on their subjects at every screen size.
 */

const PHOTO = { width: 1536, height: 864 };

const marks = {
  pilot: "M330 588 L346 470 L468 393 L520 398 L524 432 L404 590 Z",
  lagoon: "M548 392 L1098 392 L1276 576 L462 584 Z",
  // Biogas route from under the membrane to the pilot's reactor container.
  gas: "M760 486 C 640 486, 560 480, 452 470",
};

const callouts = [
  { x: 432, y: 418, lift: 120, text: "CRecTech pilot · about 50 t/yr", accent: true },
  { x: 900, y: 470, lift: 150, text: "Covered POME lagoon", accent: false },
  { x: 1110, y: 232, lift: 56, text: "Palm oil mill", accent: false },
];

function Overlay() {
  return (
    <svg
      viewBox={`0 0 ${PHOTO.width} ${PHOTO.height}`}
      preserveAspectRatio="xMidYMid slice"
      className="absolute inset-0 h-full w-full"
      aria-hidden="true"
    >
      <path d={marks.lagoon} className="fade-in" style={{ "--delay": "0.9s" } as React.CSSProperties} fill="none" stroke="#f3f1ea" strokeWidth="1.5" strokeDasharray="6 6" opacity="0.8" />
      <path d={marks.pilot} pathLength={1} className="draw-in" style={{ "--delay": "1.3s" } as React.CSSProperties} fill="rgba(63,212,122,0.12)" stroke="#3fd47a" strokeWidth="2" />
      <path d={marks.gas} fill="none" stroke="#f2cf6b" strokeWidth="2.5" strokeDasharray="4 10" className="animate-dashflow" opacity="0.9" />
      {callouts.map((c) => (
        <g key={c.text} className="fade-in" style={{ "--delay": c.accent ? "1.6s" : "1.2s" } as React.CSSProperties}>
          <line x1={c.x} y1={c.y} x2={c.x} y2={c.y - c.lift} stroke={c.accent ? "#3fd47a" : "#f3f1ea"} strokeWidth="1.25" />
          <circle cx={c.x} cy={c.y} r="4.5" fill={c.accent ? "#3fd47a" : "#f3f1ea"} />
          <foreignObject x={c.x - 160} y={c.y - c.lift - 34} width="320" height="34">
            <div className="flex justify-center">
              <span
                className={`label whitespace-nowrap rounded-full px-3 py-1.5 ${
                  c.accent ? "bg-primary-light text-carbon" : "bg-carbon/75 text-paper backdrop-blur"
                }`}
              >
                {c.text}
              </span>
            </div>
          </foreignObject>
        </g>
      ))}
    </svg>
  );
}

export default function PhotoHero() {
  return (
    <section className="grain relative isolate flex min-h-[100svh] flex-col overflow-hidden bg-carbon text-paper">
      <div className="absolute inset-0 -z-10">
        {/* Slow push-in on the photo and its overlay together, so the marks stay aligned. */}
        <div className="animate-push-in absolute inset-0">
          <Image
            src="/images/site/sei-mangkei-aerial.jpg"
            alt="Drone view of the biogas power plant at Sei Mangkei, North Sumatra: a covered POME lagoon with the planned CRecTech pilot units beside it and the palm oil mill behind"
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="hidden md:block">
            <Overlay />
          </div>
        </div>
        <div className="absolute inset-x-0 bottom-0 h-full bg-gradient-to-t from-carbon via-carbon/80 to-carbon/20 md:h-[62%] md:via-carbon/75 md:to-transparent" />
        <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-carbon/50 to-transparent" />
      </div>

      <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col justify-end px-6 pb-10 pt-32 md:pb-12">
        <div className="grid gap-6 md:grid-cols-12 md:items-end md:gap-x-10">
          <div className="md:col-span-12">
            <p className="animate-fade-up label mb-5 flex items-center gap-3 text-paper/75">
              <span className="h-1.5 w-1.5 rounded-full bg-primary-light shadow-[0_0_12px_var(--color-primary-light)]" />
              Sei Mangkei, North Sumatra · pilot with Pertamina NRE
            </p>
            <h1
              style={{ "--delay": "0.1s" } as React.CSSProperties}
              className="animate-fade-up font-display max-w-5xl text-[clamp(2rem,4.3vw,3.9rem)] font-extrabold leading-[1.02]"
            >
              We make <span className="text-primary-light">bio-methanol</span> from the biogas that palm oil mills waste.
            </h1>
          </div>
          <div
            style={{ "--delay": "0.3s" } as React.CSSProperties}
            className="animate-fade-up flex flex-col gap-5 md:col-span-12 md:flex-row md:items-end md:justify-between"
          >
            <p className="max-w-2xl leading-relaxed text-paper/75 md:text-lg">
              Our CRecREF™ catalyst converts raw biogas into marine-grade methanol in two steps instead of four. The
              first on-site pilot will sit beside this lagoon, in a unit no bigger than a shipping container.
            </p>
            <div className="flex shrink-0 flex-wrap items-center gap-3">
              <ArrowLink href="/contact">Book a meeting</ArrowLink>
              <ArrowLink href="#journey" variant="outline-light">
                Follow the gas
              </ArrowLink>
            </div>
          </div>
        </div>

        <dl
          style={{ "--delay": "0.5s" } as React.CSSProperties}
          className="animate-fade-up mt-10 grid grid-cols-2 border-t border-line-dark md:grid-cols-4"
        >
          {keyFigures.map((figure, i) => (
            <div
              key={figure.label}
              className={`py-3.5 pr-4 ${i > 0 ? "md:border-l md:border-line-dark md:pl-6" : ""} ${
                i % 2 === 1 ? "border-l border-line-dark pl-4 md:pl-6" : ""
              }`}
            >
              <dt className="label text-paper/55">{figure.label}</dt>
              <dd className="font-display mt-1 text-xl font-bold md:text-2xl">{figure.value}</dd>
            </div>
          ))}
        </dl>
        <p className="mt-4 text-xs text-paper/45">
          Visualisation: the planned pilot units shown on a drone photo of Pertamina NRE&apos;s biogas power plant.
        </p>
      </div>
    </section>
  );
}
