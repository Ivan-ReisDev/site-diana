"use client";

import { FormEvent, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Baby,
  Calendar,
  CheckCircle2,
  Gift,
  Heart,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Castle,
  Ribbon,
  User,
  Users,
} from "lucide-react";

type RsvpSummary = {
  name: string;
  attendance: string;
  adults: string;
  children: string;
};

type Recado = {
  nome: string;
  mensagem: string;
  data: string;
};

type GiftItem = {
  id: number;
  nome: string;
  imagem: string;
  preco: string;
  reservado: boolean;
  reservadoPor: string;
};

const giftItems: GiftItem[] = [
  { id: 1, nome: "Urso de Pelúcia", imagem: "https://images.pexels.com/photos/113559/pexels-photo-113559.jpeg?auto=compress&cs=tinysrgb&w=400", preco: "R$ 89,90", reservado: false, reservadoPor: "" },
  { id: 2, nome: "Blocos de Montar", imagem: "https://images.pexels.com/photos/4491703/pexels-photo-4491703.jpeg?auto=compress&cs=tinysrgb&w=400", preco: "R$ 59,90", reservado: false, reservadoPor: "" },
  { id: 3, nome: "Carrinho", imagem: "https://images.pexels.com/photos/6132059/pexels-photo-6132059.jpeg?auto=compress&cs=tinysrgb&w=400", preco: "R$ 49,90", reservado: false, reservadoPor: "" },
  { id: 4, nome: "Boneca", imagem: "https://images.pexels.com/photos/20020284/pexels-photo-20020284.jpeg?auto=compress&cs=tinysrgb&w=400", preco: "R$ 79,90", reservado: false, reservadoPor: "" },
  { id: 5, nome: "Quebra-Cabeça", imagem: "https://images.pexels.com/photos/6255656/pexels-photo-6255656.jpeg?auto=compress&cs=tinysrgb&w=400", preco: "R$ 39,90", reservado: false, reservadoPor: "" },
  { id: 6, nome: "Bola", imagem: "https://images.pexels.com/photos/209861/pexels-photo-209861.jpeg?auto=compress&cs=tinysrgb&w=400", preco: "R$ 29,90", reservado: false, reservadoPor: "" },
  { id: 7, nome: "Kit Pintura", imagem: "https://images.pexels.com/photos/13755613/pexels-photo-13755613.jpeg?auto=compress&cs=tinysrgb&w=400", preco: "R$ 69,90", reservado: false, reservadoPor: "" },
  { id: 8, nome: "Livro Infantil", imagem: "https://images.pexels.com/photos/4887203/pexels-photo-4887203.jpeg?auto=compress&cs=tinysrgb&w=400", preco: "R$ 44,90", reservado: false, reservadoPor: "" },
  { id: 9, nome: "Jogo de Panelinhas", imagem: "https://images.pexels.com/photos/4484893/pexels-photo-4484893.jpeg?auto=compress&cs=tinysrgb&w=400", preco: "R$ 54,90", reservado: false, reservadoPor: "" },
  { id: 10, nome: "Cavalo de Balanço", imagem: "https://images.pexels.com/photos/712857/pexels-photo-712857.jpeg?auto=compress&cs=tinysrgb&w=400", preco: "R$ 99,90", reservado: false, reservadoPor: "" },
  { id: 11, nome: "Massinha de Modelar", imagem: "https://images.pexels.com/photos/4487869/pexels-photo-4487869.jpeg?auto=compress&cs=tinysrgb&w=400", preco: "R$ 34,90", reservado: false, reservadoPor: "" },
  { id: 12, nome: "Fantasia de Princesa", imagem: "https://images.pexels.com/photos/19230196/pexels-photo-19230196.jpeg?auto=compress&cs=tinysrgb&w=400", preco: "R$ 89,90", reservado: false, reservadoPor: "" },
];

const eventDetails = [
  { label: "Data", value: "11 de outubro" },
  { label: "Horário", value: "13 horas" },
  { label: "Local", value: "Casa de Festas Turma da Kali" },
  { label: "Endereço", value: "Est. Padre Roser, 765 — Vila da Penha" },
];

