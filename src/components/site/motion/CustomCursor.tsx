"use client";

import { gsap } from "@/lib/gsap";
import { useEffect, useRef, useState } from "react";

export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement | null>(null);
  const ringRef = useRef<HTMLDivElement | null>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduced) return;

    const dot = dotRef.current;
    const ring = ringRef.current;
    const html = document.documentElement;
    if (!dot || !ring) return;

    setActive(true);
    html.dataset.cursor = "custom";
    gsap.set([dot, ring], { xPercent: -50, yPercent: -50 });

    const xDot = gsap.quickTo(dot, "x", { duration: 0.12, ease: "power3.out" });
    const yDot = gsap.quickTo(dot, "y", { duration: 0.12, ease: "power3.out" });
    const xRing = gsap.quickTo(ring, "x", { duration: 0.5, ease: "power3.out" });
    const yRing = gsap.quickTo(ring, "y", { duration: 0.5, ease: "power3.out" });

    const onMove = (event: PointerEvent) => {
      xDot(event.clientX);
      yDot(event.clientY);
      xRing(event.clientX);
      yRing(event.clientY);
    };

    const onOver = (event: PointerEvent) => {
      const target = event.target as HTMLElement | null;
      if (!target) return;
      const interactive = target.closest(
        "a, button, [data-cursor='hover'], input, textarea, [data-cursor='text']",
      );
      if (!interactive) return;
      const isText = interactive.matches(
        "input, textarea, [data-cursor='text']",
      );
      html.dataset.cursor = isText ? "text" : "hover";
    };

    const onOut = (event: PointerEvent) => {
      const target = event.target as HTMLElement | null;
      if (!target) return;
      if (target.closest("a, button, [data-cursor='hover'], input, textarea")) {
        html.dataset.cursor = "custom";
      }
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerover", onOver, { passive: true });
    document.addEventListener("pointerout", onOut, { passive: true });

    return () => {
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerover", onOver);
      document.removeEventListener("pointerout", onOut);
      delete html.dataset.cursor;
    };
  }, []);

  if (!active) return null;

  return (
    <>
      <div ref={dotRef} className="cursor-dot" aria-hidden="true" />
      <div ref={ringRef} className="cursor-ring" aria-hidden="true" />
    </>
  );
}
