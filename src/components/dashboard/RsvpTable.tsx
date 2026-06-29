import { CheckCircle2, XCircle } from 'lucide-react';

import { EmptyState } from '@/components/ui/EmptyState';
import { SectionCard } from '@/components/ui/SectionCard';
import type { RsvpSummary } from '@/lib/rsvp/service';

function formatDate(date: Date) {
  return new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(date);
}

function formatChild(child: RsvpSummary['childrenList'][number]) {
  return `${child.name} • ${child.age} ano${child.age === 1 ? '' : 's'}`;
}

export function RsvpTable({ rows }: { rows: RsvpSummary[] }) {
  if (rows.length === 0) {
    return (
      <SectionCard className="space-y-3 text-center">
        <EmptyState message="Nenhuma confirmação encontrada com os filtros atuais." />
      </SectionCard>
    );
  }

  return (
    <SectionCard className="overflow-hidden !p-0">
      <div className="hidden grid-cols-[1.6fr_1fr_.8fr_1.3fr_1.3fr_1.2fr] gap-4 border-b border-[#f5d8e0] px-6 py-4 text-xs font-bold uppercase tracking-[.2em] text-[#c77b8f] md:grid">
        <span>Nome completo</span>
        <span>Telefone</span>
        <span>Status</span>
        <span>Adultos</span>
        <span>Crianças</span>
        <span>Atualizado</span>
      </div>

      <div className="divide-y divide-[#f7e4ea]">
        {rows.map((row) => {
          const isConfirmed = row.attendance === 'sim';
          return (
            <article
              key={row.id}
              className="grid gap-4 px-5 py-5 sm:px-6 md:grid-cols-[1.6fr_1fr_.8fr_1.3fr_1.3fr_1.2fr] md:items-start"
            >
              <div className="space-y-1">
                <p className="text-lg font-black text-[#b85f78]">{row.name}</p>
                <p className="text-xs text-[#806562] sm:text-sm">Total do grupo: {row.total}</p>
                <p className="text-xs text-[#8f7370] md:hidden">{row.phone}</p>
              </div>

              <p className="hidden text-sm font-semibold text-[#745b58] md:block">{row.phone}</p>

              <div className="flex items-center gap-2">
                {isConfirmed ? (
                  <CheckCircle2
                    className="h-4 w-4 shrink-0 text-[#2f8a5a]"
                    aria-hidden="true"
                  />
                ) : (
                  <XCircle
                    className="h-4 w-4 shrink-0 text-[#b94a64]"
                    aria-hidden="true"
                  />
                )}
                <span
                  className={[
                    "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-bold",
                    isConfirmed
                      ? "bg-[#e6f4ec] text-[#2f8a5a]"
                      : "bg-[#fde9ee] text-[#b94a64]",
                  ].join(" ")}
                >
                  {isConfirmed ? "Confirmado" : "Não irá"}
                </span>
              </div>

              <div className="text-sm leading-6 text-[#745b58]">
                <p className="invite-label mb-1 md:hidden">Adultos</p>
                {row.adultsList.length === 0 ? (
                  <span className="text-[#8f7370]">—</span>
                ) : (
                  <ul className="space-y-1">
                    {row.adultsList.map((adult) => (
                      <li key={`${row.id}-adult-${adult.name}`}>{adult.name}</li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="text-sm leading-6 text-[#745b58]">
                <p className="invite-label mb-1 md:hidden">Crianças</p>
                {row.childrenList.length === 0 ? (
                  <span className="text-[#8f7370]">—</span>
                ) : (
                  <ul className="space-y-1">
                    {row.childrenList.map((child) => (
                      <li key={`${row.id}-child-${child.name}-${child.age}`}>{formatChild(child)}</li>
                    ))}
                  </ul>
                )}
              </div>

              <p className="text-xs text-[#8f7370] sm:text-sm">
                <span className="invite-label mr-1 md:hidden">Atualizado:</span>
                {formatDate(new Date(row.updatedAt))}
              </p>
            </article>
          );
        })}
      </div>
    </SectionCard>
  );
}