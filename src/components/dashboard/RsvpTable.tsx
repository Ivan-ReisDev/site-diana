import type { RsvpSummary } from '@/lib/rsvp/service';

function formatDate(date: Date) {
  return new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(date);
}

function formatParticipant(participant: RsvpSummary['participants'][number]) {
  const typeLabel = participant.type === 'adulto' ? 'Adulto' : 'Criança';
  return `${participant.name} • ${typeLabel} • ${participant.age} ano${participant.age === 1 ? '' : 's'}`;
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
      <div className="hidden grid-cols-[1.8fr_1fr_.8fr_.8fr_.8fr_1.2fr] gap-4 border-b border-[#f5d8e0] px-6 py-4 text-xs font-bold uppercase tracking-[.2em] text-[#c77b8f] md:grid">
        <span>Grupo / pessoas</span>
        <span>Telefone</span>
        <span>Status</span>
        <span>Adultos</span>
        <span>Crianças</span>
        <span>Atualizado</span>
      </div>

      <div className="divide-y divide-[#f7e4ea]">
        {rows.map((row) => (
          <article key={row.id} className="grid gap-4 px-6 py-5 md:grid-cols-[1.8fr_1fr_.8fr_.8fr_.8fr_1.2fr] md:items-start">
            <div>
              <p className="text-lg font-black text-[#b85f78]">{row.displayName}</p>
              {row.groupName && <p className="mt-1 text-sm font-semibold text-[#9d5f70]">{row.groupName}</p>}
              <p className="mt-1 text-sm text-[#806562]">Total do grupo: {row.total}</p>
              <ul className="mt-3 space-y-1 text-sm leading-6 text-[#745b58]">
                {row.participants.map((participant) => (
                  <li key={`${row.id}-${participant.name}-${participant.age}`}>{formatParticipant(participant)}</li>
                ))}
              </ul>
              {row.message && <p className="mt-3 text-sm leading-6 text-[#745b58]">“{row.message}”</p>}
            </div>
            <p className="text-sm font-semibold text-[#745b58]">{row.phone}</p>
            <p className="text-sm font-bold text-[#745b58]">{row.attendance === 'sim' ? 'Confirmado' : 'Não irá'}</p>
            <p className="text-sm font-semibold text-[#745b58]">{row.adults}</p>
            <p className="text-sm font-semibold text-[#745b58]">{row.children}</p>
            <p className="text-sm text-[#8f7370]">{formatDate(new Date(row.updatedAt))}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
