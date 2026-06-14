"use client";

import { useRouter } from 'next/navigation';
import { useMemo, useState, type FormEvent } from 'react';

import type { RsvpSummary } from '@/lib/rsvp/service';

type ChildForm = {
  id: number;
  name: string;
  age: string;
};

type DashboardRsvpManagerProps = {
  initialRows: RsvpSummary[];
};

function createChild(id: number): ChildForm {
  return { id, name: '', age: '' };
}

export function DashboardRsvpManager({ initialRows }: DashboardRsvpManagerProps) {
  const router = useRouter();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [attendance, setAttendance] = useState<'sim' | 'nao'>('sim');
  const [adults, setAdults] = useState<ChildForm[]>([createChild(1)]);
  const [nextAdultId, setNextAdultId] = useState(2);
  const [children, setChildren] = useState<ChildForm[]>([]);
  const [nextChildId, setNextChildId] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [error, setError] = useState('');

  const knownPhones = useMemo(() => initialRows.map((row) => row.phone), [initialRows]);

  function updateAdult(id: number, field: keyof Omit<ChildForm, 'id'>, value: string) {
    setAdults((current) => current.map((adult) => (adult.id === id ? { ...adult, [field]: value } : adult)));
  }

  function addAdult() {
    setAdults((current) => [...current, createChild(nextAdultId)]);
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
    setAdults([createChild(1)]);
    setNextAdultId(2);
    setChildren([]);
    setNextChildId(1);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const normalizedAdults = adults.map((adult) => ({ name: adult.name.trim(), age: Number(adult.age) }));
    const normalizedChildren = children
      .map((child) => ({ name: child.name.trim(), age: Number(child.age) }))
      .filter((child) => child.name);

    if (!name.trim() || !phone.trim()) {
      setError('Informe o nome completo e o telefone.');
      setFeedback('');
      return;
    }

    if (normalizedAdults.some((adult) => !adult.name || Number.isNaN(adult.age))) {
      setError('Informe o nome completo e a idade de cada adulto.');
      setFeedback('');
      return;
    }

    if (normalizedChildren.some((child) => Number.isNaN(child.age))) {
      setError('Informe a idade de cada criança.');
      setFeedback('');
      return;
    }

    setIsSubmitting(true);
    setError('');
    setFeedback('');

    try {
      const response = await fetch('/api/rsvp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          phone: phone.trim(),
          attendance,
          adults: normalizedAdults,
          children: normalizedChildren,
        }),
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
    <section className="rounded-[1.5rem] bg-white p-5 shadow-[0_12px_32px_rgba(185,75,105,.08)] sm:p-6">
      <div className="mb-5">
        <p className="text-sm font-semibold uppercase tracking-[.3em] text-[#d36f8a]">Cadastro manual</p>
        <h2 className="mt-2 font-serif text-3xl font-black text-[#b85f78]">Adicionar ou atualizar grupo</h2>
        <p className="mt-2 text-sm leading-6 text-[#806562]">
          Use o telefone para atualizar um grupo existente ou cadastrar um novo grupo direto pela dashboard.
        </p>
      </div>

      <form className="space-y-5" onSubmit={handleSubmit}>
        <div className="grid gap-4 md:grid-cols-2">
          <label className="grid gap-2 text-sm font-semibold text-[#8b5f6b]">
            <span>Nome completo</span>
            <input
              className="rounded-2xl border border-[#f1c4d0] bg-white px-4 py-3 outline-none transition focus:border-[#df7894] focus:ring-4 focus:ring-pink-100"
              onChange={(event) => setName(event.target.value)}
              placeholder="Nome completo"
              value={name}
            />
          </label>

          <label className="grid gap-2 text-sm font-semibold text-[#8b5f6b]">
            <span>Telefone</span>
            <input
              className="rounded-2xl border border-[#f1c4d0] bg-white px-4 py-3 outline-none transition focus:border-[#df7894] focus:ring-4 focus:ring-pink-100"
              onChange={(event) => setPhone(event.target.value)}
              placeholder="(21) 99999-9999"
              value={phone}
            />
          </label>

          <label className="grid gap-2 text-sm font-semibold text-[#8b5f6b]">
            <span>Presença</span>
            <select
              className="rounded-2xl border border-[#f1c4d0] bg-white px-4 py-3 outline-none transition focus:border-[#df7894] focus:ring-4 focus:ring-pink-100"
              onChange={(event) => setAttendance(event.target.value as 'sim' | 'nao')}
              value={attendance}
            >
              <option value="sim">Sim, estarão presentes</option>
              <option value="nao">Não poderão ir</option>
            </select>
          </label>

        </div>

        <div className="rounded-[1.25rem] border border-[#f8d7df] bg-[#fffafc] p-4">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-black uppercase tracking-[.2em] text-[#d36f8a]">Adultos</p>
              <p className="mt-1 text-sm text-[#806562]">Adicione o nome completo e a idade de cada adulto.</p>
            </div>
            <button
              className="rounded-full bg-[#f7dce4] px-4 py-2 text-sm font-bold text-[#a14f67] transition hover:brightness-95"
              type="button"
              onClick={addAdult}
            >
              Adicionar adulto
            </button>
          </div>

          <div className="space-y-4">
            {adults.map((adult, index) => (
              <div key={adult.id} className="grid gap-3 rounded-[1.1rem] border border-[#f3d6de] bg-white p-4 md:grid-cols-[1.3fr_.6fr_auto] md:items-end">
                <label className="grid gap-2 text-sm font-semibold text-[#8b5f6b]">
                  <span>Nome completo do adulto {index + 1}</span>
                  <input
                    className="rounded-2xl border border-[#f1c4d0] bg-white px-4 py-3 outline-none transition focus:border-[#df7894] focus:ring-4 focus:ring-pink-100"
                    onChange={(event) => updateAdult(adult.id, 'name', event.target.value)}
                    placeholder={`Adulto ${index + 1}`}
                    value={adult.name}
                  />
                </label>

                <label className="grid gap-2 text-sm font-semibold text-[#8b5f6b]">
                  <span>Idade</span>
                  <input
                    className="rounded-2xl border border-[#f1c4d0] bg-white px-4 py-3 outline-none transition focus:border-[#df7894] focus:ring-4 focus:ring-pink-100"
                    min="0"
                    onChange={(event) => updateAdult(adult.id, 'age', event.target.value)}
                    placeholder="0"
                    type="number"
                    value={adult.age}
                  />
                </label>

                <button
                  className="rounded-full border border-[#f1c4d0] px-4 py-3 text-sm font-bold text-[#a14f67] transition hover:bg-[#fff4f7] disabled:cursor-not-allowed disabled:opacity-40"
                  disabled={adults.length === 1}
                  type="button"
                  onClick={() => removeAdult(adult.id)}
                >
                  Remover
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[1.25rem] border border-[#f8d7df] bg-[#fffafc] p-4">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-black uppercase tracking-[.2em] text-[#d36f8a]">Crianças</p>
              <p className="mt-1 text-sm text-[#806562]">Adicione o nome completo e a idade de cada criança.</p>
            </div>
            <button
              className="rounded-full bg-[#f7dce4] px-4 py-2 text-sm font-bold text-[#a14f67] transition hover:brightness-95"
              type="button"
              onClick={addChild}
            >
              Adicionar criança
            </button>
          </div>

          {children.length === 0 ? (
            <p className="text-sm text-[#806562]">Nenhuma criança adicionada.</p>
          ) : (
            <div className="space-y-4">
              {children.map((child, index) => (
                <div key={child.id} className="grid gap-3 rounded-[1.1rem] border border-[#f3d6de] bg-white p-4 md:grid-cols-[1.3fr_.6fr_auto] md:items-end">
                  <label className="grid gap-2 text-sm font-semibold text-[#8b5f6b]">
                    <span>Nome completo da criança {index + 1}</span>
                    <input
                      className="rounded-2xl border border-[#f1c4d0] bg-white px-4 py-3 outline-none transition focus:border-[#df7894] focus:ring-4 focus:ring-pink-100"
                      onChange={(event) => updateChild(child.id, 'name', event.target.value)}
                      placeholder={`Criança ${index + 1}`}
                      value={child.name}
                    />
                  </label>

                  <label className="grid gap-2 text-sm font-semibold text-[#8b5f6b]">
                    <span>Idade</span>
                    <input
                      className="rounded-2xl border border-[#f1c4d0] bg-white px-4 py-3 outline-none transition focus:border-[#df7894] focus:ring-4 focus:ring-pink-100"
                      min="0"
                      onChange={(event) => updateChild(child.id, 'age', event.target.value)}
                      placeholder="0"
                      type="number"
                      value={child.age}
                    />
                  </label>

                  <button
                    className="rounded-full border border-[#f1c4d0] px-4 py-3 text-sm font-bold text-[#a14f67] transition hover:bg-[#fff4f7]"
                    type="button"
                    onClick={() => removeChild(child.id)}
                  >
                    Remover
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {error ? <p className="text-sm font-semibold text-red-600">{error}</p> : null}
        {feedback ? <p className="text-sm font-semibold text-emerald-700">{feedback}</p> : null}

        <div className="flex flex-wrap gap-3">
          <button
            className="rounded-full bg-[#df7894] px-5 py-3 font-bold text-white transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-70"
            disabled={isSubmitting}
            type="submit"
          >
            {isSubmitting ? 'Salvando...' : 'Salvar grupo na dashboard'}
          </button>
          <button
            className="rounded-full border border-[#f1c4d0] px-5 py-3 font-bold text-[#a14f67] transition hover:bg-[#fff4f7]"
            type="button"
            onClick={() => {
              resetForm();
              setError('');
              setFeedback('');
            }}
          >
            Limpar formulário
          </button>
        </div>
      </form>
    </section>
  );
}