const timeline = [
  ["13h", "Recepção dos convidados e fotos no castelinho"],
  ["14h", "Brincadeiras e momento especial da Diana"],
  ["15h", "Parabéns real da princesa"],
  ["Até 20/09", "Confirme sua presença para prepararmos tudo com carinho"],
];

const giftAmounts = ["R$ 50", "R$ 100", "R$ 150", "R$ 250"];
const princessInspiration = [
  { name: "Rosas", tone: "Flores delicadas", icon: "🌹", colors: "from-[#ffd6e1] to-[#fff0f4]" },
  { name: "Castelo", tone: "Festa real", icon: "🏰", colors: "from-[#ffe1ea] to-[#fff1d4]" },
  { name: "Sapatinho", tone: "Toque de princesa", icon: "👠", colors: "from-[#fff0f4] to-[#ffe1ea]" },
];
const pixKey = "pix-da-familia@exemplo.com";

export default function InvitationSite() {
  const [copied, setCopied] = useState(false);
  const [summary, setSummary] = useState<RsvpSummary | null>(null);
  const [error, setError] = useState("");
  const [recados, setRecados] = useState<Recado[]>([]);
  const [recadoNome, setRecadoNome] = useState("");
  const [recadoMsg, setRecadoMsg] = useState("");
  const [recadoEnviado, setRecadoEnviado] = useState(false);
  const [gifts, setGifts] = useState<GiftItem[]>(giftItems);
  const [giftNome, setGiftNome] = useState("");
  const [giftId, setGiftId] = useState(0);
  const [showGiftForm, setShowGiftForm] = useState(false);

  const guestsLabel = useMemo(() => {
    if (!summary) return "";
    const adults = Number(summary.adults || 0);
    const children = Number(summary.children || 0);
    return `${adults} adulto${adults === 1 ? "" : "s"} • ${children} criança${
      children === 1 ? "" : "s"
    }`;
  }, [summary]);

  function handleRsvp(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const name = String(data.get("name") || "").trim();
    const phone = String(data.get("phone") || "").trim();

    if (!name || !phone) {
      setError("Preencha seu nome e telefone para confirmar com carinho.");
      return;
    }

    setError("");
    setSummary({
      name,
      attendance: String(data.get("attendance") || "sim"),
      adults: String(data.get("adults") || "1"),
      children: String(data.get("children") || "0"),
    });
  }

  async function copyPix() {
    try {
      await navigator.clipboard?.writeText(pixKey);
    } catch {
      // Fallback visual; em navegadores sem clipboard ainda mostramos a chave.
    }
    setCopied(true);
  }

  function enviarRecado() {
    if (!recadoNome.trim() || !recadoMsg.trim()) return;
    const novo: Recado = {
      nome: recadoNome.trim(),
      mensagem: recadoMsg.trim(),
      data: new Date().toLocaleDateString("pt-BR"),
    };
    setRecados((prev) => [novo, ...prev]);
    setRecadoNome("");
    setRecadoMsg("");
    setRecadoEnviado(true);
    setTimeout(() => setRecadoEnviado(false), 3000);
  }

  function abrirReserva(item: GiftItem) {
    setGiftId(item.id);
    setGiftNome("");
    setShowGiftForm(true);
  }

  function confirmarReserva() {
    if (!giftNome.trim()) return;
    setGifts((prev) =>
      prev.map((g) =>
        g.id === giftId ? { ...g, reservado: true, reservadoPor: giftNome.trim() } : g
      )
    );
    setShowGiftForm(false);
  }

  return (
    <main className="min-h-screen overflow-hidden bg-[#fff8f6] text-[#745b58] floral-wash">
      <section className="relative isolate px-5 pb-20 pt-6 sm:px-8 lg:px-12">
        <div className="absolute inset-0 -z-20 bg-[radial-gradient(circle_at_15%_12%,rgba(244,190,206,.42),transparent_30%),radial-gradient(circle_at_86%_8%,rgba(255,224,232,.55),transparent_24%),radial-gradient(circle_at_70%_78%,rgba(255,231,178,.26),transparent_24%),linear-gradient(135deg,#fffdf9_0%,#fff1f5_48%,#fffaf7_100%)]" />
        <div className="absolute left-8 top-28 -z-10 h-44 w-44 rounded-full bg-pink-200/60 blur-3xl" />
        <div className="absolute bottom-10 right-12 -z-10 h-64 w-64 rounded-full bg-amber-200/50 blur-3xl" />
        <div className="pointer-events-none absolute left-[7%] top-40 hidden animate-float-slow text-5xl text-[#d7ad55]/45 lg:block">✦</div>
        <div className="pointer-events-none absolute right-[12%] top-28 hidden animate-float-crown text-6xl text-[#d7ad55]/50 lg:block">♛</div>
        <div className="pointer-events-none absolute bottom-28 left-[42%] hidden animate-sparkle text-4xl text-[#f4b8c8]/45 lg:block">✨</div>

        <nav className="royal-glass mx-auto flex max-w-6xl items-center justify-between rounded-full px-5 py-3">
          <a className="font-serif text-lg font-semibold tracking-tight text-[#c15f78]" href="#topo">
            Diana
          </a>
          <div className="hidden gap-6 text-sm font-medium text-[#806562] md:flex">
            <a href="#evento">Evento</a>
            <a href="#mural">Mural</a>
            <a href="#rsvp">Presença</a>
            <a href="#gifts">Presentes</a>
          </div>
          <a
            className="royal-button rounded-full px-4 py-2 text-sm font-semibold text-white"
            href="#rsvp"
          >
            Confirmar
          </a>
        </nav>

        <div id="topo" className="mx-auto grid max-w-6xl items-center gap-10 py-16 lg:grid-cols-[1.04fr_.96fr] lg:py-20">
          <motion.div
            className="animate-fade-up"
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <h1 className="max-w-3xl font-serif text-5xl font-black leading-[.95] tracking-[-0.06em] text-[#b85f78] sm:text-7xl lg:text-8xl">
              Diana faz 1 ano
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-[#7e5f5b] sm:text-xl">
              Prepara-se: a festa real está prestes a começar! Um convite em aquarela, rosas e castelo para celebrar o primeiro aninho da Diana.
            </p>
          </motion.div>

          <motion.div
            className="relative animate-fade-up"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
          >
            <div className="overflow-hidden rounded-2xl bg-white p-1 shadow-[0_16px_48px_rgba(185,75,105,.16)]">
              <img
                src="/convite-real.jpg"
                alt="Convite real da Diana — Faz 1 ano"
                className="w-full h-auto block rounded-xl"
                loading="eager"
              />
            </div>
          </motion.div>
        </div>
      </section>

      <motion.div
        className="flex items-center justify-center py-6"
        aria-hidden="true"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex items-center gap-3 w-full max-w-xs mx-auto">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#d7ad55]/30 to-[#d7ad55]/60" />
          <span className="flex-shrink-0 text-2xl text-[#d7ad55]/70">♛</span>
          <div className="flex-1 h-px bg-gradient-to-r from-[#d7ad55]/60 via-[#d7ad55]/30 to-transparent" />
        </div>
      </motion.div>

      <motion.section
        id="evento"
        className="px-5 py-24 sm:px-8 lg:px-12"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      >
        <div className="mx-auto max-w-6xl">
          <div className="mb-10 text-center">
            <p className="font-semibold uppercase tracking-[.3em] text-[#d36f8a]">Informações</p>
            <h2 className="mt-3 font-serif text-4xl font-black text-[#b85f78] sm:text-5xl">Informações do convite real</h2>
          </div>
          <div className="mx-auto grid max-w-5xl gap-8 rounded-[2rem] bg-white/45 px-6 py-8 sm:grid-cols-2 lg:grid-cols-4">
            {eventDetails.map((item) => (
              <article key={item.label} className="border-l border-[#f0c7d3]/70 pl-5 first:border-l-0 first:pl-0 sm:first:border-l sm:first:pl-5 lg:first:border-l-0 lg:first:pl-0">
                <p className="text-[11px] font-black uppercase tracking-[.28em] text-[#d36f8a]">{item.label}</p>
                <p className="mt-3 text-lg font-extrabold leading-snug text-[#7d625f]">{item.value}</p>
              </article>
            ))}
          </div>
        </div>
      </motion.section>

      <motion.div
        className="flex items-center justify-center py-6"
        aria-hidden="true"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex items-center gap-3 w-full max-w-xs mx-auto">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#d7ad55]/30 to-[#d7ad55]/60" />
          <span className="flex-shrink-0 text-2xl text-[#d7ad55]/70">♛</span>
          <div className="flex-1 h-px bg-gradient-to-r from-[#d7ad55]/60 via-[#d7ad55]/30 to-transparent" />
        </div>
      </motion.div>

      <motion.section
        className="px-5 py-24 sm:px-8 lg:px-12"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      >
        <div className="mx-auto grid max-w-6xl gap-14 lg:grid-cols-[.9fr_1.1fr]">
          <div className="max-w-xl">
            <p className="font-semibold uppercase tracking-[.3em] text-[#d36f8a]">Nossa história</p>
            <h2 className="mt-4 font-serif text-4xl font-black text-[#b85f78] sm:text-5xl">A festa real está prestes a começar</h2>
            <p className="mt-6 text-lg leading-9 text-[#806966]">
              Com flores, castelo rosado e detalhes de princesa, vamos celebrar o primeiro ano da Diana ao lado de pessoas especiais.
            </p>
            <div className="mt-9 flex flex-wrap gap-4 text-sm font-black text-[#c15f78]">
              {['11 de outubro', '13 horas', 'Confirmar até 20/09'].map((item) => (
                <span key={item} className="rounded-full bg-[#fff0f5] px-5 py-3">
                  {item}
                </span>
              ))}
            </div>
          </div>

          <div className="space-y-8 border-l border-[#f0c7d3]/80 pl-7 sm:pl-10">
            {timeline.map(([time, text]) => (
              <article key={time} className="relative">
                <span className="absolute -left-[2.15rem] top-1 h-3 w-3 rounded-full bg-[#df7894] ring-8 ring-[#fff3f7] sm:-left-[2.65rem]" />
                <span className="text-sm font-black uppercase tracking-[.22em] text-[#d36f8a]">{time}</span>
                <p className="mt-2 max-w-xl text-xl font-extrabold leading-8 text-[#7d625f]">{text}</p>
              </article>
            ))}
          </div>
        </div>
      </motion.section>

      <motion.div
        className="flex items-center justify-center py-6"
        aria-hidden="true"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex items-center gap-3 w-full max-w-xs mx-auto">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#d7ad55]/30 to-[#d7ad55]/60" />
          <span className="flex-shrink-0 text-2xl text-[#d7ad55]/70">♛</span>
          <div className="flex-1 h-px bg-gradient-to-r from-[#d7ad55]/60 via-[#d7ad55]/30 to-transparent" />
        </div>
      </motion.div>

      <motion.section
        id="mural"
        className="px-5 py-24 sm:px-8 lg:px-12"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      >
        <div className="mx-auto max-w-5xl">
          <div className="mb-12 text-center">
            <p className="mb-3 font-serif text-5xl font-black leading-[.95] tracking-[-0.06em] text-[#b85f78] sm:text-6xl">
              Mural de Recados
            </p>
            <div className="mx-auto mb-5 h-1 w-24 rounded-full bg-gradient-to-r from-[#f3a4b4] via-[#df7894] to-[#d5a547]" />
            <p className="mx-auto max-w-2xl text-lg leading-8 text-[#7e5f5b]">
              Deixe uma mensagem carinhosa para a princesa Diana
            </p>
          </div>

          <div className="rounded-[2rem] bg-white/58 p-6 shadow-[0_10px_30px_rgba(201,111,135,.06)] sm:p-8">
            <div className="mb-6 grid gap-4 sm:flex">
              <input
                value={recadoNome}
                onChange={(e) => setRecadoNome(e.target.value)}
                placeholder="Seu nome"
                className="rounded-xl border border-[#f1c4d0] bg-[#fffafa] px-4 py-3 outline-none transition focus:border-[#df7894] focus:ring-4 focus:ring-pink-200 sm:flex-1"
              />
              <button
                onClick={enviarRecado}
                className="royal-button rounded-full px-6 py-3 font-bold text-white whitespace-nowrap"
              >
                Enviar recado 💬
              </button>
            </div>
            <textarea
              value={recadoMsg}
              onChange={(e) => setRecadoMsg(e.target.value)}
              placeholder="Escreva sua mensagem para a Diana..."
              rows={3}
              className="w-full rounded-xl border border-[#f1c4d0] bg-[#fffafa] px-4 py-3 outline-none transition focus:border-[#df7894] focus:ring-4 focus:ring-pink-200"
            />
            {recadoEnviado && (
              <p className="mt-4 rounded-2xl bg-emerald-50 px-4 py-3 text-center text-sm font-bold text-emerald-700">
                Recado enviado com carinho 💝
              </p>
            )}
          </div>

          {recados.length > 0 && (
            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {recados.map((r, i) => (
                <div
                  key={i}
                  className="animate-rise rounded-[1.5rem] bg-white/72 p-5 shadow-[0_6px_18px_rgba(201,111,135,.06)]"
                  style={{ animationDelay: `${i * 80}ms` }}
                >
                  <p className="text-sm font-black text-[#d36f8a]">{r.nome}</p>
                  <p className="mt-2 leading-7 text-[#7d625f]">{r.mensagem}</p>
                  <p className="mt-3 text-xs font-semibold text-[#b78b8c]">📅 {r.data}</p>
                </div>
              ))}
            </div>
          )}

          {recados.length === 0 && (
            <div className="mt-10 text-center text-lg text-[#b78b8c]">
              💭 Seja o primeiro a deixar um recado carinhoso!
            </div>
          )}
        </div>
      </motion.section>

      <motion.section
        id="rsvp"
        className="relative px-5 py-28 sm:px-8 lg:px-12"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      >
        <div className="mx-auto max-w-6xl">
          <div className="mb-14 text-center">
            <p className="font-semibold uppercase tracking-[.3em] text-[#d36f8a]">RSVP</p>
            <p className="mb-3 mt-3 font-serif text-4xl font-black leading-[.95] tracking-[-0.06em] text-[#b85f78] sm:text-6xl">
              Confirme sua Presença
            </p>
            <div className="mx-auto mb-5 h-1 w-24 rounded-full bg-gradient-to-r from-[#f3a4b4] via-[#df7894] to-[#d5a547]" />
            <p className="mx-auto max-w-2xl text-xl leading-9 text-[#7e5f5b] sm:text-2xl">
              Sua presença é o maior presente! Responda até 20 de setembro.
            </p>
          </div>

          <div className="mx-auto grid max-w-4xl gap-10 lg:grid-cols-[1fr_1.2fr]">
            <div className="rounded-[2rem] bg-gradient-to-br from-[#fce4eb] to-[#fff1f4] p-8 text-[#7d625f] shadow-[0_10px_30px_rgba(201,111,135,.08)]">
              <div className="mb-4 grid h-12 w-12 place-items-center rounded-2xl bg-white/70 text-[#df7894]">
                <Mail className="h-6 w-6" strokeWidth={2} />
              </div>
              <p className="font-serif text-2xl font-bold leading-8 text-[#b85f78]">
              Para prepararmos cada detalhe da festa real com carinho, confirme sua presença.
              </p>
              {summary && (
                <div className="mt-8 rounded-[1.8rem] bg-white/72 p-5 ring-1 ring-[#f0c7d3]/50">
                  <p className="text-xs font-black uppercase tracking-[.24em] text-[#d36f8a]">Presença registrada</p>
                  <p className="mt-2 text-2xl font-black text-[#b85f78]">{summary.name}</p>
                  <p className="mt-1 text-[#806966]">{summary.attendance === 'sim' ? 'Vai celebrar com a gente' : 'Não poderá comparecer'} • {guestsLabel}</p>
                </div>
              )}
              <div className="mt-8 space-y-3 text-sm leading-7 text-[#806966]">
                <p className="flex items-center gap-2.5">
                  <Calendar className="h-4 w-4 shrink-0 text-[#d36f8a]" strokeWidth={2} />
                  <span><strong>11 de outubro</strong> — 13h</span>
                </p>
                <p className="flex items-center gap-2.5">
                  <MapPin className="h-4 w-4 shrink-0 text-[#d36f8a]" strokeWidth={2} />
                  <span>Est. Padre Roser, 765 — Vila da Penha</span>
                </p>
                <p className="flex items-center gap-2.5">
                  <Castle className="h-4 w-4 shrink-0 text-[#d36f8a]" strokeWidth={2} />
                  <span>Casa de Festas Turma da Kali</span>
                </p>
              </div>
            </div>

            <form onSubmit={handleRsvp} className="rounded-[2rem] bg-white/68 p-7 shadow-[0_10px_30px_rgba(201,111,135,.06)] sm:p-8">
              <div className="grid gap-5 sm:grid-cols-2">
                <label className="grid gap-2 text-sm font-bold text-[#9d5f70] sm:col-span-2">
                  <span className="flex items-center gap-2"><User className="h-4 w-4 text-[#d36f8a]" strokeWidth={2} /> Seu nome</span>
                  <input name="name" className="rounded-xl border border-[#f1c4d0]/40 bg-[#fffafa] px-4 py-3.5 outline-none transition focus:border-[#df7894] focus:ring-4 focus:ring-pink-100" placeholder="Digite seu nome" />
                </label>
                <label className="grid gap-2 text-sm font-bold text-[#9d5f70] sm:col-span-2">
                  <span className="flex items-center gap-2"><Phone className="h-4 w-4 text-[#d36f8a]" strokeWidth={2} /> Telefone</span>
                  <input name="phone" className="rounded-xl border border-[#f1c4d0]/40 bg-[#fffafa] px-4 py-3.5 outline-none transition focus:border-[#df7894] focus:ring-4 focus:ring-pink-100" placeholder="(21) 99999-9999" />
                </label>
                <label className="grid gap-2 text-sm font-bold text-[#9d5f70]">
                  <span className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-[#d36f8a]" strokeWidth={2} /> Presença</span>
                  <select name="attendance" className="rounded-xl border border-[#f1c4d0]/40 bg-[#fffafa] px-4 py-3.5 outline-none transition focus:border-[#df7894] focus:ring-4 focus:ring-pink-100">
                    <option value="sim">Sim, estaremos lá</option>
                    <option value="nao">Não poderei ir</option>
                  </select>
                </label>
                <label className="grid gap-2 text-sm font-bold text-[#9d5f70]">
                  <span className="flex items-center gap-2"><Users className="h-4 w-4 text-[#d36f8a]" strokeWidth={2} /> Adultos</span>
                  <input name="adults" type="number" min="0" defaultValue="1" className="rounded-xl border border-[#f1c4d0]/40 bg-[#fffafa] px-4 py-3.5 outline-none transition focus:border-[#df7894] focus:ring-4 focus:ring-pink-100" />
                </label>
                <label className="grid gap-2 text-sm font-bold text-[#9d5f70]">
                  <span className="flex items-center gap-2"><Baby className="h-4 w-4 text-[#d36f8a]" strokeWidth={2} /> Crianças</span>
                  <input name="children" type="number" min="0" defaultValue="0" className="rounded-xl border border-[#f1c4d0]/40 bg-[#fffafa] px-4 py-3.5 outline-none transition focus:border-[#df7894] focus:ring-4 focus:ring-pink-100" />
                </label>
                <label className="grid gap-2 text-sm font-bold text-[#9d5f70] sm:col-span-2">
                  <span className="flex items-center gap-2"><MessageCircle className="h-4 w-4 text-[#d36f8a]" strokeWidth={2} /> Mensagem</span>
                  <input name="message" className="rounded-xl border border-[#f1c4d0]/40 bg-[#fffafa] px-4 py-3.5 outline-none transition focus:border-[#df7894] focus:ring-4 focus:ring-pink-100" placeholder="Deixe um recadinho carinhoso" />
                </label>
              </div>
              {error && <p className="mt-4 rounded-2xl bg-red-50 px-4 py-3 text-sm font-bold text-red-700">{error}</p>}
              <button className="mt-6 w-full royal-button rounded-full px-7 py-4 text-lg font-black text-white shadow-[0_8px_24px_rgba(223,120,148,.24)] transition-all hover:scale-[1.02]" type="submit">
                <span className="flex items-center justify-center gap-2">
                  Confirmar presença <Heart className="h-5 w-5" strokeWidth={2.25} fill="currentColor" />
                </span>
              </button>
            </form>
          </div>
        </div>
      </motion.section>

      <motion.div
        className="flex items-center justify-center py-6"
        aria-hidden="true"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex items-center gap-3 w-full max-w-xs mx-auto">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#d7ad55]/30 to-[#d7ad55]/60" />
          <span className="flex-shrink-0 text-2xl text-[#d7ad55]/70">♛</span>
          <div className="flex-1 h-px bg-gradient-to-r from-[#d7ad55]/60 via-[#d7ad55]/30 to-transparent" />
        </div>
      </motion.div>

      <motion.section
        id="gifts"
        className="px-5 pb-32 pt-24 sm:px-8 lg:px-12"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      >
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 text-center">
            <p className="mb-3 font-serif text-5xl font-black leading-[.95] tracking-[-0.06em] text-[#b85f78] sm:text-6xl">
              Lista de Presentes
            </p>
            <div className="mx-auto mb-5 h-1 w-24 rounded-full bg-gradient-to-r from-[#f3a4b4] via-[#df7894] to-[#d5a547]" />
            <p className="mx-auto max-w-2xl text-lg leading-8 text-[#7e5f5b]">
              Escolha um presente para a princesa Diana e reserve com carinho
            </p>
          </div>

          {/* Modal de reserva */}
          {showGiftForm && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-5 backdrop-blur-sm">
              <div className="w-full max-w-sm rounded-[2rem] bg-white p-8 shadow-2xl">
                <p className="font-serif text-2xl font-black text-[#b85f78]">Reservar presente</p>
                <p className="mt-2 text-sm text-[#806966]">
                  Digite seu nome para reservar este presente
                </p>
                <input
                  value={giftNome}
                  onChange={(e) => setGiftNome(e.target.value)}
                  placeholder="Seu nome"
                  className="mt-5 w-full rounded-xl border border-[#f1c4d0] bg-[#fffafa] px-4 py-3 outline-none transition focus:border-[#df7894] focus:ring-4 focus:ring-pink-200"
                  autoFocus
                />
                <div className="mt-5 flex gap-3">
                  <button
                    onClick={() => setShowGiftForm(false)}
                    className="flex-1 rounded-full border border-[#f1c4d0] px-4 py-3 font-bold text-[#806966] transition hover:bg-[#fff5f8]"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={confirmarReserva}
                    className="royal-button flex flex-1 items-center justify-center gap-2 rounded-full px-4 py-3 font-bold text-white"
                  >
                    <Gift className="h-4 w-4" strokeWidth={2.25} /> Confirmar
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {gifts.map((item) => (
              <div
                key={item.id}
                className={`group animate-rise overflow-hidden rounded-[1.5rem] text-center shadow-[0_6px_18px_rgba(201,111,135,.06)] transition-all ${
                  item.reservado
                    ? "bg-[#fff5f8]/50 opacity-70"
                    : "bg-white/72 hover:shadow-[0_8px_24px_rgba(201,111,135,.12)] hover:-translate-y-1"
                }`}
                style={{ animationDelay: `${item.id * 60}ms` }}
              >
                <div className="relative aspect-square w-full overflow-hidden bg-[#fff5f8]">
                  <img
                    src={item.imagem}
                    alt={item.nome}
                    className={`h-full w-full object-cover transition-transform duration-500 ${
                      item.reservado ? "" : "group-hover:scale-105"
                    }`}
                    loading="lazy"
                  />
                  {item.reservado && (
                    <span className="absolute right-2 top-2 inline-flex items-center gap-1 rounded-full bg-white/90 px-3 py-1 text-xs font-black uppercase tracking-[.08em] text-[#b85f78] shadow-sm">
                      <Ribbon className="h-3.5 w-3.5" strokeWidth={2.25} /> Reservado
                    </span>
                  )}
                </div>
                <div className="p-5">
                  <h3 className="text-base font-black text-[#b85f78]">{item.nome}</h3>
                  <p className="mt-1 font-serif text-xl font-bold text-[#d5a547]">{item.preco}</p>

                  {item.reservado ? (
                    <p className="mt-4 text-xs text-[#b78b8c]">Reservado por {item.reservadoPor}</p>
                  ) : (
                    <button
                      onClick={() => abrirReserva(item)}
                      className="mt-4 flex w-full items-center justify-center gap-2 rounded-full border-2 border-[#df7894]/30 px-4 py-2.5 text-sm font-bold text-[#df7894] transition hover:bg-[#df7894] hover:text-white"
                    >
                      <Gift className="h-4 w-4" strokeWidth={2.25} /> Dar este presente
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Pix também */}
          <div className="mx-auto mt-16 max-w-2xl rounded-[2rem] bg-gradient-to-br from-[#fce4eb] to-[#fff1f4] p-8 text-center shadow-[0_10px_30px_rgba(201,111,135,.08)]">
            <p className="mb-2 text-3xl">💝</p>
            <p className="font-serif text-2xl font-black text-[#b85f78]">
              Prefere contribuir via Pix?
            </p>
            <p className="mx-auto mt-3 max-w-lg text-base leading-7 text-[#806966]">
              Se preferir, você pode contribuir com qualquer valor. Todo carinho é bem-vindo!
            </p>
            <div className="mt-6 rounded-[1.8rem] bg-white/72 p-5">
              <p className="text-xs font-black uppercase tracking-[.24em] text-[#d36f8a]">Chave Pix</p>
              <p className="mt-2 font-mono text-lg font-black text-[#9d5f70]">{pixKey}</p>
            </div>
            <div className="mt-5 flex flex-wrap justify-center gap-3">
              {giftAmounts.map((amount) => (
                <span
                  key={amount}
                  className="rounded-full bg-white/80 px-5 py-3 text-lg font-black text-[#c15f78] shadow-sm"
                >
                  {amount}
                </span>
              ))}
            </div>
            <button
              onClick={copyPix}
              className="mt-6 royal-button rounded-full px-8 py-4 font-bold text-white"
            >
              Copiar chave Pix
            </button>
            {copied && (
              <p className="mt-4 rounded-2xl bg-emerald-50 px-4 py-3 text-center text-sm font-bold text-emerald-700">
                Chave Pix copiada 💝
              </p>
            )}
          </div>
        </div>
      </motion.section>

      {/* — Flores decorativas — */}
      <motion.div
        className="flower-divider"
        aria-hidden="true"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <span className="flower-divider-line" />
        <span className="flower-cluster animate-sway-delayed">🌸🌹🌺🌷🌸</span>
        <span className="flower-divider-line" />
      </motion.div>

      <motion.footer
        className="relative border-t border-[#f5e2e7] bg-white/60 px-5 py-8 text-center text-sm font-semibold text-[#c15f78]"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <div className="absolute left-4 top-4 flower-scatter animate-sway" aria-hidden="true">🌹</div>
        <div className="absolute right-4 top-4 flower-scatter animate-sway-delayed" aria-hidden="true">🌸</div>
        Feito com carinho para celebrar o primeiro aninho da princesa Diana.
      </motion.footer>
    </main>
  );
}
