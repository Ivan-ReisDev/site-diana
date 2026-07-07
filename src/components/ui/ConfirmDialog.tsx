"use client";

import { useEffect, useId, useRef, type ReactNode } from "react";

import { Button, type ButtonVariant } from "@/components/ui/Button";

export type ConfirmDialogProps = {
  open: boolean;
  title: string;
  message: ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  confirmVariant?: ButtonVariant;
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

export function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = "Confirmar",
  cancelLabel = "Cancelar",
  confirmVariant = "danger",
  loading = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const titleId = useId();
  const descId = useId();
  const confirmRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;

    confirmRef.current?.focus();

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape" && !loading) {
        onCancel();
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, loading, onCancel]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#3a1f27]/40 p-4"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !loading) {
          onCancel();
        }
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descId}
        className="w-full max-w-md space-y-4 rounded-3xl bg-white p-6 shadow-[0_24px_60px_rgba(150,80,100,.28)]"
      >
        <h2 id={titleId} className="text-lg font-black text-[#b85f78]">
          {title}
        </h2>
        <div id={descId} className="text-sm leading-6 text-[#745b58]">
          {message}
        </div>

        <div className="flex flex-wrap justify-end gap-3">
          <Button variant="secondary" type="button" onClick={onCancel} disabled={loading}>
            {cancelLabel}
          </Button>
          <Button
            ref={confirmRef}
            variant={confirmVariant}
            type="button"
            onClick={onConfirm}
            loading={loading}
            loadingLabel="Removendo…"
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
