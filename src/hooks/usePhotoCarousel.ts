"use client";

import { useEffect, useRef, useState } from "react";

export interface GalleryPhoto {
  src: string;
  alt: string;
}

export interface UsePhotoCarouselResult {
  activeIndex: number;
  isAutoPlaying: boolean;
  select: (index: number) => void;
  next: () => void;
  prev: () => void;
}

export interface UsePhotoCarouselOptions {
  interval?: number;
  reducedMotion?: boolean;
}

const DEFAULT_INTERVAL = 5000;
const MIN_INTERVAL = 3000;
const MAX_INTERVAL = 7000;

export function usePhotoCarousel(
  total: number,
  opts: UsePhotoCarouselOptions = {},
): UsePhotoCarouselResult {
  const { interval = DEFAULT_INTERVAL, reducedMotion = false } = opts;
  const safeInterval = Math.min(
    Math.max(interval, MIN_INTERVAL),
    MAX_INTERVAL,
  );

  const [activeIndex, setActiveIndex] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const isAutoPlaying = total > 1 && !reducedMotion;

  function clearTimer() {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }

  function startInterval() {
    if (total <= 1 || reducedMotion) return;
    intervalRef.current = setInterval(() => {
      setActiveIndex((current) => (current + 1) % total);
    }, safeInterval);
  }

  function restartInterval() {
    clearTimer();
    startInterval();
  }

  useEffect(() => {
    startInterval();
    return () => clearTimer();
  }, [total, safeInterval, reducedMotion]);

  function select(index: number) {
    if (total === 0) return;
    const safeIndex = Math.min(Math.max(index, 0), total - 1);
    setActiveIndex(safeIndex);
    restartInterval();
  }

  function next() {
    if (total === 0) return;
    setActiveIndex((current) => (current + 1) % total);
    restartInterval();
  }

  function prev() {
    if (total === 0) return;
    setActiveIndex((current) => (current - 1 + total) % total);
    restartInterval();
  }

  return {
    activeIndex,
    isAutoPlaying,
    select,
    next,
    prev,
  };
}
