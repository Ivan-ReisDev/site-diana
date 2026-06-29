"use client";

import { useRouter } from 'next/navigation';
import { useMemo, useState, type FormEvent } from 'react';
import { AlertCircle, CheckCircle2, Plus, Trash2 } from 'lucide-react';

import { Button } from '@/components/ui/Button';
import { FormField } from '@/components/ui/FormField';
import { SectionCard } from '@/components/ui/SectionCard';
import { SectionHeader } from '@/components/ui/SectionHeader';
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

type DashboardRsvpManagerProps = {
  initialRows: RsvpSummary[];
};

function createAdult(id: number): AdultForm {
  return { id, name: '' };
}

function createChild(id: number): ChildForm {
  return { id, name: '', age: '' };
}

export function DashboardRsvpManager({ initialRows }: DashboardRsvpManagerProps) {
  const router = useRouter();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [attendance, setAttendance] = useState<'sim' | 'nao'>('sim');
  const [adults, setAdults] = useState<AdultForm[]>([createAdult(1)]);
  const [nextAdultId, setNextAdultId] = useState(2);
  const [children, setChildren] = useState<ChildForm[]>([]);
  const [nextChildId, setNextChildId] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const knownPhones = useMemo(() => initialRows.map((row) => row.phone), [initialRows]);

  function updateAdult(id: number, field: keyof Omit<AdultForm, 'id'>, value: string) {
    setAdults((current) => current.map((adult) => (adult.id === id ? { ...adult, [field]: value } : adult)));
  }

  function addAdult() {
    setAdults((current) => [...current, createAdult(nextAdultId)]);
    setNextAdultId((current) => current + 1);
  }

  function removeAdult(id: number) {
    setAdults((current) => (current.length > 1 ? current.filter((adult) => adult.id !== id) : current));
  }

  function updateChild(id: number, field: keyof Omit<ChildForm, 'id'>, value: string) {
    setChildren((current) => current.map((child) => (child.id === id ? { ...child, [field]: value } : child)));
  }

  function addChild() {
    setChildren((current) => [...current, createChild(nextChildId)]);
    setNextChildId((current) => current + 1);
  }

  function removeChild(id: number) {
    setChildren((current) => current.filter((child) => child.id !== id));
  }

  function resetForm() {
    setName('');
    setPhone('');
    setAttendance('sim');
    setAdults([createAdult(1)]);
    setNextAdultId(2);
    setChildren([]);
    setNextChildId(1);
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
      setFeedback('');
      return;
    }

    setFieldErrors({});
    setIsSubmitting(true);
    setError('');
    setFeedback('');

    try {
      const response = await fetch('/api/rsvp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(parsed.data),
      });

      const body = await response.json();

      if (!response.ok || !body.ok) {
        setError(body.message || 'Não foi possível salvar esse grupo agora.');
        return;
      }

      const updated = knownPhones.includes(phone.trim()) ? 'Grupo atualizado com sucesso.' : 'Grupo adicionado com sucesso.';
      setFeedback(updated);
      resetForm();
      router.refresh();
    } catch {
      setError('Não foi possível salvar esse grupo agora.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <SectionCard>
      <SectionHeader
        eyebrow="Cadastro manual"
        title="Adicionar ou atualizar grupo"
        description="Use o telefone para atualizar um grupo existente ou cadastrar um novo grupo direto pela dashboard."
      />

      <form className="mt-5 space-y-5" onSubmit={handleSubmit}>
        <div className="grid gap-4 md:grid-cols-2">
          <FormField
            id="dashboard-name"
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
            id="dashboard-phone"
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
            id="dashboard-attendance"
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
              <div key={adult.id} className="grid gap-3 rounded-[1.1rem] border border-[#f3d6de] bg-white p-4 md:grid-cols-[1.3fr_auto] md:items-end">
                <FormField
                  id={`dashboard-adult-${adult.id}`}
                  label={`Nome completo do adulto ${index + 1}`}
                  value={adult.name}
                  onChange={(event) => updateAdult(adult.id, 'name', event.target.value)}
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
                <div key={child.id} className="grid gap-3 rounded-[1.1rem] border border-[#f3d6de] bg-white p-4 md:grid-cols-[1.3fr_.6fr_auto] md:items-end">
                  <FormField
                    id={`dashboard-child-${child.id}`}
                    label={`Nome completo da criança ${index + 1}`}
                    value={child.name}
                    onChange={(event) => updateChild(child.id, 'name', event.target.value)}
                    placeholder={`Criança ${index + 1}`}
                  />

                  <FormField
                    id={`dashboard-child-age-${child.id}`}
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
        {feedback ? (
          <p
            role="status"
            aria-live="polite"
            className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-700"
          >
            <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
            <span>{feedback}</span>
          </p>
        ) : null}

        <div className="flex flex-wrap gap-3">
          <Button variant="primary" type="submit" loading={isSubmitting} loadingLabel="Salvando…">
            Salvar grupo na dashboard
          </Button>
          <Button
            variant="secondary"
            type="button"
            onClick={() => {
              resetForm();
              setError('');
              setFeedback('');
              setFieldErrors({});
            }}
          >
            Limpar formulário
          </Button>
        </div>
      </form>
    </SectionCard>
  );
}