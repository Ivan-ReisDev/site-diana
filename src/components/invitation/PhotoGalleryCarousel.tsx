"use client";

import { useCallback, useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { ImageOff } from "lucide-react";
import { usePhotoCarousel, type GalleryPhoto } from "@/hooks/usePhotoCarousel";

export interface PhotoGalleryCarouselProps {
  photos: GalleryPhoto[];
  interval?: number;
}

export const galleryPhotos: GalleryPhoto[] = [
  { src: "/galeria/diana-1.jpg", alt: "Diana sorrindo no jardim" },
  { src: "/galeria/diana-2.jpg", alt: "Diana com sua roupa de princesa" },
  { src: "/galeria/diana-3.jpg", alt: "Diana brincando com o castelo de brinquedo" },
  { src: "/galeria/diana-4.jpg", alt: "Diana com a coroa real" },
];

export function PhotoGalleryCarousel({
  photos,
  interval,
}: PhotoGalleryCarouselProps) {
  const total = photos.length;
  const prefersReducedMotion = useReducedMotion();
  const reducedMotion = Boolean(prefersReducedMotion);
  const { activeIndex, select } = usePhotoCarousel(total, {
    interval,
    reducedMotion,
  });
  const [loadStatus, setLoadStatus] = useState<"loading" | "loaded" | "error">(
    "loading",
  );
  const [displayedIndex, setDisplayedIndex] = useState(activeIndex);
  const [previousIndex, setPreviousIndex] = useState<number | null>(null);

  const activePhoto = photos[activeIndex];
  const displayedPhoto = previousIndex !== null ? photos[previousIndex] : null;
  const hasMultiple = total > 1;

  const transitionMs = reducedMotion ? 0 : 550;

  useEffect(() => {
    if (activeIndex === displayedIndex) return;
    setPreviousIndex(displayedIndex);
    setDisplayedIndex(activeIndex);
    setLoadStatus("loading");
    const timer = setTimeout(() => setPreviousIndex(null), transitionMs);
    return () => clearTimeout(timer);
  }, [activeIndex, displayedIndex, transitionMs]);

  const handleError = useCallback(() => {
    setLoadStatus("error");
  }, []);

  const handleLoad = useCallback(() => {
    setLoadStatus("loaded");
  }, []);

  const handleSelect = useCallback(
    (index: number) => {
      select(index);
    },
    [select],
  );

  if (total === 0) {
    return (
      <div
        className="flex aspect-[4/5] w-full items-center justify-center rounded-[2rem] bg-[#fff0f5]"
        aria-live="polite"
      >
        <span className="text-sm font-semibold text-[#c15f78]">Nenhuma foto disponível</span>
      </div>
    );
  }

  return (
    <div className="w-full" aria-roledescription="carrossel" aria-label="Galeria de fotos da Diana">
      <div className="flex flex-col gap-4 lg:flex-row lg:gap-5">
        {/* Foto em destaque */}
        <div className="relative w-full overflow-hidden rounded-[2rem] bg-[#fff0f5] shadow-[0_10px_30px_rgba(201,111,135,.08)] aspect-[4/5] sm:aspect-square lg:aspect-[4/5]">
          {/* Previous layer */}
          {displayedPhoto && (
            <div
              className="absolute inset-0 transition-opacity"
              style={{ opacity: 0, transitionDuration: `${transitionMs}ms` }}
              aria-hidden="true"
            >
              {previousIndex !== null && loadStatus === "error" ? (
                <div className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-[#fff0f5] to-[#ffe1ea]">
                  <ImageOff
                    className="h-10 w-10 text-[#df7894]"
                    strokeWidth={1.5}
                    aria-hidden="true"
                  />
                  <span className="mt-3 text-sm font-semibold text-[#c15f78]">Não foi possível carregar a foto</span>
                </div>
              ) : (
                <img
                  src={displayedPhoto.src}
                  alt=""
                  className="h-full w-full object-cover"
                />
              )}
            </div>
          )}

          {/* Current layer */}
          <div
            className="absolute inset-0 transition-opacity"
            style={{
              opacity: loadStatus === "error" ? 0 : 1,
              transitionDuration: `${transitionMs}ms`,
            }}
          >
            {loadStatus === "error" ? (
              <div className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-[#fff0f5] to-[#ffe1ea]">
                <ImageOff
                  className="h-10 w-10 text-[#df7894]"
                  strokeWidth={1.5}
                  aria-hidden="true"
                />
                <span className="mt-3 text-sm font-semibold text-[#c15f78]">Não foi possível carregar a foto</span>
              </div>
            ) : (
              <img
                key={activePhoto.src}
                src={activePhoto.src}
                alt={activePhoto.alt}
                loading={activeIndex === 0 ? "eager" : "lazy"}
                onError={handleError}
                onLoad={handleLoad}
                className="h-full w-full object-cover"
              />
            )}
          </div>
        </div>

        {/* Miniaturas */}
        {hasMultiple && (
          <div
            className="flex gap-3 overflow-x-auto scroll-smooth snap-x pb-2 pt-1 lg:flex-col lg:overflow-visible lg:pb-0 lg:pt-0"
            role="tablist"
            aria-label="Miniaturas da galeria"
          >
            {photos.map((photo, index) => (
              <button
                key={photo.src}
                type="button"
                role="tab"
                aria-label={`Ver ${photo.alt}`}
                aria-current={activeIndex === index ? "true" : undefined}
                aria-selected={activeIndex === index}
                onClick={() => handleSelect(index)}
                className={`relative h-14 w-14 flex-shrink-0 snap-start overflow-hidden rounded-2xl transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[#d5a547]/60 sm:h-16 sm:w-16 lg:h-[4.5rem] lg:w-[4.5rem] ${
                  activeIndex === index
                    ? "ring-2 ring-[#df7894] ring-offset-2 ring-offset-[#fff8f6]"
                    : "opacity-80 hover:opacity-100"
                }`}
              >
                <img
                  src={photo.src}
                  alt=""
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
