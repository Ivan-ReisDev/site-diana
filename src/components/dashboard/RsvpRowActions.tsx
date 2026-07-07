"use client";

import { useRouter } from 'next/navigation';
import { useEffect, useId, useState } from 'react';
import { AlertCircle, CheckCircle2, Pencil, Trash2 } from 'lucide-react';

import { RsvpEditForm } from '@/components/dashboard/RsvpEditForm';
import { Button } from '@/components/ui/Button';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import type { RsvpSummary } from '@/lib/rsvp/service';

type RsvpRowActionsProps = {
  row: RsvpSummary;
};

export function RsvpRowActions({ row }: RsvpRowActionsProps) {
  const router = useRouter();
  const editTitleId = useId();
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isEditing) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') setIsEditing(false);
    }

    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [isEditing]);

  async function handleDelete() {
    setIsDeleting(true);
    setError('');
    setFeedback('');

    try {
      const response = await fetch(`/api/rsvp/${row.id}`, { method: 'DELETE' });
      const body = await response.json().catch(() => ({}));

      if (response.status === 404) {
        setConfirmingDelete(false);
        setError('Confirmação não encontrada. A lista foi atualizada.');
        router.refresh();
        return;
      }

      if (!response.ok || !body.ok) {
        setError(body.message || 'Não foi possível excluir essa confirmação agora.');
        return;
      }

      setConfirmingDelete(false);
      setFeedback('Confirmação removida.');
      router.refresh();
    } catch {
      setError('Não foi possível excluir essa confirmação agora.');
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <div className="flex flex-col items-start gap-2 md:items-end" data-testid="rsvp-row-actions">
      <div className="flex flex-wrap items-center gap-2">
        <Button
          variant="secondary"
          size="sm"
          type="button"
          icon={<Pencil className="h-4 w-4" />}
          onClick={() => {
            setError('');
            setFeedback('');
            setIsEditing(true);
          }}
          aria-label={`Editar confirmação de ${row.name}`}
        >
          Editar
        </Button>
        <Button
          variant="danger"
          size="sm"
          type="button"
          icon={<Trash2 className="h-4 w-4" />}
          onClick={() => {
            setError('');
            setFeedback('');
            setConfirmingDelete(true);
          }}
          aria-label={`Excluir confirmação de ${row.name}`}
        >
          Excluir
        </Button>
      </div>

      {feedback ? (
        <p
          role="status"
          aria-live="polite"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700"
        >
          <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
          <span>{feedback}</span>
        </p>
      ) : null}
      {error ? (
        <p
          role="alert"
          aria-live="polite"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-red-600"
        >
          <AlertCircle className="h-3.5 w-3.5" aria-hidden="true" />
          <span>{error}</span>
        </p>
      ) : null}

      <ConfirmDialog
        open={confirmingDelete}
        title="Excluir confirmação"
        message={
          <>
            Tem certeza que deseja excluir a confirmação de{' '}
            <strong className="text-[#b85f78]">{row.name}</strong>? Esta ação não pode ser desfeita.
          </>
        }
        confirmLabel="Confirmar exclusão"
        cancelLabel="Cancelar"
        loading={isDeleting}
        onConfirm={handleDelete}
        onCancel={() => setConfirmingDelete(false)}
      />

      {isEditing ? (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-[#3a1f27]/40 p-4 sm:items-center"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setIsEditing(false);
            }
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby={editTitleId}
            className="my-8 w-full max-w-2xl space-y-5 rounded-3xl bg-white p-6 shadow-[0_24px_60px_rgba(150,80,100,.28)]"
          >
            <div>
              <h2 id={editTitleId} className="text-lg font-black text-[#b85f78]">
                Editar confirmação
              </h2>
              <p className="mt-1 text-sm text-[#806562]">
                Ajuste os dados de <strong className="text-[#b85f78]">{row.name}</strong>.
              </p>
            </div>

            <RsvpEditForm
              row={row}
              onSaved={() => {
                setIsEditing(false);
                setFeedback('Confirmação atualizada.');
                router.refresh();
              }}
              onCancel={() => setIsEditing(false)}
              onNotFound={() => {
                setIsEditing(false);
                setError('Confirmação não encontrada. A lista foi atualizada.');
                router.refresh();
              }}
            />
          </div>
        </div>
      ) : null}
    </div>
  );
}
