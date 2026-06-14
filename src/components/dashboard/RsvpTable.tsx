import type { RsvpSummary } from '@/lib/rsvp/service';

function formatDate(date: Date) {
  return new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(date);
}

function formatGuest(guest: RsvpSummary['childrenList'][number]) {
  return `${guest.name} • ${guest.age} ano${guest.age === 1 ? '' : 's'}`;
}

export function RsvpTable({ rows }: { rows: RsvpSummary[] }) {
  if (rows.length === 0) {
    return (
      <section className="rounded-[1.5rem] bg-white p-8 text-center shadow-[0_12px_32px_rgba(185,75,105,.08)]">
        <p className="text-lg font-semibold text-[#8b5f6b]">Nenhuma confirmação encontrada com os filtros atuais.</p>
      </section>
    );
  }

  return (
    <section className="overflow-hidden rounded-[1.5rem] bg-white shadow-[0_12px_32px_rgba(185,75,105,.08)]">
      <div className="hidden grid-cols-[1.6fr_1fr_.8fr_1.3fr_1.3fr_1.2fr] gap-4 border-b border-[#f5d8e0] px-6 py-4 text-xs font-bold uppercase tracking-[.2em] text-[#c77b8f] md:grid">
        <span>Nome completo</span>
        <span>Telefone</span>
        <span>Status</span>
        <span>Adultos</span>
        <span>Crianças</span>
        <span>Atualizado</span>
      </div>

      <div className="divide-y divide-[#f7e4ea]">
        {rows.map((row) => (
          <article key={row.id} className="grid gap-4 px-6 py-5 md:grid-cols-[1.6fr_1fr_.8fr_1.3fr_1.3fr_1.2fr] md:items-start">
            <div>
              <p className="text-lg font-black text-[#b85f78]">{row.name}</p>
              <p className="mt-1 text-sm text-[#806562]">Total do grupo: {row.total}</p>
            </div>
            <p className="text-sm font-semibold text-[#745b58]">{row.phone}</p>
            <p className="text-sm font-bold text-[#745b58]">{row.attendance === 'sim' ? 'Confirmado' : 'Não irá'}</p>
            <div className="text-sm leading-6 text-[#745b58]">
              {row.adultsList.length === 0 ? (
                <span>—</span>
              ) : (
                <ul className="space-y-1">
                  {row.adultsList.map((adult) => (
                    <li key={`${row.id}-adult-${adult.name}-${adult.age}`}>{formatGuest(adult)}</li>
                  ))}
                </ul>
              )}
            </div>
            <div className="text-sm leading-6 text-[#745b58]">
              {row.childrenList.length === 0 ? (
                <span>—</span>
              ) : (
                <ul className="space-y-1">
                  {row.childrenList.map((child) => (
                    <li key={`${row.id}-child-${child.name}-${child.age}`}>{formatGuest(child)}</li>
                  ))}
                </ul>
              )}
            </div>
            <p className="text-sm text-[#8f7370]">{formatDate(new Date(row.updatedAt))}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
