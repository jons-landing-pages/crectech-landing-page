"use client";
import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { journeyCopy } from "@/lib/journey/copy";
import { sceneLabels, type LabelElements } from "@/lib/journey/labels";
import { journeyStates, type Theme } from "@/lib/journey/states";
import { atomStyle } from "@/lib/three/palette";

// three.js loads after the text; the hero headline paints first.
const JourneyScene = dynamic(() => import("@/components/journey/JourneyScene"), { ssr: false });

/** Viewport heights of scroll per state. */
const SCROLL_PER_STATE = 1.1;

const themeClasses: Record<Theme, { text: string; muted: string; veil: string }> = {
  light: {
    text: "text-ink",
    muted: "text-ink/65",
    veil: "from-paper/95 via-paper/70 to-transparent",
  },
  dark: {
    text: "text-paper",
    muted: "text-paper/65",
    veil: "from-carbon/90 via-carbon/55 to-transparent",
  },
};

function AtomLegend() {
  return (
    <ul className="mt-6 flex flex-wrap gap-4">
      {(
        [
          ["H", "Hydrogen"],
          ["C", "Carbon"],
          ["O", "Oxygen"],
        ] as const
      ).map(([element, name]) => (
        <li key={element} className="label flex items-center gap-2 text-paper/70">
          <span className="h-3 w-3 rounded-full" style={{ background: atomStyle[element].color }} />
          {name}
        </li>
      ))}
    </ul>
  );
}


function StatePanel({ id, theme, active }: { id: string; theme: Theme; active: boolean }) {
  const copy = journeyCopy[id];
  const classes = themeClasses[theme];
  return (
    <article
      className={`absolute inset-x-0 bottom-0 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] md:inset-y-0 md:flex md:items-center ${
        active ? "opacity-100" : "pointer-events-none translate-y-6 opacity-0"
      }`}
    >
      <div className="mx-auto w-full max-w-7xl px-6 pb-10 md:pb-0">
        <div className="max-w-md">
          <p className={`label ${theme === "light" ? "text-primary" : "text-primary-light"}`}>{copy.kicker}</p>
          <h2 className={`font-display mt-4 text-[clamp(1.5rem,2.6vw,2.4rem)] font-extrabold leading-[1.08] ${classes.text}`}>
            {copy.title}
          </h2>
          {copy.equation && (
            <p className={`mt-5 font-mono text-base md:text-lg ${theme === "light" ? "text-ink" : "text-accent-light"}`}>
              {copy.equation}
            </p>
          )}
          <p className={`mt-4 leading-relaxed ${classes.muted}`}>{copy.body}</p>
          {(id === "reforming" || id === "synthesis") && <AtomLegend />}
          {copy.source && <p className={`mt-4 text-xs ${classes.muted} opacity-80`}>{copy.source}</p>}
        </div>
      </div>
    </article>
  );
}

/**
 * The home page opener: a pinned 3D scene of the Sei Mangkei pilot plant. Scrolling moves the camera
 * from the plant to the lagoon, into the reactor container, into one catalyst pellet, through the
 * reforming and synthesis reactions, and back out to the storage tanks.
 */
export default function JourneySection() {
  const sectionRef = useRef<HTMLElement>(null);
  const progress = useRef(0);
  const labels = useRef<LabelElements>(new Map());
  const [active, setActive] = useState(0);

  useEffect(() => {
    const update = () => {
      const section = sectionRef.current;
      if (!section) return;
      const rect = section.getBoundingClientRect();
      const scrollable = rect.height - window.innerHeight;
      const value = Math.min(1, Math.max(0, -rect.top / scrollable));
      progress.current = value;
      setActive(Math.min(journeyStates.length - 1, Math.floor(value * journeyStates.length)));
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  const theme = journeyStates[active].theme;

  const jumpTo = (index: number) => {
    const section = sectionRef.current;
    if (!section) return;
    const scrollable = section.offsetHeight - window.innerHeight;
    const state = journeyStates[index];
    const centre = (state.hold[0] + state.hold[1]) / 2 / 1000;
    window.scrollTo({ top: section.offsetTop + centre * scrollable, behavior: "smooth" });
  };

  return (
    <section
      id="journey"
      ref={sectionRef}
      aria-label="From palm oil mill biogas to bio-methanol"
      className="relative"
      style={{ height: `${journeyStates.length * SCROLL_PER_STATE * 100}svh` }}
    >
      <div className={`sticky top-0 h-svh overflow-hidden ${theme === "light" ? "bg-paper" : "bg-carbon"} transition-colors duration-700`}>
        <div className="absolute inset-0">
          <JourneyScene progress={progress} labels={labels.current} />
        </div>

        {/* Callouts positioned by the scene every frame. */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
          {sceneLabels.map((label) => (
            <div
              key={label.id}
              ref={(element) => {
                if (element) labels.current.set(label.id, element);
                else labels.current.delete(label.id);
              }}
              className="absolute left-0 top-0 flex flex-col items-center opacity-0"
              style={{ visibility: "hidden" }}
            >
              <span
                className={`label whitespace-nowrap rounded-full border px-3 py-1.5 backdrop-blur ${
                  label.tone === "light" ? "border-ink/15 bg-paper/90 text-ink" : "border-paper/20 bg-carbon/80 text-paper"
                }`}
              >
                {label.text}
              </span>
              <span className={`h-6 w-px ${label.tone === "light" ? "bg-ink/40" : "bg-paper/40"}`} />
              <span className={`h-1.5 w-1.5 rounded-full ${label.tone === "light" ? "bg-ink" : "bg-paper"}`} />
            </div>
          ))}
        </div>

        {/* A soft veil behind the text keeps it readable over the scene. */}
        <div
          aria-hidden="true"
          className={`pointer-events-none absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r ${themeClasses[theme].veil}`}
        />

        {journeyStates.map((state, i) => (
          <StatePanel key={state.id} id={state.id} theme={state.theme} active={active === i} />
        ))}

        {/* Chapter rail. */}
        <nav aria-label="Journey chapters" className="absolute right-6 top-1/2 hidden -translate-y-1/2 lg:block">
          <ol className="space-y-3">
            {journeyStates.map((state, i) => (
              <li key={state.id}>
                <button
                  type="button"
                  onClick={() => jumpTo(i)}
                  className={`label group flex w-full items-center justify-end gap-3 transition-colors ${
                    theme === "light" ? "text-ink/45 hover:text-ink" : "text-paper/45 hover:text-paper"
                  } ${active === i ? (theme === "light" ? "text-ink" : "text-paper") : ""}`}
                  aria-current={active === i ? "step" : undefined}
                >
                  {state.label}
                  <span
                    className={`h-px transition-all duration-500 ${
                      active === i ? "w-8 bg-primary-light" : "w-4 bg-current opacity-50"
                    }`}
                  />
                </button>
              </li>
            ))}
          </ol>
        </nav>
      </div>
    </section>
  );
}
