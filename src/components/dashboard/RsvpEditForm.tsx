"use client";

import { useState, type FormEvent } from 'react';
import { AlertCircle, Plus, Trash2 } from 'lucide-react';

import { Button } from '@/components/ui/Button';
import { FormField } from '@/components/ui/FormField';
import { maskPhone } from '@/lib/masks/phone';
import { rsvpInputSchema } from '@/lib/rsvp/schema';
import type { RsvpSummary } from '@/lib/rsvp/service';
import { toFieldErrors } from '@/lib/validation/fieldErrors';

type AdultForm = {
  id: number;
  name: string;
};

type ChildForm = {
  id: number;
  name: string;
  age: string;
};

type RsvpEditFormProps = {
  row: RsvpSummary;
  onSaved: (rsvp: RsvpSummary) => void;
  onCancel: () => void;
  /** Chamado quando o registro já não existe (404) — o pai deve fechar e revalidar. */
  onNotFound?: () => void;
};

function buildInitialAdults(row: RsvpSummary): AdultForm[] {
  const source = row.adultsList.length > 0 ? row.adultsList : [{ name: row.name }];
  return source.map((adult, index) => ({ id: index + 1, name: adult.name }));
}

function buildInitialChildren(row: RsvpSummary): ChildForm[] {
  return row.childrenList.map((child, index) => ({
    id: index + 1,
    name: child.name,
    age: String(child.age),
  }));
}

