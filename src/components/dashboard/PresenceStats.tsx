import type { PresenceStats as PresenceStatsType } from '@/lib/rsvp/service';

export function PresenceStats({ stats }: { stats: PresenceStatsType }) {
  const cards = [
    { label: 'Grupos confirmados', value: stats.confirmedGroups },
    { label: 'Grupos que não irão', value: stats.declinedGroups },
    { label: 'Adultos confirmados', value: stats.confirmedAdults },
    { label: 'Crianças confirmadas', value: stats.confirmedChildren },
    { label: 'Total confirmado', value: stats.confirmedTotal },
  ];

  return (
    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
      {cards.map((card) => (
        <article key={card.label} className="rounded-[1.5rem] bg-white p-5 shadow-[0_12px_32px_rgba(185,75,105,.08)]">
          <p className="text-xs font-semibold uppercase tracking-[.22em] text-[#d36f8a]">{card.label}</p>
          <p className="mt-3 text-3xl font-black text-[#b85f78]">{card.value}</p>
        </article>
      ))}
    </section>
  );
}
