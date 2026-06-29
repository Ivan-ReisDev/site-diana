"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion, type Variants } from "framer-motion";
import {
  Calendar,
  Mail,
  MapPin,
  Castle,
  Plus,
  Trash2,
} from "lucide-react";
import { BackgroundMusic } from "@/components/invitation/BackgroundMusic";
import { IntroOverlay } from "@/components/invitation/IntroOverlay";
import { LocationMap } from "@/components/invitation/LocationMap";
import { PhotoGalleryCarousel, galleryPhotos } from "@/components/invitation/PhotoGalleryCarousel";
import { GiftSuggestions } from "@/components/invitation/GiftSuggestions";
import { maskPhone } from "@/lib/masks/phone";
import { recadoInputSchema } from "@/lib/recados/schema";
import { rsvpInputSchema } from "@/lib/rsvp/schema";
import { toFieldErrors } from "@/lib/validation/fieldErrors";

type RsvpAdult = {
  name: string;
};

type RsvpChild = {
  name: string;
  age: number;
};

type RsvpSummary = {
  name: string;
  attendance: string;
  adults: number;
  children: number;
  adultsList: RsvpAdult[];
  childrenList: RsvpChild[];
};

type AdultForm = {
  id: number;
  name: string;
};

type ChildForm = {
  id: number;
  name: string;
  age: string;
};

type Recado = {
  id: string;
  nome: string;
  mensagem: string;
  createdAt: string;
};

const eventDetails = [
  { label: "Data", value: "11 de outubro" },
  { label: "Horário", value: "13 horas" },
  { label: "Local", value: "Casa de Festas Turma da Kali" },
  { label: "Endereço", value: "Est. Padre Roser, 765 - Vila da Penha" },
];

const venue = {
  name: "Casa de Festas Turma da Kali",
  address: "Est. Padre Roser, 765 - Vila da Penha, Rio de Janeiro",
};


const giftAmounts = ["R$ 50", "R$ 100", "R$ 150", "R$ 250"];
const pixKey = "(21) 96996-2029";

// Reveal em cascata conforme o scroll: a seção é o "container" que escalona
// a entrada dos filhos (itemReveal). Filhos com `variants={itemReveal}` herdam
// automaticamente o estado do container — não precisam de initial/whileInView.
const sectionReveal: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.14, delayChildren: 0.08 },
  },
};

