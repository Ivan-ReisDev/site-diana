"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export interface UseBackgroundMusicOptions {
  volume?: number;
}

export interface UseBackgroundMusicResult {
  isPlaying: boolean;
  toggle: () => void;
}

export function useBackgroundMusic(
  audioRef: React.RefObject<HTMLAudioElement | null>,
  { volume = 0.3 }: UseBackgroundMusicOptions = {}
): UseBackgroundMusicResult {
  const [isPlaying, setIsPlaying] = useState(false);
  const hasStartedRef = useRef(false);
  const isMutedByUserRef = useRef(false);

  const getPreference = useCallback((): string => {
    try {
      if (typeof window !== "undefined" && window.sessionStorage) {
        return window.sessionStorage.getItem("bgMusic") || "on";
      }
    } catch {
      // ignore storage errors
    }
    return "on";
  }, []);

  const setPreference = useCallback((value: "on" | "off") => {
    try {
      if (typeof window !== "undefined" && window.sessionStorage) {
        window.sessionStorage.setItem("bgMusic", value);
      }
    } catch {
      // ignore storage errors
    }
  }, []);

  const start = useCallback(async () => {
    const audio = audioRef.current;
    if (!audio || hasStartedRef.current) return;
    if (isMutedByUserRef.current || getPreference() === "off") return;

    hasStartedRef.current = true;
    audio.volume = volume;
    audio.loop = true;
    try {
      await audio.play();
      setIsPlaying(true);
    } catch {
      // fail silently (autoplay policy rejection)
      hasStartedRef.current = false;
    }
  }, [audioRef, volume, getPreference]);

  const toggle = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
      isMutedByUserRef.current = true;
      setPreference("off");
    } else {
      audio.volume = volume;
      audio.loop = true;
      isMutedByUserRef.current = false;
      setPreference("on");
      try {
        const playPromise = audio.play();
        setIsPlaying(true);
        hasStartedRef.current = true;
        if (playPromise) {
          playPromise.catch(() => {
            // fail silently
            setIsPlaying(false);
            hasStartedRef.current = false;
          });
        }
      } catch {
        setIsPlaying(false);
      }
    }
  }, [audioRef, isPlaying, setPreference, volume]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const events = ["pointerdown", "click", "touchstart", "keydown", "scroll"];
    const options: AddEventListenerOptions = { once: true, passive: true };

    const onFirstInteraction = () => {
      void start();
    };

    for (const event of events) {
      window.addEventListener(event, onFirstInteraction, options);
    }

    return () => {
      for (const event of events) {
        window.removeEventListener(event, onFirstInteraction, options);
      }
    };
  }, [start]);

  return { isPlaying, toggle };
}
