import Image from "next/image";
import type { Person } from "@/lib/team";

interface PersonCardProps {
  person: Person;
  size?: "large" | "small";
}

/** Portrait card. Photos sit in greyscale and warm to colour on hover. */
export default function PersonCard({ person, size = "small" }: PersonCardProps) {
  const large = size === "large";
  return (
    <article className="group">
      <div
        className={`relative overflow-hidden rounded-3xl bg-paper-2 ${large ? "aspect-[4/5]" : "aspect-square"}`}
      >
        <Image
          src={person.img}
          alt={person.name}
          fill
          sizes={large ? "(min-width: 768px) 33vw, 100vw" : "(min-width: 768px) 25vw, 50vw"}
          className="object-cover object-top grayscale transition duration-700 group-hover:scale-[1.03] group-hover:grayscale-0"
        />
      </div>
      <h3 className={`mt-5 font-semibold leading-snug ${large ? "text-xl" : "text-base"}`}>{person.name}</h3>
      {person.title && <p className="label mt-1.5 text-primary">{person.title}</p>}
      {person.bio && <p className="mt-3 text-sm leading-relaxed text-ink/60">{person.bio}</p>}
      {person.linkedin && (
        <a
          href={person.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className="label mt-3 inline-block text-ink/50 underline-offset-4 hover:text-primary hover:underline"
        >
          LinkedIn ↗
        </a>
      )}
    </article>
  );
}
