import { SectionCard } from '@/components/ui/SectionCard';
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
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
      {cards.map((card) => (
        <SectionCard key={card.label} className="space-y-3">
          <p className="invite-label">{card.label}</p>
          <p className="text-3xl font-black text-[#b85f78]">{card.value}</p>
        </SectionCard>
      ))}
    </div>
  );
}