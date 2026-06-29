import { DashboardRsvpManager } from '@/components/dashboard/DashboardRsvpManager';
import { getDashboardData } from '@/lib/rsvp/service';

export default async function DashboardCadastroManualPage() {
  const { rows } = await getDashboardData({ status: 'all', q: '' });

  return (
    <section id="cadastro-manual">
      <DashboardRsvpManager initialRows={rows} />
    </section>
  );
}