"use client";

import { useState } from 'react';
import { AlertCircle, Loader2, Trash2 } from 'lucide-react';

import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { SectionCard } from '@/components/ui/SectionCard';
import { SectionHeader } from '@/components/ui/SectionHeader';

export type RecadoItem = {
  id: string;
  nome: string;
  mensagem: string;
  createdAt: string;
};

type RecadosManagerProps = {
  initialRecados: RecadoItem[];
};

function formatDate(value: string) {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return "";
  return new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(parsed);
}

export function RecadosManager({ initialRecados }: RecadosManagerProps) {
  const [recados, setRecados] = useState<RecadoItem[]>(initialRecados);
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [error, setError] = useState('');

  async function handleRemove(id: string) {
    setError('');
    setPendingId(id);

    try {
      const response = await fetch(`/api/recados/${id}`, { method: 'DELETE' });

      if (response.status === 401) {
        setError('Sessão expirada. Faça login novamente.');
        return;
      }

      if (response.status === 404) {
        setRecados((current) => current.filter((recado) => recado.id !== id));
        return;
      }

      if (!response.ok) {
        const body = await response.json().catch(() => null);
        setError(body?.message || 'Não foi possível remover o recado.');
        return;
      }

      setRecados((current) => current.filter((recado) => recado.id !== id));
    } catch {
      setError('Não foi possível remover o recado.');
    } finally {
      setPendingId(null);
    }
  }

  return (
    <SectionCard>
      <SectionHeader
        eyebrow="Moderação"
        title="Mural de Recados"
        description="Remova aqui qualquer recado que não deva permanecer no mural público."
      />

      {error ? (
        <p
          role="alert"
          aria-live="polite"
          className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-red-600"
        >
          <AlertCircle className="h-4 w-4" aria-hidden="true" />
          <span>{error}</span>
        </p>
      ) : null}

      {recados.length === 0 ? (
        <div className="mt-4">
          <EmptyState message="Nenhum recado no mural ainda." />
        </div>
      ) : (
        <ul className="mt-4 space-y-4">
          {recados.map((recado) => {
            const isPending = pendingId === recado.id;
            return (
              <li
                key={recado.id}
                className="rounded-2xl border border-[#f3d6de] bg-[#fffafc] p-4"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <p className="text-base font-black text-[#b85f78]">
                      {recado.nome}
                    </p>
                    <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-[#745b58]">
                      {recado.mensagem}
                    </p>
                    <p className="mt-2 text-xs font-semibold text-[#b78b8c]">
                      {formatDate(recado.createdAt)}
                    </p>
                  </div>
                  <Button
                    variant="danger"
                    type="button"
                    icon={isPending ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : <Trash2 className="h-4 w-4" aria-hidden="true" />}
                    disabled={isPending}
                    onClick={() => handleRemove(recado.id)}
                    aria-label={`Remover recado de ${recado.nome}`}
                  >
                    {isPending ? 'Removendo…' : 'Remover'}
                  </Button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </SectionCard>
  );
}