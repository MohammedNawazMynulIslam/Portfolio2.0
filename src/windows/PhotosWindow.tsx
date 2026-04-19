"use client";

import gsap from "gsap";
import { ChevronLeft, ChevronRight, Image as ImageIcon, Search, X } from "lucide-react";
import Image from "next/image";
import { useMemo, useRef, useState } from "react";

import { PHOTOS_LIBRARY } from "@/constants/data";
import { useIsomorphicLayoutEffect } from "@/hooks/useIsomorphicLayoutEffect";
import { withWindow } from "@/hoc/withWindow";

function PhotosWindow() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const lightboxRef = useRef<HTMLDivElement | null>(null);

  const groupedPhotos = useMemo(() => {
    return PHOTOS_LIBRARY.reduce<Record<string, Array<(typeof PHOTOS_LIBRARY)[number]>>>(
      (groups, photo) => {
      groups[photo.month] = [...(groups[photo.month] ?? []), photo];
      return groups;
      },
      {},
    );
  }, []);

  const activePhoto = activeIndex !== null ? PHOTOS_LIBRARY[activeIndex] : null;

  useIsomorphicLayoutEffect(() => {
    if (!lightboxRef.current || activePhoto === null) {
      return;
    }

    const context = gsap.context(() => {
      gsap.fromTo(
        lightboxRef.current,
        { autoAlpha: 0, scale: 0.9 },
        {
          autoAlpha: 1,
          scale: 1,
          duration: 0.25,
          ease: "power2.out",
        },
      );
    }, lightboxRef);

    return () => context.revert();
  }, [activePhoto?.id]);

  const goToPrevious = () => {
    if (activeIndex === null) {
      return;
    }

    setActiveIndex((activeIndex - 1 + PHOTOS_LIBRARY.length) % PHOTOS_LIBRARY.length);
  };

  const goToNext = () => {
    if (activeIndex === null) {
      return;
    }

    setActiveIndex((activeIndex + 1) % PHOTOS_LIBRARY.length);
  };

  return (
    <div className="flex h-full flex-col bg-[linear-gradient(180deg,rgba(255,255,255,0.88),rgba(244,247,255,0.84))] text-slate-900">
      <header className="glass flex items-center justify-between border-b-0 px-5 py-3">
        <div className="flex items-center gap-2">
          {["Library", "Albums", "For You"].map((tab, index) => (
            <button
              key={tab}
              type="button"
              className={`rounded-full px-3 py-1.5 text-sm font-medium transition ${
                index === 0 ? "bg-slate-900 text-white" : "text-slate-600 hover:bg-slate-200/70"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
        <button
          type="button"
          aria-label="Search photos"
          className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200/80 bg-white text-slate-600 shadow-sm"
        >
          <Search className="h-4 w-4" />
        </button>
      </header>

      <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5">
        {Object.entries(groupedPhotos).map(([month, photos]) => (
          <section key={month} className="mb-8 last:mb-0">
            <h2 className="mb-4 text-lg font-semibold text-slate-800">{month}</h2>
            <div className="columns-2 gap-4 md:columns-3">
              {photos.map((photo) => {
                const globalIndex = PHOTOS_LIBRARY.findIndex((item) => item.id === photo.id);

                return (
                  <button
                    key={photo.id}
                    type="button"
                    onClick={() => setActiveIndex(globalIndex)}
                    className="group relative mb-4 block w-full overflow-hidden rounded-2xl bg-white text-left shadow-[0_12px_30px_rgba(15,23,42,0.10)] transition hover:-translate-y-1"
                  >
                    <div className="overflow-hidden rounded-2xl">
                      <Image
                        src={photo.src}
                        alt={photo.title}
                        width={900}
                        height={900}
                        className="h-auto w-full rounded-2xl object-cover transition duration-300 group-hover:scale-[1.03] group-hover:shadow-[0_20px_45px_rgba(15,23,42,0.18)]"
                      />
                    </div>
                    <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent px-4 py-4 text-white opacity-0 transition group-hover:opacity-100">
                      <p className="text-sm font-medium">{photo.title}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </section>
        ))}
      </div>

      {activePhoto ? (
        <div
          ref={lightboxRef}
          className="absolute inset-0 z-20 flex items-center justify-center bg-slate-950/75 p-6 backdrop-blur-md"
        >
          <button
            type="button"
            onClick={() => setActiveIndex(null)}
            aria-label="Close lightbox"
            className="absolute right-5 top-5 flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white transition hover:bg-white/15"
          >
            <X className="h-5 w-5" />
          </button>

          <button
            type="button"
            onClick={goToPrevious}
            aria-label="Previous image"
            className="absolute left-5 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white transition hover:bg-white/15"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          <div className="flex max-h-full w-full max-w-4xl flex-col items-center">
            <div className="relative flex max-h-[70vh] w-full items-center justify-center overflow-hidden rounded-[28px] bg-black/30">
              <Image
                src={activePhoto.src}
                alt={activePhoto.title}
                width={1200}
                height={900}
                className="max-h-[70vh] w-auto max-w-[80%] rounded-2xl object-contain"
              />
            </div>
            <div className="mt-5 text-center text-white">
              <p className="text-lg font-semibold">{activePhoto.title}</p>
              <p className="mt-2 max-w-2xl text-sm text-white/70">{activePhoto.caption}</p>
            </div>
          </div>

          <button
            type="button"
            onClick={goToNext}
            aria-label="Next image"
            className="absolute right-5 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white transition hover:bg-white/15"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      ) : null}
    </div>
  );
}

export default withWindow(PhotosWindow, {
  id: "photos",
  title: "Photos",
  icon: ImageIcon,
  defaultSize: { w: 800, h: 540 },
});
