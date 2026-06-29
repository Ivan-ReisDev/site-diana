"use client";

import { Navigation } from "lucide-react";

export type Venue = {
  name: string;
  address: string;
  coords?: string;
};

export interface LocationMapProps {
  venue: Venue;
}

export function LocationMap({ venue }: LocationMapProps) {
  const target = encodeURIComponent(venue.coords ?? venue.address);

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="w-full overflow-hidden rounded-[1.75rem] border border-[#f0c7d3]/60 bg-white/45 shadow-[0_10px_30px_rgba(201,111,135,.08)]">
        <iframe
          title={`Mapa: ${venue.name}`}
          src={`https://maps.google.com/maps?q=${target}&output=embed`}
          loading="lazy"
          allowFullScreen
          referrerPolicy="no-referrer-when-downgrade"
          className="block h-72 w-full sm:h-80 md:h-96"
        />
      </div>

      <a
        href={`https://www.google.com/maps/dir/?api=1&destination=${target}`}
        target="_blank"
        rel="noopener noreferrer"
        className="royal-button inline-flex min-h-[44px] items-center justify-center gap-2 rounded-full px-7 py-3 text-base font-black text-white shadow-[0_8px_24px_rgba(223,120,148,.24)] transition-all hover:scale-[1.02]"
      >
        <Navigation className="h-5 w-5" strokeWidth={2.25} aria-hidden="true" />
        Como chegar
      </a>
    </div>
  );
}