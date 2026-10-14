import Image from "next/image";
import { partners } from "@/lib/site";

export default function PartnersBar() {
  return (
    <section aria-labelledby="partners-heading" className="border-b border-line bg-paper py-12">
      <div className="mx-auto mb-8 max-w-7xl px-6">
        <h2 id="partners-heading" className="label text-ink/50">
          Backed &amp; recognised by
        </h2>
      </div>

      <div className="marquee-mask overflow-hidden">
        <div className="animate-marquee flex w-max hover:[animation-play-state:paused]" aria-hidden="true">
          {[...partners, ...partners].map((partner, i) => (
            <div key={i} className="mx-3 shrink-0">
              <Image
                src={partner.src}
                alt=""
                width={1273}
                height={548}
                className="h-16 w-auto object-contain md:h-20"
              />
            </div>
          ))}
        </div>
      </div>

      <ul className="sr-only">
        {partners.map((partner) => (
          <li key={partner.name}>{partner.name}</li>
        ))}
      </ul>
    </section>
  );
}
