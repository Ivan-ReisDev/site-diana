"use client";

import { Volume2, VolumeX } from "lucide-react";
import { useRef } from "react";
import { useBackgroundMusic } from "@/hooks/useBackgroundMusic";

export interface BackgroundMusicProps {
  src?: string;
  volume?: number;
}

export function BackgroundMusic({
  src = "/musica-convite.mp3",
  volume = 0.3,
}: BackgroundMusicProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const { isPlaying, toggle } = useBackgroundMusic(audioRef, { volume });

  return (
    <>
      <audio
        ref={audioRef}
        loop
        preload="none"
        src={src}
        aria-hidden="true"
        className="hidden"
      />
      <button
        type="button"
        onClick={toggle}
        aria-label={isPlaying ? "Desligar música" : "Ligar música"}
        aria-pressed={isPlaying}
        className="fixed bottom-6 right-6 z-50 flex h-12 w-12 items-center justify-center rounded-full border border-white/70 bg-white/80 shadow-[0_12px_28px_rgba(201,111,135,0.18)] backdrop-blur-md transition-transform duration-300 hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#d5a547] active:scale-95"
      >
        {isPlaying ? (
          <Volume2 className="h-5 w-5 text-[#c86f87]" aria-hidden="true" />
        ) : (
          <VolumeX className="h-5 w-5 text-[#c86f87]" aria-hidden="true" />
        )}
      </button>
    </>
  );
}
