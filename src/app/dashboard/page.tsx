import { redirect } from 'next/navigation';

import { LogoutButton } from '@/components/auth/LogoutButton';
import { DashboardFilters } from '@/components/dashboard/DashboardFilters';
import { DashboardRsvpManager } from '@/components/dashboard/DashboardRsvpManager';
import { PresenceStats } from '@/components/dashboard/PresenceStats';
import { RsvpTable } from '@/components/dashboard/RsvpTable';
import { getCurrentAdminSession } from '@/lib/auth/session';
import { getDashboardData, type DashboardStatusFilter } from '@/lib/rsvp/service';

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; q?: string }>;
}) {
  const session = await getCurrentAdminSession();

  if (!session) {
    redirect('/login');
  }

  const resolvedSearchParams = await searchParams;
  const status = (resolvedSearchParams.status as DashboardStatusFilter | undefined) ?? 'all';
  const q = resolvedSearchParams.q ?? '';
  const { rows, stats } = await getDashboardData({ status, q });

  return (
    <main className="min-h-screen bg-[#fff8f6] px-5 py-10 text-[#745b58] sm:px-8 lg:px-12">
      <div className="mx-auto max-w-7xl space-y-8">
        <section className="flex flex-col gap-4 rounded-[2rem] bg-white/80 p-6 shadow-[0_18px_60px_rgba(185,75,105,.12)] sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[.3em] text-[#d36f8a]">Dashboard privada</p>
            <h1 className="mt-3 font-serif text-4xl font-black text-[#b85f78]">Lista de presença</h1>
            <p className="mt-3 text-base leading-7 text-[#806562]">
              Veja quem confirmou presença, quem não poderá comparecer e os totais atualizados da festa.
            </p>
          </div>

          <LogoutButton />
        </section>

        <PresenceStats stats={stats} />
        <DashboardRsvpManager initialRows={rows} />
        <DashboardFilters q={q} status={status} />
        <RsvpTable rows={rows} />
      </div>
    </main>
  );
}
