import { PresenceStats } from '@/components/dashboard/PresenceStats';
import { SectionCard } from '@/components/ui/SectionCard';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { getDashboardData } from '@/lib/rsvp/service';

export default async function DashboardOverviewPage() {
  const { stats } = await getDashboardData({ status: 'all', q: '' });

  return (
    <>
      <SectionCard className="space-y-2">
        <SectionHeader
          eyebrow="Dashboard privada"
          title="Lista de presença"
          description="Veja quem confirmou presença, quem não poderá comparecer e os totais atualizados da festa."
        />
      </SectionCard>

      <PresenceStats stats={stats} />
    </>
  );
}