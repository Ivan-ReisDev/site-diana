"use client";

import { useEffect } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Volume2, VolumeX, SkipForward, Sparkles } from "lucide-react";
import { useIntroSequence } from "@/hooks/useIntroSequence";

export interface IntroOverlayProps {
  onComplete: () => void;
  videoSrc?: string;
  inviteMessage?: string;
}

const DEFAULT_MESSAGE =
  "Mamãe e Papai têm a honra de convidar você para celebrar o 1º aniversário da nossa Princesa Diana.";

export function IntroOverlay({
  onComplete,
  videoSrc = "/convite-video.mp4",
  inviteMessage = DEFAULT_MESSAGE,
}: IntroOverlayProps) {
  const {
    stage,
    videoStatus,
    soundOn,
    start,
    skip,
    onVideoEnded,
    onVideoError,
    toggleSound,
    videoRef,
  } = useIntroSequence();

  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  // Pré-carrega o vídeo em segundo plano assim que o overlay monta (enquanto a
  // pessoa lê o convite), para que ao clicar a reprodução comece instantânea —
  // o vídeo já estará em cache no dispositivo.
  useEffect(() => {
    videoRef.current?.load();
  }, [videoRef]);

  const transition = prefersReducedMotion
    ? { duration: 0.2 }
    : { duration: 0.85, ease: [0.22, 1, 0.36, 1] as const };

  const stageVariants = {
    initial: { opacity: 0, scale: prefersReducedMotion ? 1 : 1.03 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: prefersReducedMotion ? 1 : 1.02 },
  };

  return (
    <div
      className="fixed inset-0 z-[100] overflow-hidden bg-black"
      role="dialog"
      aria-modal="true"
      aria-label="Convocação Real"
    >
      {/* Vídeo sempre montado para que videoRef exista no clique do botão
          (necessário para iniciar a reprodução com som dentro do gesto). */}
      <div
        className={
          "absolute inset-0 flex items-center justify-center bg-black transition-opacity duration-700 ease-out " +
          (stage === "video"
            ? "z-10 opacity-100"
            : "-z-10 opacity-0 pointer-events-none")
        }
        aria-hidden={stage !== "video"}
      >
        <video
          ref={videoRef}
          src={videoSrc}
          preload="auto"
          playsInline
          onEnded={onVideoEnded}
          onError={onVideoError}
          className="h-full w-full object-cover sm:object-contain"
          aria-label="Vídeo do convite da princesa Diana"
        />
        {stage === "video" && videoStatus === "loading" && (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center text-white/80">
            <span className="text-lg font-semibold">Carregando vídeo...</span>
          </div>
        )}
      </div>

      <AnimatePresence>
        {stage === "invite" && (
          <motion.section
            key="invite"
            className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#fff8f6] via-[#fff0f5] to-[#fffaf7] px-6 py-12"
            variants={stageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={transition}
          >
            <div className="relative max-w-xl text-center">
              <motion.img
                src="/sapatinho.png"
                alt=""
                aria-hidden="true"
                className="mx-auto mb-5 w-40 select-none drop-shadow-[0_16px_28px_rgba(201,111,135,0.28)] sm:w-52"
                animate={
                  prefersReducedMotion
                    ? undefined
                    : { y: [0, -10, 0], rotate: [0, -2, 0] }
                }
                transition={
                  prefersReducedMotion
                    ? undefined
                    : { duration: 4.5, repeat: Infinity, ease: "easeInOut" }
                }
              />
              <p className="mb-4 text-sm font-black uppercase tracking-[.3em] text-[#d36f8a]">
                Convocação Real
              </p>
              <h1 className="font-script text-4xl leading-[1.15] text-[#b85f78] sm:text-5xl md:text-6xl">
                {inviteMessage}
              </h1>
              <div className="mt-10">
                <button
                  type="button"
                  onClick={start}
                  autoFocus
                  className="royal-button inline-flex min-h-[48px] items-center justify-center gap-2 rounded-full px-9 py-3.5 text-base font-black text-white focus:outline-none focus-visible:ring-4 focus-visible:ring-[#d5a547]/60"
                  aria-label="Abrir o vídeo do convite"
                >
                  <span>Abrir o Convite</span>
                  <Sparkles className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
            </div>
          </motion.section>
        )}

        {stage === "video" && (
          <motion.section
            key="video"
            className="absolute inset-0 z-20"
            variants={stageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={transition}
          >
            <div className="absolute right-4 top-4 flex gap-3">
              <button
                type="button"
                onClick={toggleSound}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-white/30 bg-black/40 text-white backdrop-blur-sm transition hover:bg-black/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
                aria-label={soundOn ? "Silenciar vídeo" : "Ativar som do vídeo"}
                aria-pressed={soundOn}
              >
                {soundOn ? (
                  <Volume2 className="h-5 w-5" aria-hidden="true" />
                ) : (
                  <VolumeX className="h-5 w-5" aria-hidden="true" />
                )}
              </button>
              <button
                type="button"
                onClick={skip}
                className="inline-flex h-11 items-center justify-center gap-1.5 rounded-full border border-white/30 bg-black/40 px-4 text-sm font-bold text-white backdrop-blur-sm transition hover:bg-black/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
                aria-label="Pular vídeo"
              >
                <SkipForward className="h-4 w-4" aria-hidden="true" />
                Pular
              </button>
            </div>

            {/* Controles flutuantes sutis — apenas mobile */}
            <div className="absolute inset-x-0 bottom-6 flex items-center justify-center gap-5 px-6 sm:hidden">
              <button
                type="button"
                onClick={toggleSound}
                className="flex h-11 w-11 items-center justify-center rounded-full bg-black/25 text-white/75 backdrop-blur-sm transition active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
                aria-label={soundOn ? "Silenciar vídeo" : "Ativar som do vídeo"}
                aria-pressed={soundOn}
              >
                {soundOn ? (
                  <Volume2 className="h-5 w-5" aria-hidden="true" />
                ) : (
                  <VolumeX className="h-5 w-5" aria-hidden="true" />
                )}
              </button>
              <button
                type="button"
                onClick={skip}
                className="inline-flex h-11 items-center justify-center gap-1.5 rounded-full bg-black/25 px-4 text-sm font-semibold text-white/75 backdrop-blur-sm transition active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
                aria-label="Pular vídeo"
              >
                <SkipForward className="h-4 w-4" aria-hidden="true" />
                Pular
              </button>
            </div>

            {videoStatus === "error" && (
              <div className="absolute inset-x-0 bottom-24 flex justify-center px-4">
                <button
                  type="button"
                  onClick={skip}
                  className="royal-button inline-flex min-h-[48px] items-center justify-center rounded-full px-6 py-2.5 text-sm font-black text-white"
                  aria-label="Avançar sem assistir o vídeo"
                >
                  Avançar para o convite
                </button>
              </div>
            )}
          </motion.section>
        )}

        {stage === "final" && (
          <motion.section
            key="final"
            className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#fff8f6] via-[#fff0f5] to-[#fffaf7] px-6 py-12"
            variants={stageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={transition}
          >
            <div className="relative max-w-xl text-center">
              <motion.img
                src="/sapatinho.png"
                alt=""
                aria-hidden="true"
                className="mx-auto mb-5 w-36 select-none drop-shadow-[0_16px_28px_rgba(201,111,135,0.28)] sm:w-44"
                animate={
                  prefersReducedMotion
                    ? undefined
                    : { y: [0, -10, 0], rotate: [0, -2, 0] }
                }
                transition={
                  prefersReducedMotion
                    ? undefined
                    : { duration: 4.5, repeat: Infinity, ease: "easeInOut" }
                }
              />
              <p className="mb-4 text-sm font-black uppercase tracking-[.3em] text-[#d36f8a]">
                Convocação Real
              </p>
              <h2 className="font-script text-3xl leading-[1.2] text-[#b85f78] sm:text-4xl md:text-5xl">
                Sua presença será o maior presente!
              </h2>
              <div className="mt-10">
                <button
                  type="button"
                  onClick={onComplete}
                  autoFocus
                  className="royal-button inline-flex min-h-[48px] items-center justify-center gap-2 rounded-full px-9 py-3.5 text-base font-black text-white focus:outline-none focus-visible:ring-4 focus-visible:ring-[#d5a547]/60"
                  aria-label="Confirmar presença e entrar no site"
                >
                  Confirmar Presença
                </button>
              </div>
            </div>
          </motion.section>
        )}
      </AnimatePresence>
    </div>
  );
}