export function RsvpEditForm({ row, onSaved, onCancel, onNotFound }: RsvpEditFormProps) {
  const initialAdults = buildInitialAdults(row);
  const initialChildren = buildInitialChildren(row);

  const [name, setName] = useState(row.name);
  const [phone, setPhone] = useState(row.phone);
  const [attendance, setAttendance] = useState<'sim' | 'nao'>(row.attendance);
  const [adults, setAdults] = useState<AdultForm[]>(initialAdults);
  const [nextAdultId, setNextAdultId] = useState(initialAdults.length + 1);
  const [children, setChildren] = useState<ChildForm[]>(initialChildren);
  const [nextChildId, setNextChildId] = useState(initialChildren.length + 1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  function updateAdult(id: number, value: string) {
    setAdults((current) => current.map((adult) => (adult.id === id ? { ...adult, name: value } : adult)));
  }

  function addAdult() {
    setAdults((current) => [...current, { id: nextAdultId, name: '' }]);
    setNextAdultId((current) => current + 1);
  }

  function removeAdult(id: number) {
    setAdults((current) => (current.length > 1 ? current.filter((adult) => adult.id !== id) : current));
  }

  function updateChild(id: number, field: 'name' | 'age', value: string) {
    setChildren((current) => current.map((child) => (child.id === id ? { ...child, [field]: value } : child)));
  }

  function addChild() {
    setChildren((current) => [...current, { id: nextChildId, name: '', age: '' }]);
    setNextChildId((current) => current + 1);
  }

  function removeChild(id: number) {
    setChildren((current) => current.filter((child) => child.id !== id));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const payload = {
      name: name.trim(),
      phone: phone.trim(),
      attendance,
      adults: adults.map((adult) => ({ name: adult.name.trim() })),
      children: children
        .map((child) => ({
          name: child.name.trim(),
          age: child.age === '' ? Number.NaN : Number(child.age),
        }))
        .filter((child) => child.name),
    };

    const parsed = rsvpInputSchema.safeParse(payload);

    if (!parsed.success) {
      const errors = toFieldErrors(parsed.error);
      setFieldErrors(errors);
      setError(
        errors.name ||
          errors.phone ||
          errors.adults ||
          errors.children ||
          'Verifique os campos destacados.',
      );
      return;
    }

    setFieldErrors({});
    setIsSubmitting(true);
    setError('');

    try {
      const response = await fetch(`/api/rsvp/${row.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(parsed.data),
      });

      const body = await response.json().catch(() => ({}));

      if (response.status === 404) {
        setError('Confirmação não encontrada. A lista foi atualizada.');
        onNotFound?.();
        return;
      }

      if (response.status === 409) {
        setFieldErrors((current) => ({ ...current, phone: 'Já existe uma confirmação com esse telefone.' }));
        setError(body.message || 'Já existe uma confirmação com esse telefone.');
        return;
      }

      if (!response.ok || !body.ok) {
        setError(body.message || 'Não foi possível salvar as alterações agora.');
        return;
      }

      onSaved(body.rsvp as RsvpSummary);
    } catch {
      setError('Não foi possível salvar as alterações agora.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      <div className="grid gap-4 md:grid-cols-2">
        <FormField
          id={`edit-name-${row.id}`}
          label="Nome completo"
          value={name}
          onChange={(event) => {
            setName(event.target.value);
            setFieldErrors((current) => ({ ...current, name: '' }));
          }}
          placeholder="Nome completo"
          error={fieldErrors.name}
        />

        <FormField
          id={`edit-phone-${row.id}`}
          label="Telefone"
          type="tel"
          inputMode="tel"
          value={phone}
          onChange={(event) => {
            setPhone(maskPhone(event.target.value));
            setFieldErrors((current) => ({ ...current, phone: '' }));
          }}
          placeholder="(21) 99999-9999"
          maxLength={16}
          error={fieldErrors.phone}
        />

        <FormField
          id={`edit-attendance-${row.id}`}
          label="Presença"
          as="select"
          value={attendance}
          onChange={(event) => setAttendance(event.target.value as 'sim' | 'nao')}
        >
          <option value="sim">Sim, estarão presentes</option>
          <option value="nao">Não poderão ir</option>
        </FormField>
      </div>

      <div className="rounded-2xl border border-[#f8d7df] bg-[#fffafc] p-4">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <p className="invite-label">Adultos</p>
            <p className="mt-1 text-sm text-[#806562]">Adicione o nome completo de cada adulto.</p>
          </div>
          <Button variant="ghost" type="button" icon={<Plus className="h-4 w-4" />} onClick={addAdult}>
            Adicionar adulto
          </Button>
        </div>

        <div className="space-y-4">
          {adults.map((adult, index) => (
            <div
              key={adult.id}
              className="grid gap-3 rounded-[1.1rem] border border-[#f3d6de] bg-white p-4 md:grid-cols-[1.3fr_auto] md:items-end"
            >
              <FormField
                id={`edit-adult-${row.id}-${adult.id}`}
                label={`Nome completo do adulto ${index + 1}`}
                value={adult.name}
                onChange={(event) => updateAdult(adult.id, event.target.value)}
                placeholder={`Adulto ${index + 1}`}
              />

              <Button
                variant="danger"
                type="button"
                icon={<Trash2 className="h-4 w-4" />}
                disabled={adults.length === 1}
                onClick={() => removeAdult(adult.id)}
                aria-label={`Remover adulto ${index + 1}`}
              >
                Remover
              </Button>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-[#f8d7df] bg-[#fffafc] p-4">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <p className="invite-label">Crianças</p>
            <p className="mt-1 text-sm text-[#806562]">Adicione o nome completo e a idade de cada criança.</p>
          </div>
          <Button variant="ghost" type="button" icon={<Plus className="h-4 w-4" />} onClick={addChild}>
            Adicionar criança
          </Button>
        </div>

        {children.length === 0 ? (
          <p className="text-sm text-[#806562]">Nenhuma criança adicionada.</p>
        ) : (
          <div className="space-y-4">
            {children.map((child, index) => (
              <div
                key={child.id}
                className="grid gap-3 rounded-[1.1rem] border border-[#f3d6de] bg-white p-4 md:grid-cols-[1.3fr_.6fr_auto] md:items-end"
              >
                <FormField
                  id={`edit-child-${row.id}-${child.id}`}
                  label={`Nome completo da criança ${index + 1}`}
                  value={child.name}
                  onChange={(event) => updateChild(child.id, 'name', event.target.value)}
                  placeholder={`Criança ${index + 1}`}
                />

                <FormField
                  id={`edit-child-age-${row.id}-${child.id}`}
                  label="Idade"
                  type="number"
                  min={0}
                  value={child.age}
                  onChange={(event) => updateChild(child.id, 'age', event.target.value)}
                  placeholder="0"
                />

                <Button
                  variant="danger"
                  type="button"
                  icon={<Trash2 className="h-4 w-4" />}
                  onClick={() => removeChild(child.id)}
                  aria-label={`Remover criança ${index + 1}`}
                >
                  Remover
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>

      {error ? (
        <p
          role="alert"
          aria-live="polite"
          className="inline-flex items-center gap-2 text-sm font-semibold text-red-600"
        >
          <AlertCircle className="h-4 w-4" aria-hidden="true" />
          <span>{error}</span>
        </p>
      ) : null}

      <div className="flex flex-wrap gap-3">
        <Button variant="primary" type="submit" loading={isSubmitting} loadingLabel="Salvando…">
          Salvar alterações
        </Button>
        <Button variant="secondary" type="button" onClick={onCancel} disabled={isSubmitting}>
          Cancelar
        </Button>
      </div>
    </form>
  );
}