const itemReveal: Variants = {
  hidden: { opacity: 0, y: 32 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

function formatRecadoDate(value: string) {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return "";
  return parsed.toLocaleDateString("pt-BR");
}

function createEmptyAdult(id: number): AdultForm {
  return {
    id,
    name: "",
  };
}

function createEmptyChild(id: number): ChildForm {
  return {
    id,
    name: "",
    age: "",
  };
}

export default function InvitationSite() {
  const [introDone, setIntroDone] = useState(false);
  const [copied, setCopied] = useState(false);
  const [summary, setSummary] = useState<RsvpSummary | null>(null);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [attendance, setAttendance] = useState<"sim" | "nao">("sim");
  const [adults, setAdults] = useState<AdultForm[]>([createEmptyAdult(1)]);
  const [nextAdultId, setNextAdultId] = useState(2);
  const [children, setChildren] = useState<ChildForm[]>([]);
  const [nextChildId, setNextChildId] = useState(1);
  const [recados, setRecados] = useState<Recado[]>([]);
  const [recadosLoading, setRecadosLoading] = useState(true);
  const [recadosError, setRecadosError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [recadoNome, setRecadoNome] = useState("");
  const [recadoMsg, setRecadoMsg] = useState("");
  const [enviandoRecado, setEnviandoRecado] = useState(false);
  const [recadoError, setRecadoError] = useState("");
  const [recadoFieldErrors, setRecadoFieldErrors] = useState<Record<string, string>>({});
  const [recadoEnviado, setRecadoEnviado] = useState(false);

  useEffect(() => {
    if (!introDone) return;
    let cancelled = false;

    async function loadRecados() {
      setRecadosLoading(true);
      setRecadosError("");

      try {
        const response = await fetch("/api/recados", { method: "GET" });
        const body = await response.json();

        if (cancelled) return;

        if (!response.ok || !body.ok || !Array.isArray(body.recados)) {
          setRecadosError(body.message || "Não foi possível carregar os recados agora.");
          return;
        }

        setRecados(body.recados);
      } catch {
        if (!cancelled) {
          setRecadosError("Não foi possível carregar os recados agora.");
        }
      } finally {
        if (!cancelled) setRecadosLoading(false);
      }
    }

    loadRecados();

    return () => {
      cancelled = true;
    };
  }, [introDone]);

  const guestsLabel = useMemo(() => {
    if (!summary) return "";
    const adults = Number(summary.adults || 0);
    const children = Number(summary.children || 0);
    return `${adults} adulto${adults === 1 ? "" : "s"} • ${children} criança${children === 1 ? "" : "s"}`;
  }, [summary]);

  const childrenNamesLabel = useMemo(() => {
    if (!summary?.childrenList?.length) return "";
    return summary.childrenList.map((child) => child.name).join(", ");
  }, [summary]);

  function updateAdult(
    id: number,
    field: keyof Omit<AdultForm, "id">,
    value: string,
  ) {
    setAdults((current) =>
      current.map((adult) =>
        adult.id === id ? { ...adult, [field]: value } : adult,
      ),
    );
  }

  function addAdult() {
    setAdults((current) => [...current, createEmptyAdult(nextAdultId)]);
    setNextAdultId((current) => current + 1);
  }

  function removeAdult(id: number) {
    setAdults((current) =>
      current.length > 1 ? current.filter((adult) => adult.id !== id) : current,
    );
  }

  function updateChild(
    id: number,
    field: keyof Omit<ChildForm, "id">,
    value: string,
  ) {
    setChildren((current) =>
      current.map((child) =>
        child.id === id ? { ...child, [field]: value } : child,
      ),
    );
  }

  function addChild() {
    setChildren((current) => [...current, createEmptyChild(nextChildId)]);
    setNextChildId((current) => current + 1);
  }

  function removeChild(id: number) {
    setChildren((current) => current.filter((child) => child.id !== id));
  }

  async function handleRsvp(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const payload = {
      name: name.trim(),
      phone: phone.trim(),
      attendance,
      adults: adults.map((adult) => ({ name: adult.name.trim() })),
      children: children
        .map((child) => ({
          name: child.name.trim(),
          age: child.age === "" ? Number.NaN : Number(child.age),
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
          "Verifique os campos destacados.",
      );
      return;
    }

    setFieldErrors({});
    setError("");
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/rsvp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(parsed.data),
      });

      const body = await response.json();

      if (!response.ok || !body.ok) {
        setError(
          body.message || "Não foi possível registrar sua presença agora.",
        );
        return;
      }

      const adultsList = Array.isArray(body.rsvp?.adultsList)
        ? body.rsvp.adultsList
        : [];
      const childrenList = Array.isArray(body.rsvp?.childrenList)
        ? body.rsvp.childrenList
        : [];

      setSummary({
        name: body.rsvp.name,
        attendance: body.rsvp.attendance,
        adults: Number(body.rsvp.adults || 0),
        children: Number(body.rsvp.children || 0),
        adultsList,
        childrenList,
      });
      setName("");
      setPhone("");
      setAttendance("sim");
      setAdults([createEmptyAdult(1)]);
      setNextAdultId(2);
      setChildren([]);
      setNextChildId(1);
      setFieldErrors({});
    } catch {
      setError("Não foi possível registrar sua presença agora.");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function copyPix() {
    try {
      await navigator.clipboard?.writeText(pixKey);
    } catch {
      // Fallback visual; em navegadores sem clipboard ainda mostramos a chave.
    }
    setCopied(true);
  }

  async function enviarRecado() {
    setRecadoError("");

    const payload = {
      nome: recadoNome.trim(),
      mensagem: recadoMsg.trim(),
    };

    const parsed = recadoInputSchema.safeParse(payload);

    if (!parsed.success) {
      const errors = toFieldErrors(parsed.error);
      setRecadoFieldErrors(errors);
      setRecadoError(errors.nome || errors.mensagem || "Verifique os campos destacados.");
      return;
    }

    setRecadoFieldErrors({});
    setEnviandoRecado(true);

    try {
      const response = await fetch("/api/recados", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });

      const body = await response.json();

      if (response.status === 429 || (body && body.message && /muitos recados/i.test(body.message))) {
        setRecadoError(body.message || "Você enviou muitos recados em pouco tempo. Tente novamente em alguns minutos.");
        return;
      }

      if (!response.ok || !body.ok || !body.recado) {
        setRecadoError(body.message || "Não foi possível enviar seu recado agora.");
        return;
      }

      setRecados((prev) => [body.recado, ...prev]);
      setRecadoMsg("");
      setRecadoFieldErrors({});
      setRecadoEnviado(true);
      setTimeout(() => setRecadoEnviado(false), 3000);
    } catch {
      setRecadoError("Não foi possível enviar seu recado agora.");
    } finally {
      setEnviandoRecado(false);
    }
  }

  return (
    <main className="min-h-screen overflow-hidden bg-[#fff8f6] text-[#745b58] floral-wash">
      <AnimatePresence>
        {!introDone && (
          <IntroOverlay
            key="intro-overlay"
            onComplete={() => setIntroDone(true)}
          />
        )}
      </AnimatePresence>
      {introDone && <BackgroundMusic />}
      {/* O reveal das seções só deve começar DEPOIS que a intro sai. Como o
          IntroOverlay é apenas uma camada por cima, o conteúdo já está na
          viewport e o whileInView dispararia escondido atrás da intro. Trocar
          a key quando introDone vira true remonta o conteúdo e reinicia as
          animações no momento em que ficam de fato visíveis. */}
      <div key={introDone ? "revealed" : "pending"} className="contents">
      <section className="relative isolate flex flex-col px-5 pb-20 pt-6 sm:px-8 lg:min-h-screen lg:px-12">
        <div className="absolute inset-0 -z-20 bg-[radial-gradient(circle_at_15%_12%,rgba(244,190,206,.42),transparent_30%),radial-gradient(circle_at_86%_8%,rgba(255,224,232,.55),transparent_24%),radial-gradient(circle_at_70%_78%,rgba(255,231,178,.26),transparent_24%),linear-gradient(135deg,#fffdf9_0%,#fff1f5_48%,#fffaf7_100%)]" />
        <div className="absolute left-8 top-28 -z-10 h-44 w-44 rounded-full bg-pink-200/60 blur-3xl" />
        <div className="absolute bottom-10 right-12 -z-10 h-64 w-64 rounded-full bg-amber-200/50 blur-3xl" />
        {/* Enfeites em aquarela — sutis, atrás do conteúdo */}
        <img
          src="/castelo.png"
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute bottom-8 left-2 -z-10 hidden w-40 animate-float-slow opacity-[0.16] md:block lg:w-52"
        />
        <img
          src="/coroa.png"
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute right-[9%] top-24 -z-10 hidden w-24 animate-float-crown opacity-40 md:block lg:w-28"
        />
        <img
          src="/sapatinho.png"
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute left-[5%] top-44 -z-10 hidden w-24 animate-float-slow opacity-30 md:block lg:w-28"
        />

        <nav className="royal-glass mx-auto flex w-full max-w-6xl items-center justify-between rounded-full px-5 py-3">
          <a
            className="font-script text-3xl text-[#c15f78] sm:text-4xl"
            href="#topo"
          >
            Diana
          </a>
          <div className="hidden gap-6 text-sm font-medium text-[#806562] md:flex">
            <a href="#rsvp">Presença</a>
            <a href="#gifts">Presentes</a>
            <a href="#pix">Pix</a>
            <a href="#evento">Evento</a>
            <a href="#mural">Mural</a>
          </div>
          <a
            className="royal-button rounded-full px-4 py-2 text-sm font-normal text-white"
            href="#rsvp"
          >
            Confirmar
          </a>
        </nav>

        <div
          id="topo"
          className="mx-auto grid w-full max-w-6xl items-center gap-10 py-16 lg:flex-1 lg:content-center lg:grid-cols-[1.04fr_.96fr] lg:py-12"
        >
          <motion.div
            className="animate-fade-up"
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <h1 className="max-w-3xl font-script text-6xl leading-[1.1] text-[#b85f78] sm:text-7xl lg:text-8xl">
              Diana faz 1 ano
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-[#7e5f5b] sm:text-xl">
              Convocação Real... Mamãe e Papai tem a honra de convidar você para
              celebrar o 1 aniversário da nossa Princesa Diana
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
          <img
            src="/coroa.png"
            alt=""
            aria-hidden="true"
            className="flex-shrink-0 h-7 w-7 sm:h-8 sm:w-8 drop-shadow-[0_4px_10px_rgba(215,173,85,0.35)]"
          />
          <div className="flex-1 h-px bg-gradient-to-r from-[#d7ad55]/60 via-[#d7ad55]/30 to-transparent" />
        </div>
      </motion.div>

      <motion.section
        className="flex flex-col justify-center px-5 py-16 sm:px-8 lg:px-12"
        variants={sectionReveal}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-60px" }}
      >
        <div className="mx-auto w-full max-w-6xl">
          <motion.div className="mb-8 text-center" variants={itemReveal}>
            <p className="mb-3 text-sm font-semibold uppercase tracking-[.3em] text-[#d36f8a]">
              Jornada da Nossa Princesa
            </p>
            <h2 className="mb-3 font-script text-6xl leading-[1.1] text-[#b85f78] sm:text-7xl">
              Uma doce retrospectiva do primeiro aninho
            </h2>
          </motion.div>

          <motion.div className="mx-auto w-full max-w-2xl" variants={itemReveal}>
            <PhotoGalleryCarousel photos={galleryPhotos} />
          </motion.div>
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
          <img
            src="/coroa.png"
            alt=""
            aria-hidden="true"
            className="flex-shrink-0 h-7 w-7 sm:h-8 sm:w-8 drop-shadow-[0_4px_10px_rgba(215,173,85,0.35)]"
          />
          <div className="flex-1 h-px bg-gradient-to-r from-[#d7ad55]/60 via-[#d7ad55]/30 to-transparent" />
        </div>
      </motion.div>



      <motion.section
        id="rsvp"
        className="relative px-5 py-28 sm:px-8 lg:px-12"
        variants={sectionReveal}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-60px" }}
      >
        <div className="mx-auto max-w-6xl">
          <motion.div className="mb-14 text-center" variants={itemReveal}>
            <h2 className="mb-3 mt-3 font-script text-5xl leading-[1.1] text-[#b85f78] sm:text-6xl">
              Confirme sua Presença
            </h2>
            <p className="mx-auto max-w-2xl text-xl leading-9 text-[#7e5f5b] sm:text-2xl flex flex-col gap-1">
              Sua presença é o maior presente! <span> Responda até 20 de setembro.</span>
            </p>
          </motion.div>

          <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[0.9fr_1.4fr]">
            <motion.div
              variants={itemReveal}
              className="relative isolate overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#fce4eb] to-[#fff1f4] p-8 text-[#7d625f] shadow-[0_10px_30px_rgba(201,111,135,.08)]"
            >
              <img
                src="/flor-canto.png"
                alt=""
                aria-hidden="true"
                className="pointer-events-none absolute bottom-0 left-0 -z-10 w-24 rotate-180 select-none opacity-40 sm:w-72 sm:opacity-95"
              />
              <div className="mb-4 grid h-12 w-12 place-items-center rounded-2xl bg-white/70 text-[#df7894]">
                <Mail className="h-6 w-6" strokeWidth={2} />
              </div>
              <p className="font-script text-3xl leading-tight text-[#b85f78] sm:text-4xl">
                Para prepararmos cada detalhe da festa real com carinho,
                confirme sua presença.
              </p>
              {summary && (
                <div className="mt-8 rounded-[1.8rem] bg-white/72 p-5">
                  <p className="text-xs font-black uppercase tracking-[.24em] text-[#d36f8a]">
                    Presença registrada
                  </p>
                  <p className="mt-2 text-2xl font-black text-[#b85f78]">
                    {summary.name}
                  </p>
                  <p className="mt-1 text-[#806966]">
                    {summary.attendance === "sim"
                      ? "Vai celebrar com a gente"
                      : "Não poderá comparecer"}{" "}
                    • {guestsLabel}
                  </p>
                  {childrenNamesLabel && (
                    <p className="mt-2 text-sm text-[#806966]">
                      Crianças: {childrenNamesLabel}
                    </p>
                  )}
                </div>
              )}
              <div className="mt-8 space-y-3 text-sm leading-7 text-[#806966]">
                <p className="flex items-center gap-2.5">
                  <Calendar
                    className="h-4 w-4 shrink-0 text-[#d36f8a]"
                    strokeWidth={2}
                  />
                  <span>
                    <strong>11 de outubro</strong> - 13h
                  </span>
                </p>
                <p className="flex items-center gap-2.5">
                  <MapPin
                    className="h-4 w-4 shrink-0 text-[#d36f8a]"
                    strokeWidth={2}
                  />
                  <span>Est. Padre Roser, 765 - Vila da Penha</span>
                </p>
                <p className="flex items-center gap-2.5">
                  <Castle
                    className="h-4 w-4 shrink-0 text-[#d36f8a]"
                    strokeWidth={2}
                  />
                  <span>Casa de Festas Turma da Kali</span>
                </p>
              </div>
            </motion.div>

            <motion.form
              variants={itemReveal}
              onSubmit={handleRsvp}
              className="rounded-[2rem] bg-white/68 p-7 shadow-[0_10px_30px_rgba(201,111,135,.06)] sm:p-8"
            >
              <div className="grid gap-5 sm:grid-cols-2">
                <label className="grid gap-2 text-[11px] font-black uppercase tracking-[.22em] text-[#d36f8a]">
                  <span>Nome completo</span>
                  <input
                    value={name}
                    onChange={(event) => {
                      setName(event.target.value);
                      if (fieldErrors.name) setFieldErrors((cur) => ({ ...cur, name: "" }));
                    }}
                    className="w-full rounded-xl bg-[#ffe9f0] h-11 px-4 text-[15px] text-[#5b4a48] placeholder:text-[#cf93a7] placeholder:font-medium outline-none transition focus:ring-2 focus:ring-[#f3d3dd] aria-[invalid=true]:ring-2 aria-[invalid=true]:ring-red-400"
                    placeholder="Seu nome completo"
                    aria-invalid={fieldErrors.name ? true : undefined}
                  />
                  {fieldErrors.name && (
                    <span className="text-xs font-semibold text-red-600">{fieldErrors.name}</span>
                  )}
                </label>
                <label className="grid gap-2 text-[11px] font-black uppercase tracking-[.22em] text-[#d36f8a]">
                  <span>Telefone</span>
                  <input
                    value={phone}
                    onChange={(event) => {
                      setPhone(maskPhone(event.target.value));
                      if (fieldErrors.phone) setFieldErrors((cur) => ({ ...cur, phone: "" }));
                    }}
                    type="tel"
                    inputMode="tel"
                    maxLength={16}
                    className="w-full rounded-xl bg-[#ffe9f0] h-11 px-4 text-[15px] text-[#5b4a48] placeholder:text-[#cf93a7] placeholder:font-medium outline-none transition focus:ring-2 focus:ring-[#f3d3dd] aria-[invalid=true]:ring-2 aria-[invalid=true]:ring-red-400"
                    placeholder="(21) 99999-9999"
                    aria-invalid={fieldErrors.phone ? true : undefined}
                  />
                  {fieldErrors.phone && (
                    <span className="text-xs font-semibold text-red-600">{fieldErrors.phone}</span>
                  )}
                </label>
                <div className="sm:col-span-2">
                  <span className="text-[11px] font-black uppercase tracking-[.22em] text-[#d36f8a]">
                    Presença
                  </span>
                  <div className="mt-2 flex flex-wrap gap-6">
                    <label className="flex items-center gap-2 text-sm font-medium text-[#5b4a48]">
                      <input
                        type="radio"
                        name="attendance"
                        value="sim"
                        checked={attendance === "sim"}
                        onChange={() => setAttendance("sim")}
                        className="h-4 w-4 cursor-pointer accent-[#d8547a]"
                      />
                      Sim, estarei lá
                    </label>
                    <label className="flex items-center gap-2 text-sm font-medium text-[#5b4a48]">
                      <input
                        type="radio"
                        name="attendance"
                        value="nao"
                        checked={attendance === "nao"}
                        onChange={() => setAttendance("nao")}
                        className="h-4 w-4 cursor-pointer accent-[#d8547a]"
                      />
                      Não poderei ir
                    </label>
                  </div>
                </div>
                <div className="sm:col-span-2 rounded-2xl bg-white/40 p-5">
                  <div className="mb-4 flex items-center justify-between gap-4">
                    <div>
                      <p className="text-[11px] font-black uppercase tracking-[.22em] text-[#d36f8a]">
                        Adultos
                      </p>
                      <p className="mt-1 text-sm text-[#9d8786]">
                        Informe o nome completo de cada adulto.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={addAdult}
                      className="inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full bg-white/70 px-4 py-2.5 text-sm font-bold text-[#b85f78] transition hover:bg-[#fff3f7]"
                      aria-label="Adicionar adulto"
                    >
                      <Plus className="h-4 w-4" aria-hidden="true" />
                      Adicionar
                    </button>
                  </div>
                  <div className="space-y-4">
                    {adults.map((adult, index) => (
                      <div
                        key={adult.id}
                        className="flex flex-wrap items-end gap-3 rounded-xl bg-white/55 p-4"
                      >
                        <label className="grid flex-1 basis-[160px] gap-2 text-[11px] font-black uppercase tracking-[.22em] text-[#d36f8a]">
                          <span>Nome completo do adulto {index + 1}</span>
                          <input
                            value={adult.name}
                            onChange={(event) => {
                              updateAdult(adult.id, "name", event.target.value);
                              if (fieldErrors.adults) setFieldErrors((cur) => ({ ...cur, adults: "" }));
                            }}
                            className="w-full rounded-xl bg-[#ffe9f0] h-11 px-4 text-[15px] text-[#5b4a48] placeholder:text-[#cf93a7] placeholder:font-medium outline-none transition focus:ring-2 focus:ring-[#f3d3dd]"
                            placeholder={`Adulto ${index + 1}`}
                          />
                        </label>
                        <button
                          type="button"
                          onClick={() => removeAdult(adult.id)}
                          disabled={adults.length === 1}
                          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/70 text-[#c86f87] transition hover:bg-[#fff3f7] disabled:cursor-not-allowed disabled:opacity-40"
                          aria-label={`Remover adulto ${index + 1}`}
                        >
                          <Trash2 className="h-4 w-4" aria-hidden="true" />
                        </button>
                      </div>
                    ))}
                  </div>
                  {fieldErrors.adults && (
                    <p className="mt-3 text-xs font-semibold text-red-600">{fieldErrors.adults}</p>
                  )}
                </div>
                <div className="sm:col-span-2 rounded-2xl bg-white/40 p-5">
                  <div className="mb-4 flex items-center justify-between gap-4">
                    <div>
                      <p className="text-[11px] font-black uppercase tracking-[.22em] text-[#d36f8a]">
                        Crianças
                      </p>
                      <p className="mt-1 text-sm text-[#9d8786]">
                        Se houver crianças, informe o nome completo e a idade de
                        cada uma.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={addChild}
                      className="inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full bg-white/70 px-4 py-2.5 text-sm font-bold text-[#b85f78] transition hover:bg-[#fff3f7]"
                      aria-label="Adicionar criança"
                    >
                      <Plus className="h-4 w-4" aria-hidden="true" />
                      Adicionar
                    </button>
                  </div>
                  {children.length === 0 ? (
                    <p className="text-sm text-[#9d8786]">
                      Nenhuma criança adicionada.
                    </p>
                  ) : (
                    <div className="space-y-4">
                      {children.map((child, index) => (
                        <div
                          key={child.id}
                          className="flex flex-wrap items-end gap-3 rounded-xl bg-white/55 p-4"
                        >
                          <label className="grid flex-1 basis-[160px] gap-2 text-[11px] font-black uppercase tracking-[.22em] text-[#d36f8a]">
                            <span>Nome completo da criança {index + 1}</span>
                            <input
                              value={child.name}
                              onChange={(event) => {
                                updateChild(child.id, "name", event.target.value);
                                if (fieldErrors.children) setFieldErrors((cur) => ({ ...cur, children: "" }));
                              }}
                              className="w-full rounded-xl bg-[#ffe9f0] h-11 px-4 text-[15px] text-[#5b4a48] placeholder:text-[#cf93a7] placeholder:font-medium outline-none transition focus:ring-2 focus:ring-[#f3d3dd]"
                              placeholder={`Criança ${index + 1}`}
                            />
                          </label>
                          <label className="grid w-20 gap-2 text-[11px] font-black uppercase tracking-[.22em] text-[#d36f8a]">
                            <span>Idade</span>
                            <input
                              value={child.age}
                              onChange={(event) => {
                                updateChild(child.id, "age", event.target.value);
                                if (fieldErrors.children) setFieldErrors((cur) => ({ ...cur, children: "" }));
                              }}
                              type="number"
                              min="0"
                              className="w-full rounded-xl bg-[#ffe9f0] h-11 px-4 text-[15px] text-[#5b4a48] placeholder:text-[#cf93a7] placeholder:font-medium outline-none transition focus:ring-2 focus:ring-[#f3d3dd]"
                              placeholder="0"
                            />
                          </label>
                          <button
                            type="button"
                            onClick={() => removeChild(child.id)}
                            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/70 text-[#c86f87] transition hover:bg-[#fff3f7]"
                            aria-label={`Remover criança ${index + 1}`}
                          >
                            <Trash2 className="h-4 w-4" aria-hidden="true" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                  {fieldErrors.children && (
                    <p className="mt-3 text-xs font-semibold text-red-600">{fieldErrors.children}</p>
                  )}
                </div>
              </div>
              {error && (
                <p className="mt-4 rounded-2xl bg-red-50 px-4 py-3 text-sm font-bold text-red-700">
                  {error}
                </p>
              )}
              <button
                className="mt-6 w-full royal-button rounded-full px-7 py-4 text-lg font-black text-white shadow-[0_8px_24px_rgba(223,120,148,.24)] transition-all hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-70"
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Confirmando..." : "Confirmar presença"}
              </button>
            </motion.form>
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
          <img
            src="/coroa.png"
            alt=""
            aria-hidden="true"
            className="flex-shrink-0 h-7 w-7 sm:h-8 sm:w-8 drop-shadow-[0_4px_10px_rgba(215,173,85,0.35)]"
          />
          <div className="flex-1 h-px bg-gradient-to-r from-[#d7ad55]/60 via-[#d7ad55]/30 to-transparent" />
        </div>
      </motion.div>

      <section id="gifts" className="px-5 pb-32 pt-24 sm:px-8 lg:px-12">
        <GiftSuggestions />
      </section>

      <motion.section
        id="pix"
        className="px-5 pb-32 sm:px-8 lg:px-12"
        variants={sectionReveal}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-60px" }}
      >
        <div className="mx-auto max-w-6xl">
          <motion.div className="mb-12 text-center" variants={itemReveal}>
            <p className="mb-3 font-script text-6xl leading-[1.1] text-[#b85f78] sm:text-7xl">
              Pix Descomplica
            </p>
            <p className="mx-auto max-w-2xl text-lg leading-8 text-[#7e5f5b] flex flex-col">
              Prefere presentear com um valor? <span>É só usar o Pix, rápido, simples e
              com todo carinho.</span>
            </p>
          </motion.div>
          <motion.div
            variants={itemReveal}
            className="mx-auto max-w-2xl rounded-[2rem] bg-white/45 p-8 text-center shadow-[0_8px_30px_rgba(201,111,135,.06)]"
          >
            <div className="rounded-2xl bg-white/70 p-5">
              <p className="text-[11px] font-black uppercase tracking-[.22em] text-[#d36f8a]">
                Chave Pix
              </p>
              <p className="mt-2 font-mono text-lg font-black text-[#9d5f70]">
                {pixKey}
              </p>
            </div>
            <div className="mt-5 flex flex-wrap justify-center gap-3">
              {giftAmounts.map((amount) => (
                <span
                  key={amount}
                  className="rounded-full bg-[#fff1f4] px-5 py-2.5 text-base font-black text-[#b85f78]"
                >
                  {amount}
                </span>
              ))}
            </div>
            <button
              onClick={copyPix}
              className="royal-button mt-6 rounded-full px-8 py-3.5 font-bold text-white"
            >
              Copiar chave Pix
            </button>
            {copied && (
              <p className="mt-4 rounded-2xl bg-emerald-50 px-4 py-3 text-center text-sm font-bold text-emerald-700">
                Chave Pix copiada!
              </p>
            )}
          </motion.div>
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
          <img
            src="/coroa.png"
            alt=""
            aria-hidden="true"
            className="flex-shrink-0 h-7 w-7 sm:h-8 sm:w-8 drop-shadow-[0_4px_10px_rgba(215,173,85,0.35)]"
          />
          <div className="flex-1 h-px bg-gradient-to-r from-[#d7ad55]/60 via-[#d7ad55]/30 to-transparent" />
        </div>
      </motion.div>

      <motion.section
        id="evento"
        className="px-5 py-24 sm:px-8 lg:px-12"
        variants={sectionReveal}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-60px" }}
      >
        <div className="mx-auto max-w-6xl">
          <motion.div className="mb-10 text-center" variants={itemReveal}>
            <p className="font-semibold uppercase tracking-[.3em] text-[#d36f8a]">
              Informações
            </p>
            <h2 className="mt-3 font-script text-5xl text-[#b85f78] sm:text-6xl">
              Informações do convite real
            </h2>
          </motion.div>
          <motion.div
            variants={sectionReveal}
            className="mx-auto grid max-w-5xl gap-8 rounded-[2rem] bg-white/45 px-6 py-8 sm:grid-cols-2 lg:grid-cols-4"
          >
            {eventDetails.map((item) => (
              <motion.article
                key={item.label}
                variants={itemReveal}
                className="border-l border-[#f0c7d3]/70 pl-5 first:border-l-0 first:pl-0 sm:first:border-l sm:first:pl-5 lg:first:border-l-0 lg:first:pl-0"
              >
                <p className="text-[11px] font-black uppercase tracking-[.28em] text-[#d36f8a]">
                  {item.label}
                </p>
                <p className="mt-3 text-lg font-extrabold leading-snug text-[#7d625f]">
                  {item.value}
                </p>
              </motion.article>
            ))}
          </motion.div>

          <motion.div className="mx-auto mt-10 max-w-5xl" variants={itemReveal}>
            <LocationMap venue={venue} />
          </motion.div>
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
          <img
            src="/coroa.png"
            alt=""
            aria-hidden="true"
            className="flex-shrink-0 h-7 w-7 sm:h-8 sm:w-8 drop-shadow-[0_4px_10px_rgba(215,173,85,0.35)]"
          />
          <div className="flex-1 h-px bg-gradient-to-r from-[#d7ad55]/60 via-[#d7ad55]/30 to-transparent" />
        </div>
      </motion.div>

      <motion.section
        id="mural"
        className="px-5 py-24 sm:px-8 lg:px-12"
        variants={sectionReveal}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-60px" }}
      >
        <div className="mx-auto max-w-5xl">
          <motion.div className="mb-12 text-center" variants={itemReveal}>
            <p className="mb-3 font-script text-6xl leading-[1.1] text-[#b85f78] sm:text-7xl">
              Mural de Recados
            </p>
            <p className="mx-auto max-w-2xl text-lg leading-8 text-[#7e5f5b]">
              Deixe uma mensagem carinhosa para a princesa Diana
            </p>
          </motion.div>

          <motion.div
            variants={itemReveal}
            className="mx-auto flex max-w-2xl flex-col gap-6 rounded-[2rem] bg-white/45 px-6 py-8 shadow-[0_8px_30px_rgba(201,111,135,.06)] sm:px-9 sm:py-10"
          >
            <div className="flex flex-col gap-2">
              <label
                htmlFor="recado-nome"
                className="text-[11px] font-black uppercase tracking-[.28em] text-[#d36f8a]"
              >
                Seu nome
              </label>
              <input
                id="recado-nome"
                value={recadoNome}
                onChange={(e) => {
                  setRecadoNome(e.target.value);
                  if (recadoFieldErrors.nome) setRecadoFieldErrors((cur) => ({ ...cur, nome: "" }));
                }}
                placeholder="Como podemos te chamar?"
                className="h-11 w-full rounded-xl bg-[#ffe9f0] px-4 text-[15px] text-[#5b4a48] placeholder:text-[#cf93a7] placeholder:font-medium outline-none transition focus:ring-2 focus:ring-[#f3d3dd] aria-[invalid=true]:ring-2 aria-[invalid=true]:ring-red-400"
                aria-invalid={recadoFieldErrors.nome ? true : undefined}
              />
              {recadoFieldErrors.nome && (
                <span className="text-xs font-semibold text-red-600">{recadoFieldErrors.nome}</span>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <label
                htmlFor="recado-mensagem"
                className="text-[11px] font-black uppercase tracking-[.28em] text-[#d36f8a]"
              >
                Mensagem carinhosa
              </label>
              <textarea
                id="recado-mensagem"
                value={recadoMsg}
                onChange={(e) => {
                  setRecadoMsg(e.target.value);
                  if (recadoFieldErrors.mensagem) setRecadoFieldErrors((cur) => ({ ...cur, mensagem: "" }));
                }}
                placeholder="Escreva sua mensagem para a princesa Diana..."
                rows={5}
                maxLength={240}
                className="w-full resize-none rounded-xl bg-[#ffe9f0] px-4 py-3 text-[15px] text-[#5b4a48] placeholder:text-[#cf93a7] placeholder:font-medium outline-none transition focus:ring-2 focus:ring-[#f3d3dd] aria-[invalid=true]:ring-2 aria-[invalid=true]:ring-red-400"
                aria-invalid={recadoFieldErrors.mensagem ? true : undefined}
              />
              {recadoFieldErrors.mensagem && (
                <span className="text-xs font-semibold text-red-600">{recadoFieldErrors.mensagem}</span>
              )}
              <div className="flex items-center justify-between text-xs font-semibold text-[#9d6170]">
                <span>Sua mensagem aparece no mural para sempre</span>
                <span className="font-mono text-[#b78b8c]">
                  {recadoMsg.length}/240
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-3 border-t border-[#f0c7d3]/70 pt-5">
              <button
                type="button"
                onClick={enviarRecado}
                disabled={enviandoRecado}
                className="royal-button inline-flex w-full items-center justify-center rounded-full px-6 py-3.5 text-base font-normal text-white disabled:cursor-not-allowed disabled:opacity-70"
              >
                {enviandoRecado ? "Enviando..." : "Enviar recado"}
              </button>
              {recadoEnviado && (
                <p className="rounded-2xl bg-emerald-50 px-4 py-3 text-center text-sm font-bold text-emerald-700">
                  Recado enviado com carinho — obrigada por celebrar com a
                  princesa Diana!
                </p>
              )}
              {recadoError && (
                <p className="rounded-2xl bg-red-50 px-4 py-3 text-center text-sm font-bold text-red-700">
                  {recadoError}
                </p>
              )}
            </div>
          </motion.div>

          {recadosLoading ? (
            <p
              className="mt-10 text-center text-sm text-[#b78b8c]"
              aria-live="polite"
            >
              Carregando recados...
            </p>
          ) : null}

          {!recadosLoading && recadosError ? (
            <p
              className="mt-10 text-center text-sm text-[#b78b8c]"
              role="status"
            >
              {recadosError}
            </p>
          ) : null}

          {!recadosLoading && !recadosError && recados.length > 0 ? (
            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {recados.map((r) => (
                <div
                  key={r.id}
                  className="animate-rise flex min-w-0 flex-col rounded-[1.5rem] bg-white/72 p-5 shadow-[0_6px_18px_rgba(201,111,135,.06)]"
                >
                  <p className="break-words text-sm font-black text-[#d36f8a]">
                    {r.nome}
                  </p>
                  <p className="mt-2 whitespace-pre-line break-words leading-7 text-[#7d625f]">
                    {r.mensagem}
                  </p>
                  <p className="mt-auto flex items-center gap-1.5 pt-4 text-xs font-semibold text-[#b78b8c]">
                    <Calendar
                      className="h-3.5 w-3.5 text-[#d36f8a]"
                      strokeWidth={2.25}
                      aria-hidden="true"
                    />
                    {formatRecadoDate(r.createdAt)}
                  </p>
                </div>
              ))}
            </div>
          ) : null}

          {!recadosLoading && !recadosError && recados.length === 0 ? (
            <div className="mt-10 text-center text-lg text-[#b78b8c]">
              💭 Seja o primeiro a deixar um recado carinhoso!
            </div>
          ) : null}
        </div>
      </motion.section>

      {/* — Divisor decorativo (padrão da coroa em aquarela) — */}
      <motion.div
        className="flex items-center justify-center py-6"
        aria-hidden="true"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <div className="mx-auto flex w-full max-w-xs items-center gap-3">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#d7ad55]/30 to-[#d7ad55]/60" />
          <img
            src="/coroa.png"
            alt=""
            aria-hidden="true"
            className="h-7 w-7 flex-shrink-0 drop-shadow-[0_4px_10px_rgba(215,173,85,0.35)] sm:h-8 sm:w-8"
          />
          <div className="h-px flex-1 bg-gradient-to-r from-[#d7ad55]/60 via-[#d7ad55]/30 to-transparent" />
        </div>
      </motion.div>

      <motion.footer
        className="relative overflow-hidden border-t border-[#f5e2e7] bg-white/60 px-5 py-10 text-center text-sm font-semibold text-[#c15f78]"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <img
          src="/flor-canto.png"
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute bottom-0 left-0 w-24 rotate-180 select-none opacity-60 sm:w-28"
        />
        <img
          src="/flor-canto.png"
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute bottom-0 right-0 w-24 -scale-y-100 select-none opacity-60 sm:w-28"
        />
        <p className="relative font-script text-2xl text-[#b85f78] sm:text-3xl">
          Feito com carinho para celebrar o primeiro aninho da princesa Diana.
        </p>
        <p className="relative mt-3 text-xs font-medium uppercase tracking-[.28em] text-[#806562]">
          Desenvolvido por
          <a
            href="https://ivanreis.com.br"
            target="_blank"
            rel="noopener noreferrer"
            className="ml-2 inline-flex items-center gap-1.5 font-black text-[#c15f78] underline decoration-[#d7ad55]/70 decoration-2 underline-offset-4 transition hover:text-[#a64a64]"
          >
            Ivan Reis
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-3.5 w-3.5"
            >
              <path d="M7 17 17 7" />
              <path d="M8 7h9v9" />
            </svg>
          </a>
        </p>
      </motion.footer>
      </div>
    </main>
  );
}
