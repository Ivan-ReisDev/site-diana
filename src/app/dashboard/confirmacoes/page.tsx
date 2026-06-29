import { DashboardFilters } from '@/components/dashboard/DashboardFilters';
import { RsvpTable } from '@/components/dashboard/RsvpTable';
import { getDashboardData, type DashboardStatusFilter } from '@/lib/rsvp/service';

const ALLOWED_STATUS: DashboardStatusFilter[] = ['all', 'yes', 'no'];

export default async function DashboardConfirmacoesPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; q?: string }>;
}) {
  const resolvedSearchParams = await searchParams;
  const rawStatus = resolvedSearchParams.status;
  const status: DashboardStatusFilter = (
    ALLOWED_STATUS as readonly string[]
  ).includes(rawStatus ?? '')
    ? (rawStatus as DashboardStatusFilter)
    : 'all';
  const q = resolvedSearchParams.q ?? '';

  const { rows } = await getDashboardData({ status, q });

  return (
    <section id="confirmacoes" className="space-y-8">
      <DashboardFilters q={q} status={status} />
      <RsvpTable rows={rows} />
    </section>
  );
}