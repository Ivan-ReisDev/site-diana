"use client";

import { useRouter } from 'next/navigation';
import { useMemo, useState, type FormEvent } from 'react';

import type { RsvpSummary } from '@/lib/rsvp/service';

type ParticipantForm = {
  id: number;
  name: string;
  type: 'adulto' | 'crianca';
  age: string;
};

type DashboardRsvpManagerProps = {
  initialRows: RsvpSummary[];
};

function createParticipant(id: number): ParticipantForm {
  return { id, name: '', type: 'adulto', age: '' };
}

export function DashboardRsvpManager({ initialRows }: DashboardRsvpManagerProps) {
  const router = useRouter();
  const [groupName, setGroupName] = useState('');
  const [phone, setPhone] = useState('');
  const [attendance, setAttendance] = useState<'sim' | 'nao'>('sim');
  const [message, setMessage] = useState('');
  const [participants, setParticipants] = useState<ParticipantForm[]>([createParticipant(1)]);
  const [nextParticipantId, setNextParticipantId] = useState(2);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [error, setError] = useState('');

  const knownPhones = useMemo(() => initialRows.map((row) => row.phone), [initialRows]);

  function updateParticipant(id: number, field: keyof Omit<ParticipantForm, 'id'>, value: string) {
    setParticipants((current) => current.map((participant) => (participant.id === id ? { ...participant, [field]: value } : participant)));
  }

  function addParticipant() {
    setParticipants((current) => [...current, createParticipant(nextParticipantId)]);
    setNextParticipantId((current) => current + 1);
  }

  function removeParticipant(id: number) {
    setParticipants((current) => (current.length === 1 ? current : current.filter((participant) => participant.id !== id)));
  }

  function resetForm() {
    setGroupName('');
    setPhone('');
    setAttendance('sim');
    setMessage('');
    setParticipants([createParticipant(1)]);
    setNextParticipantId(2);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const normalizedParticipants = participants
      .map((participant) => ({
        name: participant.name.trim(),
        type: participant.type,
        age: Number(participant.age),
      }))
      .filter((participant) => participant.name);

    if (!phone.trim() || normalizedParticipants.length === 0) {
      setError('Informe telefone e pelo menos uma pessoa.');
      setFeedback('');
      return;
    }

    if (normalizedParticipants.some((participant) => Number.isNaN(participant.age))) {
      setError('Informe a idade de cada pessoa.');
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
          groupName: groupName.trim() || undefined,
          phone: phone.trim(),
          attendance,
          participants: normalizedParticipants,
          message: message.trim() || undefined,
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
        <div className="grid gap-4 md:grid-cols-3">
          <label className="grid gap-2 text-sm font-semibold text-[#8b5f6b]">
            <span>Família / grupo (opcional)</span>
            <input
              className="rounded-2xl border border-[#f1c4d0] bg-white px-4 py-3 outline-none transition focus:border-[#df7894] focus:ring-4 focus:ring-pink-100"
              onChange={(event) => setGroupName(event.target.value)}
              placeholder="Ex.: Família Souza"
              value={groupName}
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
              <p className="text-sm font-black uppercase tracking-[.2em] text-[#d36f8a]">Pessoas do grupo</p>
              <p className="mt-1 text-sm text-[#806562]">Adicione nome, tipo e idade de cada participante.</p>
            </div>
            <button
              className="rounded-full bg-[#f7dce4] px-4 py-2 text-sm font-bold text-[#a14f67] transition hover:brightness-95"
              type="button"
              onClick={addParticipant}
            >
              Adicionar pessoa
            </button>
          </div>

          <div className="space-y-4">
            {participants.map((participant, index) => (
              <div key={participant.id} className="grid gap-3 rounded-[1.1rem] border border-[#f3d6de] bg-white p-4 md:grid-cols-[1.3fr_.8fr_.6fr_auto] md:items-end">
                <label className="grid gap-2 text-sm font-semibold text-[#8b5f6b]">
                  <span>Nome da pessoa {index + 1}</span>
                  <input
                    className="rounded-2xl border border-[#f1c4d0] bg-white px-4 py-3 outline-none transition focus:border-[#df7894] focus:ring-4 focus:ring-pink-100"
                    onChange={(event) => updateParticipant(participant.id, 'name', event.target.value)}
                    placeholder={`Pessoa ${index + 1}`}
                    value={participant.name}
                  />
                </label>

                <label className="grid gap-2 text-sm font-semibold text-[#8b5f6b]">
                  <span>Tipo</span>
                  <select
                    className="rounded-2xl border border-[#f1c4d0] bg-white px-4 py-3 outline-none transition focus:border-[#df7894] focus:ring-4 focus:ring-pink-100"
                    onChange={(event) => updateParticipant(participant.id, 'type', event.target.value)}
                    value={participant.type}
                  >
                    <option value="adulto">Adulto</option>
                    <option value="crianca">Criança</option>
                  </select>
                </label>

                <label className="grid gap-2 text-sm font-semibold text-[#8b5f6b]">
                  <span>Idade</span>
                  <input
                    className="rounded-2xl border border-[#f1c4d0] bg-white px-4 py-3 outline-none transition focus:border-[#df7894] focus:ring-4 focus:ring-pink-100"
                    min="0"
                    onChange={(event) => updateParticipant(participant.id, 'age', event.target.value)}
                    placeholder="0"
                    type="number"
                    value={participant.age}
                  />
                </label>

                <button
                  className="rounded-full border border-[#f1c4d0] px-4 py-3 text-sm font-bold text-[#a14f67] transition hover:bg-[#fff4f7] disabled:cursor-not-allowed disabled:opacity-60"
                  disabled={participants.length === 1}
                  type="button"
                  onClick={() => removeParticipant(participant.id)}
                >
                  Remover
                </button>
              </div>
            ))}
          </div>
        </div>

        <label className="grid gap-2 text-sm font-semibold text-[#8b5f6b]">
          <span>Observação</span>
          <textarea
            className="min-h-28 rounded-2xl border border-[#f1c4d0] bg-white px-4 py-3 outline-none transition focus:border-[#df7894] focus:ring-4 focus:ring-pink-100"
            onChange={(event) => setMessage(event.target.value)}
            placeholder="Ex.: chegarão um pouco depois"
            value={message}
          />
        </label>

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
