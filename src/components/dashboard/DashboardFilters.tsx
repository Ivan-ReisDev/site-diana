import type { DashboardStatusFilter } from '@/lib/rsvp/service';

export function DashboardFilters({
  q,
  status,
}: {
  q: string;
  status: DashboardStatusFilter;
}) {
  return (
    <form className="grid gap-4 rounded-[1.5rem] bg-white p-5 shadow-[0_12px_32px_rgba(185,75,105,.08)] md:grid-cols-[1fr_220px_auto] md:items-end" method="GET">
      <label className="grid gap-2 text-sm font-semibold text-[#8b5f6b]">
        <span>Buscar por nome ou telefone</span>
        <input
          className="rounded-2xl border border-[#f1c4d0] bg-white px-4 py-3 outline-none transition focus:border-[#df7894] focus:ring-4 focus:ring-pink-100"
          defaultValue={q}
          name="q"
          placeholder="Ex.: Família Reis"
        />
      </label>

      <label className="grid gap-2 text-sm font-semibold text-[#8b5f6b]">
        <span>Status de presença</span>
        <select
          className="rounded-2xl border border-[#f1c4d0] bg-white px-4 py-3 outline-none transition focus:border-[#df7894] focus:ring-4 focus:ring-pink-100"
          defaultValue={status}
          name="status"
        >
          <option value="all">Todos</option>
          <option value="yes">Confirmados</option>
          <option value="no">Não irão</option>
        </select>
      </label>

      <button className="rounded-full bg-[#df7894] px-5 py-3 font-bold text-white transition hover:brightness-105" type="submit">
        Aplicar filtros
      </button>
    </form>
  );
}
