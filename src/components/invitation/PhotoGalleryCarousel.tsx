"use client";

import { useCallback, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ImageOff } from "lucide-react";
import { usePhotoCarousel, type GalleryPhoto } from "@/hooks/usePhotoCarousel";

export type { GalleryPhoto };

export interface PhotoGalleryCarouselProps {
  photos: GalleryPhoto[];
  interval?: number;
}

export const galleryPhotos: GalleryPhoto[] = [
  { src: "/galeria/diana-1.jpg", alt: "Diana sorrindo no jardim" },
  { src: "/galeria/diana-2.jpg", alt: "Diana com sua roupa de princesa" },
  { src: "/galeria/diana-3.jpg", alt: "Diana brincando com o castelo de brinquedo" },
];

function FeaturedPlaceholder() {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-[#fff0f5] to-[#ffe1ea]">
      <ImageOff className="h-10 w-10 text-[#df7894]" strokeWidth={1.5} aria-hidden="true" />
      <span className="mt-3 text-sm font-semibold text-[#c15f78]">
        Não foi possível carregar a foto
      </span>
    </div>
  );
}

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
  const [erroredSrcs, setErroredSrcs] = useState<Set<string>>(new Set());

  const handleError = useCallback((src: string) => {
    setErroredSrcs((prev) => {
      const next = new Set(prev);
      next.add(src);
      return next;
    });
  }, []);

  const handleSelect = useCallback((index: number) => select(index), [select]);

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

  const activePhoto = photos[activeIndex];
  const hasMultiple = total > 1;
  const isErrored = erroredSrcs.has(activePhoto.src);

  // Crossfade suave com leve zoom; instantâneo quando o usuário prefere menos movimento.
  const transition = reducedMotion
    ? { duration: 0 }
    : { duration: 0.9, ease: [0.22, 1, 0.36, 1] as const };

  return (
    <div className="w-full" aria-roledescription="carrossel" aria-label="Galeria de fotos da Diana">
      <div className="flex flex-col gap-4 lg:flex-row lg:gap-5">
        {/* Foto em destaque */}
        <div className="relative h-[44vh] max-h-[520px] w-full overflow-hidden rounded-[2rem] bg-[#fff0f5] shadow-[0_10px_30px_rgba(201,111,135,.08)] sm:h-[50vh] lg:h-[58vh]">
          <AnimatePresence initial={false}>
            <motion.div
              key={activePhoto.src}
              className="absolute inset-0"
              initial={{ opacity: 0, scale: reducedMotion ? 1 : 1.06 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={transition}
            >
              {isErrored ? (
                <FeaturedPlaceholder />
              ) : (
                <img
                  src={activePhoto.src}
                  alt={activePhoto.alt}
                  loading={activeIndex === 0 ? "eager" : "lazy"}
                  onError={() => handleError(activePhoto.src)}
                  className="h-full w-full object-cover"
                />
              )}
            </motion.div>
          </AnimatePresence>
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
                className={`relative h-14 w-14 flex-shrink-0 snap-start overflow-hidden rounded-2xl transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#d5a547]/60 sm:h-16 sm:w-16 lg:h-[4.5rem] lg:w-[4.5rem] ${
                  activeIndex === index
                    ? "ring-2 ring-[#df7894] ring-offset-2 ring-offset-[#fff8f6]"
                    : "opacity-70 hover:opacity-100"
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
