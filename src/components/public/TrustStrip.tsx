import Image from "next/image";
import { TRUST_BADGES } from "@/lib/publicVisualAssets";

export function TrustStrip() {
  return (
    <section className="mt-6 rounded-[1.15rem] border border-casero-dark/10 bg-white p-3 shadow-sm sm:mt-8 sm:p-4">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {TRUST_BADGES.map((badge) => (
          <div key={badge.label} className="flex min-h-[76px] items-center gap-3 rounded-[0.95rem] bg-casero-background px-3 py-3">
            <span className="relative h-12 w-12 flex-none overflow-hidden rounded-full bg-white shadow-sm ring-1 ring-casero-dark/10">
              <Image src={badge.image} alt={badge.alt} fill sizes="48px" className="object-contain p-1" />
            </span>
            <span className="font-heading text-sm font-extrabold leading-tight text-casero-dark sm:text-base">{badge.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}