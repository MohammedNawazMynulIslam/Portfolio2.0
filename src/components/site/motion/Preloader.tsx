"use client";

import { gsap } from "@/lib/gsap";
import { useGSAP } from "@gsap/react";
import { useRef } from "react";

import { useMotion } from "@/components/site/motion/MotionProvider";

interface PreloaderProps {
  name: string;
  role: string;
}

export function Preloader({ name, role }: PreloaderProps) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const countRef = useRef<HTMLSpanElement | null>(null);
  const lineRef = useRef<HTMLDivElement | null>(null);
  const nameRef = useRef<HTMLDivElement | null>(null);
  const { setReady } = useMotion();

  useGSAP(
    () => {
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduced) {
        if (countRef.current) countRef.current.textContent = "100";
        if (lineRef.current) lineRef.current.style.transform = "scaleX(1)";
        setReady(true);
        return;
      }

      const counter = { value: 0 };
      const tl = gsap.timeline();

      tl.from(nameRef.current, {
        yPercent: 130,
        duration: 0.9,
        ease: "power4.out",
      });

      tl.to(
        counter,
        {
          value: 100,
          duration: 1.7,
          ease: "power2.inOut",
          onUpdate: () => {
            if (countRef.current) {
              countRef.current.textContent = String(
                Math.round(counter.value),
              ).padStart(3, "0");
            }
          },
        },
        0.15,
      );

      tl.to(
        lineRef.current,
        { scaleX: 1, duration: 1.9, ease: "power2.inOut" },
        0.15,
      );

      tl.to(
        rootRef.current,
        {
          yPercent: -100,
          duration: 0.95,
          ease: "power4.inOut",
          onComplete: () => setReady(true),
        },
        "+=0.15",
      );
    },
    { scope: rootRef },
  );

  return (
    <div
      ref={rootRef}
      data-preloader
      className="fixed inset-0 z-[10000] flex flex-col justify-between bg-background px-6 py-8 sm:px-10 sm:py-10"
    >
      <div className="flex items-start justify-between">
        <span className="label text-muted">Loading</span>
        <span className="label text-muted">{role}</span>
      </div>

      <div className="flex items-end justify-between gap-6">
        <div ref={nameRef} className="min-w-0 flex-1 overflow-hidden">
          <p className="serif text-[11vw] leading-[0.9] tracking-tight sm:text-[8.5vw]">
            {name}
          </p>
        </div>
        <span
          ref={countRef}
          className="serif shrink-0 text-[11vw] leading-[0.9] tracking-tight text-accent sm:text-[8.5vw]"
        >
          000
        </span>
      </div>

      <div className="h-px w-full origin-left scale-x-0 bg-foreground/30" ref={lineRef} />
    </div>
  );
}
